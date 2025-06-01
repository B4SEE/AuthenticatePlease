'use client';

import { useEffect, useReducer, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gameReducer, initialGameState, getSettings } from './gameReducer';
import { generateEmail, shouldGenerateNewEmail } from './emailGenerator';
import { Email, GameStatistics } from './types';
import LoginForm from '../../components/LoginForm';
import SurveyForm from '../../components/SurveyForm';
import { saveLastGameStats } from '../statistics/utils';

export default function Game() {
  const router = useRouter();
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null);
  const [selectedIgnoredEmail, setSelectedIgnoredEmail] = useState<Email | null>(null);

  useEffect(() => {
    const newSettings = getSettings();
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: {
        timerLength: newSettings.timerLength,
        emailsToIgnore: newSettings.emailsToIgnore,
      },
    });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gameSettings') {
        const updated = getSettings();
        dispatch({
          type: 'UPDATE_SETTINGS',
          settings: {
            timerLength: updated.timerLength,
            emailsToIgnore: updated.emailsToIgnore,
          },
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const checkSettings = () => {
      const updated = getSettings();
      dispatch({
        type: 'UPDATE_SETTINGS',
        settings: {
          timerLength: updated.timerLength,
          emailsToIgnore: updated.emailsToIgnore,
        },
      });
    };
    const interval = setInterval(checkSettings, 1000);
    return () => clearInterval(interval);
  }, []);

  const saveGameStats = useCallback(
    async (endReason: GameStatistics['endReason']) => {
      const avgResponseTime =
        state.statistics.responseTimes.length > 0
          ? state.statistics.responseTimes.reduce((a, b) => a + b, 0) /
            state.statistics.responseTimes.length
          : 0;
      const stats: GameStatistics = {
        score: Math.max(0, state.score),
        totalEmails: state.statistics.totalEmails,
        phishingDetected: state.statistics.phishingDetected,
        legitimateAllowed: state.statistics.legitimateAllowed,
        falsePositives: state.statistics.falsePositives,
        falseNegatives: state.statistics.falseNegatives,
        avgResponseTime,
        endReason,
      };
      await saveLastGameStats(stats);
    },
    [state.score, state.statistics]
  );

  useEffect(() => {
    const handleGameOver = async () => {
      if (state.score < 0 && !state.statistics.falseNegatives) {
        await saveGameStats('game_over');
        router.push('/game-over');
      }
    };
    handleGameOver();
  }, [state.score, router, saveGameStats, state.statistics.falseNegatives]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.isPaused) {
        dispatch({ type: 'TICK' });
        if (shouldGenerateNewEmail(state.emails, 5)) {
          dispatch({ type: 'ADD_EMAIL', email: generateEmail() });
        }
        state.emails.forEach((email) => {
          if (email.timeLimit <= 0) {
            dispatch({ type: 'REMOVE_EMAIL', id: email.id });
            dispatch({ type: 'UPDATE_SCORE', points: -3 });
          }
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isPaused, state.emails]);

  const handleReport = useCallback(
    (email: Email) => {
      const audio = new Audio(email.isPhishing ? '/sounds/success.mp3' : '/sounds/error.mp3');
      audio.play().catch((e) => console.error("Sound error:", e)); //added
      if (showLoginForm) {
        setShowLoginForm(false);
        setCurrentEmail(null);
      }
      if (selectedIgnoredEmail) {
        dispatch({ type: 'REPORT_IGNORED_EMAIL', id: email.id });
        setSelectedIgnoredEmail(null);
      } else {
        dispatch({ type: 'REPORT_EMAIL', id: email.id });
      }
      setCurrentEmail(null);
    },
    [showLoginForm, selectedIgnoredEmail]
  );

  const handleAllow = useCallback((email: Email) => {
    setShowLoginForm(true);
    setCurrentEmail(email);
  }, []);

  const handleIgnore = useCallback((email: Email) => {
    dispatch({ type: 'IGNORE_EMAIL', id: email.id });
    setCurrentEmail(null);
  }, []);

  const handleReportIgnored = useCallback((email: Email) => {
    dispatch({ type: 'REPORT_IGNORED_EMAIL', id: email.id });
  }, []);

  const handleAllowIgnored = useCallback((email: Email) => {
    setShowLoginForm(true);
    setCurrentEmail(email);
    setSelectedIgnoredEmail(email);
  }, []);

  const handleEndGame = useCallback(() => {
    saveGameStats('user_ended').then(() => {
      router.push('/game-over');
    });
  }, [router, saveGameStats]);

  const handleIgnoredEmailClick = useCallback((email: Email) => {
    setCurrentEmail(email);
    setSelectedIgnoredEmail(email);
  }, []);

  const handleLoginSubmit = useCallback(
    ({ username, password }: { username: string; password: string }) => {
      if (!currentEmail) return;
      if (currentEmail.isPhishing) {
        new Audio('/sounds/error.mp3').play(); //added
        if (selectedIgnoredEmail) {
          dispatch({ type: 'FALSE_NEGATIVE_IGNORED_EMAIL', id: currentEmail.id });
        } else {
          dispatch({ type: 'FALSE_NEGATIVE_EMAIL', id: currentEmail.id });
        }
        setSelectedIgnoredEmail(null);
        setShowLoginForm(false);
        setCurrentEmail(null);

        setTimeout(() => {
          const finalStats: GameStatistics = {
            ...state.statistics,
            score: state.score,
            totalEmails: state.statistics.totalEmails,
            phishingDetected: state.statistics.phishingDetected,
            legitimateAllowed: state.statistics.legitimateAllowed,
            falsePositives: state.statistics.falsePositives,
            falseNegatives: state.statistics.falseNegatives + 1,
            avgResponseTime:
              state.statistics.responseTimes.length > 0
                ? state.statistics.responseTimes.reduce((a, b) => a + b, 0) /
                  state.statistics.responseTimes.length
                : 0,
            endReason: 'phishing_credentials',
          };
          saveLastGameStats(finalStats).then(() => {
            router.push('/game-over');
          });
        }, 0);
      } else {
        new Audio('/sounds/success.mp3').play(); //added
        if (selectedIgnoredEmail) {
          dispatch({ type: 'ALLOW_IGNORED_EMAIL', id: currentEmail.id });
          setSelectedIgnoredEmail(null);
        } else {
          dispatch({ type: 'ALLOW_EMAIL', id: currentEmail.id });
        }
        setShowLoginForm(false);
        setCurrentEmail(null);
      }
    },
    [currentEmail, router, selectedIgnoredEmail, saveGameStats, dispatch, state.score, state.statistics]
  );

  const handleDownload = useCallback(
    (email: Email) => {
      const audio = new Audio(email.isPhishing ? '/sounds/error.mp3' : '/sounds/success.mp3'); //added
      audio.play().catch((e) => console.error("Sound error:", e)); //added
      if (email.isPhishing) {
        if (selectedIgnoredEmail) {
          dispatch({ type: 'DOWNLOAD_IGNORED_EMAIL', id: email.id });
        } else {
          dispatch({ type: 'DOWNLOAD_EMAIL', id: email.id });
        }
        setSelectedIgnoredEmail(null);
        setCurrentEmail(null);

        const finalStats: GameStatistics = {
          ...state.statistics,
          score: state.score,
          totalEmails: state.statistics.totalEmails,
          phishingDetected: state.statistics.phishingDetected,
          legitimateAllowed: state.statistics.legitimateAllowed,
          falsePositives: state.statistics.falsePositives,
          falseNegatives: state.statistics.falseNegatives + 1,
          avgResponseTime:
            state.statistics.responseTimes.length > 0
              ? state.statistics.responseTimes.reduce((a, b) => a + b, 0) /
                state.statistics.responseTimes.length
              : 0,
          endReason: 'phishing_download',
        };
        saveLastGameStats(finalStats).then(() => {
          router.push('/game-over');
        });
      } else {
        if (selectedIgnoredEmail) {
          dispatch({ type: 'DOWNLOAD_IGNORED_EMAIL', id: email.id });
        } else {
          dispatch({ type: 'DOWNLOAD_EMAIL', id: email.id });
        }
        setSelectedIgnoredEmail(null);
        setCurrentEmail(null);
        dispatch({ type: 'UPDATE_SCORE', points: 5 });
      }
    },
    [selectedIgnoredEmail, dispatch, router, saveLastGameStats, state.score, state.statistics]
  );

  const handleCompleteSurvey = useCallback((email: Email) => {
    setShowSurveyForm(true);
    setCurrentEmail(email);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A192F] font-mono text-[#64FFDA] p-8">
     <div className="relative flex flex-col items-center">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
          className="bg-[#FF3366] rounded p-4 mb-12  hover:bg-[#E52A59] transition"
        >
          {state.isPaused ? '▶' : '⏸'}
        </button>
        <h1 className="text-[48px] font-extrabold mb-2">AuthenticatePlease</h1>
        <h2 className="text-[#FF3366] text-[24px] font-MEDIUM mb-8">Phishing OR not?? Decide.</h2>

        {/* SCORE в правом верхнем углу */}
        <div className="absolute top-0 right-0 text-white text-lg p-4">
          SCORE: {state.score}
        </div>
     </div>

      <div className="bg-[#0B1120] border-4 border-[#112240] shadow-heavy rounded-sm w-full max-w-6xl mx-auto p-6">
        <div className="md:flex md:gap-6">
          <div className="md:w-1/3 md:border-r md:border-[#112240] pr-4">
            <h2 className="text-2xl text-center font-extrabold mb-4 uppercase">Active Emails</h2>
            <div className="max-h-[60vh] overflow-y-auto scrollbar-hide space-y-4">
              {state.emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setCurrentEmail(email)}
                  className={`p-4 rounded cursor-pointer hover:bg-[#112640] transition ${
                    currentEmail?.id === email.id ? 'ring-2 ring-[#64FFDA]' : ''
                  }`}
                >
                  <div className="font-bold mb-1">{email.subject}</div>
                  <div className="text-[#767676] text-sm mb-1">From: {email.sender}</div>
                  <div className="text-[#64FFDA] text-xs bg-[#112640] inline-block px-2 py-1 rounded">
                    {email.timeLimit}s
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/3 md:border-r md:border-[#112240] px-4">
            {showLoginForm && currentEmail ? (
              <div>
                <div className="flex justify-center mb-8">
                  <div className="text-[48px]">🔒</div>
                </div>
                <h2 className="text-2xl font-extrabold text-center mb-8">LOGIN</h2>
                <LoginForm
                  onSubmit={handleLoginSubmit}
                  onReport={() => handleReport(currentEmail)}
                />
              </div>
            ) : showSurveyForm && currentEmail ? (
              <div>
                <div className="flex justify-center mb-8">
                  <div className="text-[48px]">📋</div>
                </div>
                <h2 className="text-2xl font-extrabold text-center mb-8">SURVEY</h2>
                <SurveyForm
                  onSubmit={() => {
                    if (currentEmail?.isPhishing) {
                      new Audio('/sounds/error.mp3').play().catch((e) => console.error(e)); //added
                    } else {
                      new Audio('/sounds/success.mp3').play().catch((e) => console.error(e));
                    }
                    if (selectedIgnoredEmail) {
                      dispatch({ type: 'COMPLETE_SURVEY_IGNORED_EMAIL', id: currentEmail.id });
                    } else {
                      dispatch({ type: 'COMPLETE_SURVEY_EMAIL', id: currentEmail.id });
                    }
                    setSelectedIgnoredEmail(null);
                    setShowSurveyForm(false);
                    setCurrentEmail(null);
                    if (
                      currentEmail?.isPhishing &&
                      state.score - 30 < 0
                    ) {
                      const finalStats: GameStatistics = {
                        ...state.statistics,
                        score: Math.max(0, state.score - 30),
                        totalEmails: state.statistics.totalEmails,
                        phishingDetected: state.statistics.phishingDetected,
                        legitimateAllowed: state.statistics.legitimateAllowed,
                        falsePositives: state.statistics.falsePositives,
                        falseNegatives: state.statistics.falseNegatives + 1,
                        avgResponseTime:
                          state.statistics.responseTimes.length > 0
                            ? state.statistics.responseTimes.reduce((a, b) => a + b, 0) /
                              state.statistics.responseTimes.length
                            : 0,
                        endReason: 'game_over',
                      };
                      saveLastGameStats(finalStats).then(() => {
                        router.push('/game-over');
                      });
                    }
                  }}
                  onReport={() => {
                    handleReport(currentEmail);
                    setShowSurveyForm(false);
                  }}
                />
              </div>
            ) : currentEmail ? (
              <div>
                <h2 className="text-2xl font-extrabold mb-4">{currentEmail.subject}</h2>
                <p className="text-[#767676] text-sm mb-4">From: {currentEmail.sender}</p>
                {currentEmail.content && (
                  <p className="mb-6">{currentEmail.content}</p>
                )}
                <div className="flex gap-4">
                  {currentEmail.type === 'download' ? (
                    <button
                      onClick={() => handleDownload(currentEmail)}
                      className="flex-1 bg-[#64FFDA] text-[#0A192F] py-2 rounded shadow-md hover:bg-[#52E9C2] transition"
                    >
                      DOWNLOAD
                    </button>
                  ) : currentEmail.type === 'survey' ? (
                    <button
                      onClick={() => handleCompleteSurvey(currentEmail)}
                      className="flex-1 bg-[#64FFDA] text-[#0A192F] py-2 rounded shadow-md hover:bg-[#52E9C2] transition"
                    >
                      COMPLETE
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAllow(currentEmail)}
                      className="flex-1 bg-[#64FFDA] text-[#0A192F] py-2 rounded shadow-md hover:bg-[#52E9C2] transition"
                    >
                      ALLOW
                    </button>
                  )}
                  <button
                    onClick={() => handleReport(currentEmail)}
                    className="flex-1 bg-[#FF3366] text-[#0A192F] py-2 rounded shadow-md hover:bg-[#E52A59] transition"
                  >
                    REPORT
                  </button>
                  {!selectedIgnoredEmail && (
                    <button
                      onClick={() => handleIgnore(currentEmail)}
                      className={`flex-1 py-2 rounded transition ${
                        state.ignoredEmails.length >= state.ignoredEmailsThreshold
                          ? 'bg-[#112240] text-[#767676] cursor-not-allowed'
                          : 'bg-[#FF3366] text-[#0A192F] hover:bg-[#E52A59]'
                      }`}
                      disabled={state.ignoredEmails.length >= state.ignoredEmailsThreshold}
                    >
                      IGNORE
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#767676]">
                Select an email to review
              </div>
            )}
          </div>

          <div className="md:w-1/3 pl-4">
            <h2 className="text-2xl text-[#FF3366] text-center font-extrabold mb-4 uppercase">Ignored Emails</h2>
            <div className="max-h-[60vh] overflow-y-auto scrollbar-hide space-y-4">
              {state.ignoredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleIgnoredEmailClick(email)}
                  className={`p-4 rounded cursor-pointer hover:bg-[#112640] transition ${
                    selectedIgnoredEmail?.id === email.id ? 'ring-2 ring-[#FF3366]' : ''
                  }`}
                >
                  <div className="font-bold mb-1">{email.subject}</div>
                  <div className="text-[#767676] text-sm">From: {email.sender}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {state.isPaused && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="text-center bg-[#0B1120] p-8 rounded-lg shadow-heavy"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xl text-[#64FFDA] mb-4">Game Paused</div>
            <button
              type="button"
              onClick={handleEndGame}
              className="bg-[#FF3366] text-white px-8 py-3 rounded shadow-md hover:bg-[#E52A59] transition"
            >
              End Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

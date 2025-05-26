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

  // Update settings when they change
  useEffect(() => {
    // Initial settings load
    const newSettings = getSettings();
    dispatch({ 
      type: 'UPDATE_SETTINGS', 
      settings: {
        timerLength: newSettings.timerLength,
        emailsToIgnore: newSettings.emailsToIgnore
      }
    });

    // Listen for settings changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gameSettings') {
        const newSettings = getSettings();
        dispatch({ 
          type: 'UPDATE_SETTINGS', 
          settings: {
            timerLength: newSettings.timerLength,
            emailsToIgnore: newSettings.emailsToIgnore
          }
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check for settings changes in current tab
  useEffect(() => {
    const checkSettings = () => {
      const newSettings = getSettings();
      dispatch({ 
        type: 'UPDATE_SETTINGS', 
        settings: {
          timerLength: newSettings.timerLength,
          emailsToIgnore: newSettings.emailsToIgnore
        }
      });
    };

    const interval = setInterval(checkSettings, 1000);
    return () => clearInterval(interval);
  }, []);

  const saveGameStats = useCallback(async (endReason: GameStatistics['endReason']) => {
    const avgResponseTime = state.statistics.responseTimes.length > 0
      ? state.statistics.responseTimes.reduce((a, b) => a + b, 0) / state.statistics.responseTimes.length
      : 0;

    const stats: GameStatistics = {
      score: Math.max(0, state.score),
      totalEmails: state.statistics.totalEmails,
      phishingDetected: state.statistics.phishingDetected,
      legitimateAllowed: state.statistics.legitimateAllowed,
      falsePositives: state.statistics.falsePositives,
      falseNegatives: state.statistics.falseNegatives,
      avgResponseTime,
      endReason
    };

    await saveLastGameStats(stats);
  }, [state.score, state.statistics]);

  // Check for game over conditions
  useEffect(() => {
    const handleGameOver = async () => {
      // Only end game on negative score if we're not handling a phishing action
      if (state.score < 0 && !state.statistics.falseNegatives) {
        await saveGameStats('game_over');
        router.push('/game-over');
      }
    };
    handleGameOver();
  }, [state.score, router, saveGameStats, state.statistics.falseNegatives]);

  // Handle game tick for email timers
  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.isPaused) {
        dispatch({ type: 'TICK' });
        
        // Generate new email if needed
        if (shouldGenerateNewEmail(state.emails, 5)) {
          dispatch({ type: 'ADD_EMAIL', email: generateEmail() });
        }
        
        // Remove expired emails
        state.emails.forEach(email => {
          if (email.timeLimit <= 0) {
            dispatch({ type: 'REMOVE_EMAIL', id: email.id });
            dispatch({ type: 'UPDATE_SCORE', points: -3 }); // Penalty for expired emails
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isPaused, state.emails]);

  const handleReport = useCallback((email: Email) => {
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
  }, [showLoginForm, selectedIgnoredEmail]);

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

  const handleLoginSubmit = useCallback(({ username, password }: { username: string, password: string }) => {
    if (!currentEmail) return;
    
    if (currentEmail.isPhishing) {
      // Update statistics before ending the game
      if (selectedIgnoredEmail) {
        dispatch({ type: 'FALSE_NEGATIVE_IGNORED_EMAIL', id: currentEmail.id });
      } else {
        dispatch({ type: 'FALSE_NEGATIVE_EMAIL', id: currentEmail.id });
      }
      setSelectedIgnoredEmail(null);
      setShowLoginForm(false);
      setCurrentEmail(null);
      
      // We need to wait for the state to update before saving stats
      setTimeout(() => {
        const finalStats: GameStatistics = {
          ...state.statistics,
          score: state.score,
          totalEmails: state.statistics.totalEmails,
          phishingDetected: state.statistics.phishingDetected,
          legitimateAllowed: state.statistics.legitimateAllowed,
          falsePositives: state.statistics.falsePositives,
          falseNegatives: state.statistics.falseNegatives + 1, // Increment false negatives
          avgResponseTime: state.statistics.responseTimes.length > 0
            ? state.statistics.responseTimes.reduce((a, b) => a + b, 0) / state.statistics.responseTimes.length
            : 0,
          endReason: 'phishing_credentials'
        };
        saveLastGameStats(finalStats).then(() => {
          router.push('/game-over');
        });
      }, 0);
    } else {
      if (selectedIgnoredEmail) {
        dispatch({ type: 'ALLOW_IGNORED_EMAIL', id: currentEmail.id });
        setSelectedIgnoredEmail(null);
      } else {
        dispatch({ type: 'ALLOW_EMAIL', id: currentEmail.id });
      }
      setShowLoginForm(false);
      setCurrentEmail(null);
    }
  }, [currentEmail, router, selectedIgnoredEmail, saveGameStats, dispatch, state.score, state.statistics]);

  const handleDownload = useCallback((email: Email) => {
    if (email.isPhishing) {
      if (selectedIgnoredEmail) {
        dispatch({ type: 'DOWNLOAD_IGNORED_EMAIL', id: email.id });
      } else {
        dispatch({ type: 'DOWNLOAD_EMAIL', id: email.id });
      }
      setSelectedIgnoredEmail(null);
      setCurrentEmail(null);
      
      // End game immediately for phishing download
      const finalStats: GameStatistics = {
        ...state.statistics,
        score: state.score,
        totalEmails: state.statistics.totalEmails,
        phishingDetected: state.statistics.phishingDetected,
        legitimateAllowed: state.statistics.legitimateAllowed,
        falsePositives: state.statistics.falsePositives,
        falseNegatives: state.statistics.falseNegatives + 1,
        avgResponseTime: state.statistics.responseTimes.length > 0
          ? state.statistics.responseTimes.reduce((a, b) => a + b, 0) / state.statistics.responseTimes.length
          : 0,
        endReason: 'phishing_download'
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
      // Add points for correctly downloading legitimate files
      dispatch({ type: 'UPDATE_SCORE', points: 5 });
    }
  }, [selectedIgnoredEmail, dispatch, router, saveLastGameStats, state.score, state.statistics]);

  const handleCompleteSurvey = useCallback((email: Email) => {
    setShowSurveyForm(true);
    setCurrentEmail(email);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-mono text-cyan-400">AuthenticatePlease</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
              className="bg-pink-500 rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-pink-400 transition"
            >
              {state.isPaused ? '▶' : '⏸'}
            </button>
            <div className="text-xl">SCORE: {state.score}</div>
          </div>
        </div>

        <div className="relative">
          <div className={`transition-all duration-300 ${state.isPaused ? 'blur-md' : ''}`}>
            <div className="flex gap-8">
              {/* Active Emails Sidebar */}
              <div className="w-1/3 space-y-4">
                <h2 className="text-xl text-cyan-400 mb-4">Active Emails</h2>
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {state.emails.map(email => (
                    <div
                      key={email.id}
                      onClick={() => setCurrentEmail(email)}
                      className={`bg-gray-800 p-4 rounded cursor-pointer transition hover:bg-gray-750 ${
                        currentEmail?.id === email.id ? 'ring-2 ring-cyan-400' : ''
                      }`}
                    >
                      <div className="text-lg font-semibold mb-2">{email.subject}</div>
                      <div className="text-gray-400 text-sm mb-2">From: {email.sender}</div>
                      <div className="text-sm text-gray-400 font-mono bg-gray-700 px-2 py-1 rounded inline-block">
                        {email.timeLimit}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1">
                {showLoginForm && currentEmail ? (
                  <div className="bg-gray-800 p-8 rounded-lg">
                    <div className="flex justify-center mb-8">
                      <div className="text-5xl">🔒</div>
                    </div>
                    <h2 className="text-2xl font-mono text-center text-cyan-400 mb-8">Login</h2>
                    <LoginForm 
                      onSubmit={handleLoginSubmit} 
                      onReport={() => handleReport(currentEmail)}
                    />
                  </div>
                ) : showSurveyForm && currentEmail ? (
                  <div className="bg-gray-800 p-8 rounded-lg">
                    <div className="flex justify-center mb-8">
                      <div className="text-5xl">📋</div>
                    </div>
                    <h2 className="text-2xl font-mono text-center text-cyan-400 mb-8">Survey</h2>
                    <SurveyForm 
                      onSubmit={() => {
                        if (selectedIgnoredEmail) {
                          dispatch({ type: 'COMPLETE_SURVEY_IGNORED_EMAIL', id: currentEmail.id });
                        } else {
                          dispatch({ type: 'COMPLETE_SURVEY_EMAIL', id: currentEmail.id });
                        }
                        setSelectedIgnoredEmail(null);
                        setShowSurveyForm(false);
                        setCurrentEmail(null);

                        // Check if score will drop below zero (-30 penalty for phishing survey)
                        if (currentEmail?.isPhishing && state.score - 30 < 0) {
                          const finalStats: GameStatistics = {
                            ...state.statistics,
                            score: Math.max(0, state.score - 30),
                            totalEmails: state.statistics.totalEmails,
                            phishingDetected: state.statistics.phishingDetected,
                            legitimateAllowed: state.statistics.legitimateAllowed,
                            falsePositives: state.statistics.falsePositives,
                            falseNegatives: state.statistics.falseNegatives + 1,
                            avgResponseTime: state.statistics.responseTimes.length > 0
                              ? state.statistics.responseTimes.reduce((a, b) => a + b, 0) / state.statistics.responseTimes.length
                              : 0,
                            endReason: 'game_over'
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
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">{currentEmail.subject}</h2>
                      <p className="text-gray-400">From: {currentEmail.sender}</p>
                      {currentEmail.content && (
                        <p className="mt-4 text-blue-400 break-all">{currentEmail.content}</p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      {currentEmail.type === 'download' ? (
                        <button
                          onClick={() => handleDownload(currentEmail)}
                          className="flex-1 bg-cyan-400 text-gray-900 px-6 py-2 rounded hover:bg-cyan-300 transition"
                        >
                          DOWNLOAD
                        </button>
                      ) : currentEmail.type === 'survey' ? (
                        <button
                          onClick={() => handleCompleteSurvey(currentEmail)}
                          className="flex-1 bg-cyan-400 text-gray-900 px-6 py-2 rounded hover:bg-cyan-300 transition"
                        >
                          COMPLETE
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAllow(currentEmail)}
                          className="flex-1 bg-cyan-400 text-gray-900 px-6 py-2 rounded hover:bg-cyan-300 transition"
                        >
                          ALLOW
                        </button>
                      )}
                      <button
                        onClick={() => handleReport(currentEmail)}
                        className="flex-1 bg-pink-500 px-6 py-2 rounded hover:bg-pink-400 transition"
                      >
                        REPORT
                      </button>
                      {!selectedIgnoredEmail && (
                        <button
                          onClick={() => handleIgnore(currentEmail)}
                          className={`flex-1 px-6 py-2 rounded transition ${
                            state.ignoredEmails.length >= state.ignoredEmailsThreshold
                              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-600 hover:bg-gray-500'
                          }`}
                          disabled={state.ignoredEmails.length >= state.ignoredEmailsThreshold}
                          title={
                            state.ignoredEmails.length >= state.ignoredEmailsThreshold
                              ? 'Cannot ignore more emails - ignored list is full'
                              : 'Ignore this email'
                          }
                        >
                          IGNORE {state.ignoredEmails.length >= state.ignoredEmailsThreshold && '(FULL)'}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Select an email to review
                  </div>
                )}
              </div>

              {/* Ignored Emails Sidebar */}
              <div className="w-1/3 space-y-4">
                <h2 className="text-xl text-pink-500 mb-4">Ignored Emails</h2>
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {state.ignoredEmails.map(email => (
                    <div
                      key={email.id}
                      className={`bg-gray-800 p-4 rounded cursor-pointer transition hover:bg-gray-750 ${
                        selectedIgnoredEmail?.id === email.id ? 'ring-2 ring-pink-500' : ''
                      }`}
                      onClick={() => handleIgnoredEmailClick(email)}
                    >
                      <div className="text-lg font-semibold mb-2">{email.subject}</div>
                      <div className="text-gray-400 text-sm">From: {email.sender}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {state.isPaused && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="text-center bg-gray-800 p-8 rounded-lg shadow-lg pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-xl text-[#5FFBF1] mb-4">Game Paused</div>
                <button
                  type="button"
                  onClick={handleEndGame}
                  className="bg-[#FF4365] text-white px-8 py-3 rounded hover:bg-[#FF4365]/90 transition cursor-pointer"
                >
                  End Game
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
import { GameState, Email } from './types';

const getSettings = () => {
  const defaultSettings = {
    timerLength: 60,
    emailsToIgnore: 3
  };
  
  try {
    const savedSettings = localStorage.getItem('gameSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const settings = getSettings();

export const initialGameState: GameState = {
  score: 0,
  emails: [],
  ignoredEmails: [],
  ignoredEmailsThreshold: settings.emailsToIgnore,
  ignoredEmailPenalty: -3,
  ignoredEmailReward: 5,
  timerLength: settings.timerLength,
  isPaused: false,
  statistics: {
    totalEmails: 0,
    phishingDetected: 0,
    legitimateAllowed: 0,
    falsePositives: 0,
    falseNegatives: 0,
    responseTimes: [],
  }
};

type GameAction =
  | { type: 'ADD_EMAIL'; email: Email }
  | { type: 'REMOVE_EMAIL'; id: string }
  | { type: 'IGNORE_EMAIL'; id: string }
  | { type: 'REPORT_EMAIL'; id: string }
  | { type: 'REPORT_IGNORED_EMAIL'; id: string }
  | { type: 'ALLOW_EMAIL'; id: string }
  | { type: 'ALLOW_IGNORED_EMAIL'; id: string }
  | { type: 'FALSE_NEGATIVE_EMAIL'; id: string }
  | { type: 'FALSE_NEGATIVE_IGNORED_EMAIL'; id: string }
  | { type: 'MOVE_TO_CURRENT'; id: string }
  | { type: 'UPDATE_SCORE'; points: number }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'TICK' }
  | { type: 'UPDATE_SETTINGS'; settings: { timerLength: number; emailsToIgnore: number } }
  | { type: 'DOWNLOAD_EMAIL'; id: string }
  | { type: 'DOWNLOAD_IGNORED_EMAIL'; id: string }
  | { type: 'COMPLETE_SURVEY_EMAIL'; id: string }
  | { type: 'COMPLETE_SURVEY_IGNORED_EMAIL'; id: string };

function calculateResponseTime(email: Email): number {
  const now = Date.now();
  const startTime = email.startTime || now;
  return (now - startTime) / 1000;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_EMAIL':
      return {
        ...state,
        emails: [...state.emails, action.email],
        statistics: {
          ...state.statistics,
          totalEmails: state.statistics.totalEmails + 1,
        }
      };

    case 'REMOVE_EMAIL':
      return {
        ...state,
        emails: state.emails.filter(email => email.id !== action.id)
      };

    case 'IGNORE_EMAIL':
      const emailToIgnore = state.emails.find(email => email.id === action.id);
      if (!emailToIgnore) return state;

      const ignoreResponseTime = calculateResponseTime(emailToIgnore);
      return {
        ...state,
        emails: state.emails.filter(email => email.id !== action.id),
        ignoredEmails: [...state.ignoredEmails, emailToIgnore],
        statistics: {
          ...state.statistics,
          responseTimes: [
            ...state.statistics.responseTimes,
            ignoreResponseTime
          ]
        }
      };

    case 'REPORT_EMAIL':
      const reportedEmail = state.emails.find(email => email.id === action.id);
      if (!reportedEmail) return state;

      const reportPoints = reportedEmail.isPhishing ? 10 : -5;
      const reportResponseTime = calculateResponseTime(reportedEmail);
      return {
        ...state,
        score: state.score + reportPoints,
        emails: state.emails.filter(email => email.id !== action.id),
        statistics: {
          ...state.statistics,
          phishingDetected: reportedEmail.isPhishing 
            ? state.statistics.phishingDetected + 1 
            : state.statistics.phishingDetected,
          falsePositives: !reportedEmail.isPhishing 
            ? state.statistics.falsePositives + 1 
            : state.statistics.falsePositives,
          responseTimes: [
            ...state.statistics.responseTimes,
            reportResponseTime
          ]
        }
      };

    case 'REPORT_IGNORED_EMAIL':
      const reportedIgnoredEmail = state.ignoredEmails.find(email => email.id === action.id);
      if (!reportedIgnoredEmail) return state;

      const reportIgnoredPoints = reportedIgnoredEmail.isPhishing ? state.ignoredEmailReward : -state.ignoredEmailReward;
      return {
        ...state,
        score: state.score + reportIgnoredPoints,
        ignoredEmails: state.ignoredEmails.filter(email => email.id !== action.id),
        statistics: {
          ...state.statistics,
          phishingDetected: reportedIgnoredEmail.isPhishing 
            ? state.statistics.phishingDetected + 1 
            : state.statistics.phishingDetected,
          falsePositives: !reportedIgnoredEmail.isPhishing 
            ? state.statistics.falsePositives + 1 
            : state.statistics.falsePositives
        }
      };

    case 'ALLOW_EMAIL':
      const allowedEmail = state.emails.find(email => email.id === action.id);
      if (!allowedEmail) return state;

      const allowPoints = allowedEmail.isPhishing ? -10 : 5;
      const allowResponseTime = calculateResponseTime(allowedEmail);
      return {
        ...state,
        score: state.score + allowPoints,
        emails: state.emails.filter(email => email.id !== action.id),
        statistics: {
          ...state.statistics,
          legitimateAllowed: !allowedEmail.isPhishing 
            ? state.statistics.legitimateAllowed + 1 
            : state.statistics.legitimateAllowed,
          falseNegatives: allowedEmail.isPhishing 
            ? state.statistics.falseNegatives + 1 
            : state.statistics.falseNegatives,
          responseTimes: [
            ...state.statistics.responseTimes,
            allowResponseTime
          ]
        }
      };

    case 'ALLOW_IGNORED_EMAIL':
      const allowedIgnoredEmail = state.ignoredEmails.find(email => email.id === action.id);
      if (!allowedIgnoredEmail) return state;

      const allowIgnoredPoints = allowedIgnoredEmail.isPhishing ? -state.ignoredEmailReward : state.ignoredEmailReward;
      return {
        ...state,
        score: state.score + allowIgnoredPoints,
        ignoredEmails: state.ignoredEmails.filter(email => email.id !== action.id),
        statistics: {
          ...state.statistics,
          legitimateAllowed: !allowedIgnoredEmail.isPhishing 
            ? state.statistics.legitimateAllowed + 1 
            : state.statistics.legitimateAllowed,
          falseNegatives: allowedIgnoredEmail.isPhishing 
            ? state.statistics.falseNegatives + 1 
            : state.statistics.falseNegatives
        }
      };

    case 'MOVE_TO_CURRENT':
      const emailToMove = state.ignoredEmails.find(email => email.id === action.id);
      if (!emailToMove) return state;

      return {
        ...state,
        emails: [...state.emails, emailToMove],
        ignoredEmails: state.ignoredEmails.filter(email => email.id !== action.id)
      };

    case 'UPDATE_SCORE': {
      const newScore = Math.max(0, state.score + action.points);
      return {
        ...state,
        score: newScore
      };
    }

    case 'TOGGLE_PAUSE':
      return {
        ...state,
        isPaused: !state.isPaused,
        emails: state.emails.map(email => ({
          ...email,
          timeLimit: email.timeLimit
        }))
      };

    case 'TICK':
      return {
        ...state,
        emails: state.emails.map(email => ({
          ...email,
          timeLimit: email.timeLimit - 1
        }))
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        timerLength: action.settings.timerLength,
        ignoredEmailsThreshold: action.settings.emailsToIgnore
      };

    case 'FALSE_NEGATIVE_EMAIL': {
      const email = state.emails.find(e => e.id === action.id);
      if (!email) return state;

      const responseTime = calculateResponseTime(email);
      const newEmails = state.emails.filter(e => e.id !== action.id);

      return {
        ...state,
        emails: newEmails,
        score: state.score - 10, // Higher penalty for entering credentials on phishing site
        statistics: {
          ...state.statistics,
          falseNegatives: state.statistics.falseNegatives + 1,
          responseTimes: [...state.statistics.responseTimes, responseTime]
        }
      };
    }

    case 'FALSE_NEGATIVE_IGNORED_EMAIL': {
      const email = state.ignoredEmails.find(e => e.id === action.id);
      if (!email) return state;

      const responseTime = calculateResponseTime(email);
      const newIgnoredEmails = state.ignoredEmails.filter(e => e.id !== action.id);

      return {
        ...state,
        ignoredEmails: newIgnoredEmails,
        score: state.score - 10, // Higher penalty for entering credentials on phishing site
        statistics: {
          ...state.statistics,
          falseNegatives: state.statistics.falseNegatives + 1,
          responseTimes: [...state.statistics.responseTimes, responseTime]
        }
      };
    }

    case 'DOWNLOAD_EMAIL': {
      const email = state.emails.find(e => e.id === action.id);
      if (!email) return state;

      const responseTime = calculateResponseTime(email);
      const newEmails = state.emails.filter(e => e.id !== action.id);

      if (email.isPhishing) {
        return {
          ...state,
          emails: newEmails,
          statistics: {
            ...state.statistics,
            falseNegatives: state.statistics.falseNegatives + 1,
            responseTimes: [...state.statistics.responseTimes, responseTime]
          }
        };
      }

      // If legitimate, just remove the email and add response time
      return {
        ...state,
        emails: newEmails,
        score: state.score + 5, // Reward for correctly downloading legitimate file
        statistics: {
          ...state.statistics,
          legitimateAllowed: state.statistics.legitimateAllowed + 1,
          responseTimes: [...state.statistics.responseTimes, responseTime]
        }
      };
    }

    case 'DOWNLOAD_IGNORED_EMAIL': {
      const email = state.ignoredEmails.find(e => e.id === action.id);
      if (!email) return state;

      const responseTime = calculateResponseTime(email);
      const newIgnoredEmails = state.ignoredEmails.filter(e => e.id !== action.id);

      if (email.isPhishing) {
        return {
          ...state,
          ignoredEmails: newIgnoredEmails,
          statistics: {
            ...state.statistics,
            falseNegatives: state.statistics.falseNegatives + 1,
            responseTimes: [...state.statistics.responseTimes, responseTime]
          }
        };
      }

      // If legitimate, just remove the email and add response time
      return {
        ...state,
        ignoredEmails: newIgnoredEmails,
        score: state.score + 5, // Reward for correctly downloading legitimate file
        statistics: {
          ...state.statistics,
          legitimateAllowed: state.statistics.legitimateAllowed + 1,
          responseTimes: [...state.statistics.responseTimes, responseTime]
        }
      };
    }

    case 'COMPLETE_SURVEY_EMAIL': {
      const email = state.emails.find(e => e.id === action.id);
      if (!email) return state;

      const responseTime = calculateResponseTime(email);
      const newEmails = state.emails.filter(e => e.id !== action.id);
      const newScore = Math.max(0, email.isPhishing ? state.score - 30 : state.score + 5);

      return {
        ...state,
        emails: newEmails,
        score: newScore,
        statistics: {
          ...state.statistics,
          falseNegatives: email.isPhishing 
            ? state.statistics.falseNegatives + 1 
            : state.statistics.falseNegatives,
          legitimateAllowed: !email.isPhishing 
            ? state.statistics.legitimateAllowed + 1 
            : state.statistics.legitimateAllowed,
          responseTimes: [...state.statistics.responseTimes, responseTime]
        }
      };
    }

    case 'COMPLETE_SURVEY_IGNORED_EMAIL': {
      const email = state.ignoredEmails.find(e => e.id === action.id);
      if (!email) return state;

      const responseTime = calculateResponseTime(email);
      const newIgnoredEmails = state.ignoredEmails.filter(e => e.id !== action.id);
      const newScore = Math.max(0, email.isPhishing ? state.score - 30 : state.score + 5);

      return {
        ...state,
        ignoredEmails: newIgnoredEmails,
        score: newScore,
        statistics: {
          ...state.statistics,
          falseNegatives: email.isPhishing 
            ? state.statistics.falseNegatives + 1 
            : state.statistics.falseNegatives,
          legitimateAllowed: !email.isPhishing 
            ? state.statistics.legitimateAllowed + 1 
            : state.statistics.legitimateAllowed,
          responseTimes: [...state.statistics.responseTimes, responseTime]
        }
      };
    }

    default:
      return state;
  }
}

export { getSettings }; 
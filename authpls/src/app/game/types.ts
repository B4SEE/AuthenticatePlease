export interface Email {
  id: string;
  sender: string;
  subject: string;
  content?: string;
  isPhishing: boolean;
  timeLimit: number;
  startTime: number;
  type: 'login' | 'download' | 'survey';
}

export interface GameStatistics {
  score: number;
  totalEmails: number;
  phishingDetected: number;
  legitimateAllowed: number;
  falsePositives: number;
  falseNegatives: number;
  avgResponseTime: number;
  endReason: 'game_over' | 'user_ended' | 'phishing_credentials' | 'phishing_download';
}

export interface GameState {
  score: number;
  emails: Email[];
  ignoredEmails: Email[];
  ignoredEmailsThreshold: number;
  ignoredEmailPenalty: number;
  ignoredEmailReward: number;
  timerLength: number;
  isPaused: boolean;
  statistics: {
    totalEmails: number;
    phishingDetected: number;
    legitimateAllowed: number;
    falsePositives: number;
    falseNegatives: number;
    responseTimes: number[];
  };
}

export type GameAction =
  | { type: 'ADD_EMAIL'; email: Email }
  | { type: 'REMOVE_EMAIL'; id: string }
  | { type: 'REPORT_EMAIL'; id: string }
  | { type: 'ALLOW_EMAIL'; id: string }
  | { type: 'IGNORE_EMAIL'; id: string }
  | { type: 'REPORT_IGNORED_EMAIL'; id: string }
  | { type: 'ALLOW_IGNORED_EMAIL'; id: string }
  | { type: 'FALSE_NEGATIVE_EMAIL'; id: string }
  | { type: 'FALSE_NEGATIVE_IGNORED_EMAIL'; id: string }
  | { type: 'DOWNLOAD_EMAIL'; id: string }
  | { type: 'DOWNLOAD_IGNORED_EMAIL'; id: string }
  | { type: 'MOVE_TO_CURRENT'; id: string }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'TICK' }
  | { type: 'UPDATE_SCORE'; points: number }
  | { type: 'UPDATE_SETTINGS'; settings: { timerLength: number; emailsToIgnore: number } }; 
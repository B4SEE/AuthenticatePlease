import { GameStatistics } from '../game/types';

export interface AllTimeStatistics {
  totalGames: number;
  falsePositives: number;
  falseNegatives: number;
  totalReported: number;
  totalResponseTime: number;
  totalDecisions: number;
  phishingDetected: number;
  legitimateAllowed: number;
}

const LAST_GAME_KEY_PREFIX = 'lastGameStats';
const ALL_TIME_STATS_KEY_PREFIX = 'allTimeStats';

async function getUserId(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/user');
    if (!res.ok) return null;
    const data = await res.json();
    return data.user?.id || null;
  } catch {
    return null;
  }
}

async function getStorageKeyForUser(prefix: string): Promise<string> {
  const userId = await getUserId();
  return userId ? `${prefix}_${userId}` : prefix;
}

export async function saveLastGameStats(stats: GameStatistics): Promise<void> {
  const key = await getStorageKeyForUser(LAST_GAME_KEY_PREFIX);
  localStorage.setItem(key, JSON.stringify(stats));
  await updateAllTimeStats(stats);
}

export async function getLastGameStats(): Promise<GameStatistics | null> {
  const key = await getStorageKeyForUser(LAST_GAME_KEY_PREFIX);
  const stats = localStorage.getItem(key);
  return stats ? JSON.parse(stats) : null;
}

async function updateAllTimeStats(gameStats: GameStatistics): Promise<void> {
  const currentStats = await getAllTimeStats();
  
  const newStats: AllTimeStatistics = {
    totalGames: currentStats.totalGames + 1,
    falsePositives: currentStats.falsePositives + gameStats.falsePositives,
    falseNegatives: currentStats.falseNegatives + gameStats.falseNegatives,
    totalReported: currentStats.totalReported + gameStats.phishingDetected + gameStats.falsePositives,
    totalResponseTime: currentStats.totalResponseTime + (gameStats.avgResponseTime * gameStats.totalEmails),
    totalDecisions: currentStats.totalDecisions + gameStats.totalEmails,
    phishingDetected: currentStats.phishingDetected + gameStats.phishingDetected,
    legitimateAllowed: currentStats.legitimateAllowed + gameStats.legitimateAllowed
  };

  const key = await getStorageKeyForUser(ALL_TIME_STATS_KEY_PREFIX);
  localStorage.setItem(key, JSON.stringify(newStats));
}

export async function getAllTimeStats(): Promise<AllTimeStatistics> {
  const key = await getStorageKeyForUser(ALL_TIME_STATS_KEY_PREFIX);
  const stats = localStorage.getItem(key);
  if (!stats) {
    return {
      totalGames: 0,
      falsePositives: 0,
      falseNegatives: 0,
      totalReported: 0,
      totalResponseTime: 0,
      totalDecisions: 0,
      phishingDetected: 0,
      legitimateAllowed: 0
    };
  }
  return JSON.parse(stats);
}

export function calculateAccuracy(stats: AllTimeStatistics | GameStatistics): string {
  if ('totalEmails' in stats) {
    // Single game statistics
    const totalDecided = stats.phishingDetected + stats.legitimateAllowed + stats.falsePositives + stats.falseNegatives;
    if (totalDecided === 0) return '0%';
    const correctDecisions = stats.phishingDetected + stats.legitimateAllowed;
    return `${(correctDecisions / totalDecided * 100).toFixed(1)}%`;
  } else {
    // All-time statistics
    const totalDecided = stats.phishingDetected + stats.legitimateAllowed + stats.falsePositives + stats.falseNegatives;
    if (totalDecided === 0) return '0%';
    const correctDecisions = stats.phishingDetected + stats.legitimateAllowed;
    return `${(correctDecisions / totalDecided * 100).toFixed(1)}%`;
  }
}

export function calculateAvgTime(stats: AllTimeStatistics | GameStatistics): string {
  if ('avgResponseTime' in stats) {
    // Single game statistics
    return `${stats.avgResponseTime.toFixed(1)}s`;
  } else {
    // All-time statistics
    if (stats.totalDecisions === 0) return '0.0s';
    return `${(stats.totalResponseTime / stats.totalDecisions).toFixed(1)}s`;
  }
}

export async function resetAllStats(): Promise<void> {
  const lastGameKey = await getStorageKeyForUser(LAST_GAME_KEY_PREFIX);
  const allTimeKey = await getStorageKeyForUser(ALL_TIME_STATS_KEY_PREFIX);
  localStorage.removeItem(lastGameKey);
  localStorage.removeItem(allTimeKey);
}

export async function exportStatsToCSV(type: 'all-time' | 'last-game'): Promise<void> {
  const userId = await getUserId();
  const userSuffix = userId ? `_${userId}` : '';

  // Helper function to create and trigger download
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Helper function to format CSV values
  const formatCSVValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
  };

  if (type === 'all-time') {
    const allTimeStats = await getAllTimeStats();
    const allTimeHeaders = [
      'Total Games',
      'False Positives',
      'Total Reported',
      'Phishing Detected',
      'Legitimate Allowed',
      'Average Response Time (s)',
      'Accuracy (%)'
    ];

    const allTimeValues = [
      allTimeStats.totalGames,
      allTimeStats.falsePositives,
      allTimeStats.totalReported,
      allTimeStats.phishingDetected,
      allTimeStats.legitimateAllowed,
      (allTimeStats.totalResponseTime / allTimeStats.totalDecisions).toFixed(1),
      ((allTimeStats.phishingDetected + allTimeStats.legitimateAllowed) / allTimeStats.totalDecisions * 100).toFixed(1)
    ];

    const allTimeCSV = [
      allTimeHeaders.join(','),
      allTimeValues.map(formatCSVValue).join(',')
    ].join('\n');

    downloadCSV(allTimeCSV, `authenticate_please_all_time${userSuffix}.csv`);
  } else {
    const lastGameStats = await getLastGameStats();
    if (lastGameStats) {
      const lastGameHeaders = [
        'Score',
        'Total Emails',
        'Phishing Detected',
        'Legitimate Allowed',
        'False Positives',
        'False Negatives',
        'Average Response Time (s)',
        'Accuracy (%)',
        'End Reason'
      ];

      const lastGameValues = [
        lastGameStats.score,
        lastGameStats.totalEmails,
        lastGameStats.phishingDetected,
        lastGameStats.legitimateAllowed,
        lastGameStats.falsePositives,
        lastGameStats.falseNegatives,
        lastGameStats.avgResponseTime.toFixed(1),
        ((lastGameStats.phishingDetected + lastGameStats.legitimateAllowed) / 
          (lastGameStats.phishingDetected + lastGameStats.legitimateAllowed + 
           lastGameStats.falsePositives + lastGameStats.falseNegatives) * 100).toFixed(1),
        lastGameStats.endReason.replace(/_/g, ' ').toUpperCase()
      ];

      const lastGameCSV = [
        lastGameHeaders.join(','),
        lastGameValues.map(formatCSVValue).join(',')
      ].join('\n');

      downloadCSV(lastGameCSV, `authenticate_please_last_game${userSuffix}.csv`);
    }
  }
} 
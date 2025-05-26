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

export async function exportStatsToCSV(): Promise<void> {
  const allTimeStats = await getAllTimeStats();
  const lastGameStats = await getLastGameStats();
  const userId = await getUserId();
  const userSuffix = userId ? `_${userId}` : '';

  const allTimeRow = {
    'Type': 'All-Time',
    'Total Games': allTimeStats.totalGames,
    'False Positives': allTimeStats.falsePositives,
    'Total Reported': allTimeStats.totalReported,
    'Phishing Detected': allTimeStats.phishingDetected,
    'Legitimate Allowed': allTimeStats.legitimateAllowed,
    'Average Response Time': (allTimeStats.totalResponseTime / allTimeStats.totalDecisions).toFixed(1),
    'Accuracy': ((allTimeStats.phishingDetected + allTimeStats.legitimateAllowed) / allTimeStats.totalDecisions * 100).toFixed(1)
  };

  const lastGameRow = lastGameStats ? {
    'Type': 'Last Game',
    'Total Games': 1,
    'False Positives': lastGameStats.falsePositives,
    'Total Reported': lastGameStats.phishingDetected + lastGameStats.falsePositives,
    'Phishing Detected': lastGameStats.phishingDetected,
    'Legitimate Allowed': lastGameStats.legitimateAllowed,
    'Average Response Time': lastGameStats.avgResponseTime.toFixed(1),
    'Accuracy': ((lastGameStats.phishingDetected + lastGameStats.legitimateAllowed) / 
      (lastGameStats.phishingDetected + lastGameStats.legitimateAllowed + lastGameStats.falsePositives + lastGameStats.falseNegatives) * 100).toFixed(1)
  } : null;

  const rows = [allTimeRow];
  if (lastGameRow) rows.push(lastGameRow);

  // Convert to CSV
  const headers = Object.keys(allTimeRow);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `authenticate_please_stats${userSuffix}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 
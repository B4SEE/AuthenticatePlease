'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLastGameStats } from '../statistics/utils';
import { GameStatistics } from '../game/types';

export default function GameOverPage() {
  const [stats, setStats] = useState<GameStatistics | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const gameStats = await getLastGameStats();
      if (gameStats) {
        setStats(gameStats);
      }
    };
    loadStats();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A192F] text-[#5FFBF1]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A192F] p-4">
      <div className="text-center mb-16">
        <h1 className="text-[#5FFBF1] text-6xl font-mono mb-4">GAME OVER</h1>
        <p className="text-[#FF4365] text-2xl">
          {stats.endReason === 'phishing_credentials' 
            ? 'You entered credentials on a phishing site!'
            : stats.endReason === 'phishing_download'
            ? 'You downloaded a malicious file!'
            : stats.endReason === 'user_ended'
            ? 'Game ended by user'
            : 'Your score dropped below zero!'}
        </p>
      </div>

      <div className="bg-[#0E1F37] p-8 rounded-lg w-full max-w-md mb-8">
        <h2 className="text-[#5FFBF1] text-2xl font-mono mb-4">
          FINAL SCORE: <span className="text-[#FF4365]">{stats.score}</span>
        </h2>
        
        <div className="space-y-4 text-gray-400">
          <p>Phishing Detected: {stats.phishingDetected}</p>
          <p>Legitimate Allowed: {stats.legitimateAllowed}</p>
          <p>False Positives: {stats.falsePositives}</p>
          <p>False Negatives: {stats.falseNegatives}</p>
          <p>Average Response Time: {stats.avgResponseTime.toFixed(1)}s</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/game">
          <button className="bg-[#5FFBF1] text-[#0A192F] py-3 px-8 rounded font-mono text-lg hover:bg-[#FF4365] hover:text-white transition-colors">
            PLAY AGAIN
          </button>
        </Link>
        
        <Link href="/dashboard">
          <button className="bg-[#5FFBF1] text-[#0A192F] py-3 px-8 rounded font-mono text-lg hover:bg-[#FF4365] hover:text-white transition-colors">
            DASHBOARD
          </button>
        </Link>
      </div>
    </div>
  );
} 
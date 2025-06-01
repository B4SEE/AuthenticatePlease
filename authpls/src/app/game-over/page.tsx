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


  useEffect(() => {
    const go = document.getElementById('gameover');
    if (go) {
      go.style.opacity = '1';
      go.style.transform = 'perspective(800px) translateZ(0) scale(1)';
    }
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1120] text-[#5FFBF1] font-mono">
        Loading...
      </div>
    );
  }

  return (
    <div
      id="gameover"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000',
        opacity: 1,
        transform: 'perspective(800px) translateZ(0) scale(1)',
        transition: 'all 2s ease',
        zIndex: 50,
      }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#0B1120] p-4 font-mono"
    >
      <div className="bg-[#FF3366]/30 border-4 border-[#FF3366] shadow-heavy rounded-sm w-full max-w-xl py-12 mb-12 flex items-center justify-center">
        <h1 className="text-[#FF3366] text-[96px] font-extrabold leading-none">
          GAME OVER
        </h1>
      </div>

      <div className="w-full max-w-xl text-center mb-12">
        <h2 className="text-white text-[40px] font-normal mb-6">
          Your final score: {stats.score}
        </h2>
        <div className="space-y-4 text-[#767676] text-sm">
          <p>Phishing Detected: {stats.phishingDetected}</p>
          <p>Legitimate Allowed: {stats.legitimateAllowed}</p>
          <p>False Positives: {stats.falsePositives}</p>
          <p>False Negatives: {stats.falseNegatives}</p>
          <p>Average Response Time: {stats.avgResponseTime.toFixed(1)}s</p>
        </div>
      </div>

      <div className="flex flex-row gap-6">
        <Link href="/game">
          <button className="bg-[#64FFDA] text-[#0A192F] font-extrabold text-lg py-3 px-8 rounded shadow-md transition-colors hover:bg-[#52E9C2]">
            PLAY AGAIN
          </button>
        </Link>

        <Link href="/dashboard">
          <button className="bg-[#FF3366] text-[#0A192F] font-extrabold text-lg py-3 px-8 rounded shadow-md transition-colors hover:bg-[#E52A59]">
            DASHBOARD
          </button>
        </Link>
      </div>
    </div>
  );
}

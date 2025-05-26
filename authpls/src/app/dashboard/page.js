'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLastGameStats } from '../statistics/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [lastGameStats, setLastGameStats] = useState(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/user');
        const data = await res.json();

        if (!res.ok) {
          throw new Error('Not authenticated');
        }

        setUsername(data.user.username);
      } catch (err) {
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const loadStats = async () => {
      const stats = await getLastGameStats();
      setLastGameStats(stats);
    };
    loadStats();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <span className="text-[#5FFBF1] font-mono">Welcome, {username}!</span>
        <button 
          onClick={handleLogout}
          className="text-[#FF4365] hover:text-[#FF5476] font-mono"
        >
          Logout
        </button>
      </div>

      <div className="text-center mb-16">
        <h1 className="text-[#5FFBF1] text-5xl font-mono mb-4">AuthenticatePlease</h1>
        <p className="text-[#FF4365] text-xl">Train to detect phishing</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-16">
        <Link href="/game" className="w-48">
          <button className="w-full bg-[#5FFBF1] text-[#0A192F] py-3 px-6 rounded font-mono text-lg hover:bg-[#FF4365] hover:text-white transition-colors">
            START GAME
          </button>
        </Link>

        <Link href="/statistics" className="w-48">
          <button className="w-full bg-[#5FFBF1] text-[#0A192F] py-3 px-6 rounded font-mono text-lg hover:bg-[#FF4365] hover:text-white transition-colors">
            STATISTICS
          </button>
        </Link>

        <Link href="/tutorial" className="w-48">
          <button className="w-full bg-[#5FFBF1] text-[#0A192F] py-3 px-6 rounded font-mono text-lg hover:bg-[#FF4365] hover:text-white transition-colors">
            TUTORIAL
          </button>
        </Link>

        <Link href="/settings" className="w-48">
          <button className="w-full bg-[#5FFBF1] text-[#0A192F] py-3 px-6 rounded font-mono text-lg hover:bg-[#FF4365] hover:text-white transition-colors">
            SETTINGS
          </button>
        </Link>
      </div>

      <div className="bg-[#0E1F37] p-8 rounded-lg w-full max-w-md">
        <h2 className="text-[#5FFBF1] text-2xl font-mono mb-4">
          YOUR LAST SCORE: <span className="text-[#FF4365]">{lastGameStats ? lastGameStats.score : 0}</span>
        </h2>
        <p className="text-gray-400 mb-6">
          Missed: {lastGameStats ? (lastGameStats.falsePositives + lastGameStats.falseNegatives) : 0} / 
          Correct: {lastGameStats ? (lastGameStats.phishingDetected + lastGameStats.legitimateAllowed) : 0}
        </p>
        
        <div className="flex items-end justify-between h-32">
          <div className="w-8 h-8 bg-[#5FFBF1]"></div>
          <div className="w-8 h-16 bg-[#5FFBF1]"></div>
          <div className="w-8 h-20 bg-[#5FFBF1]"></div>
          <div className="w-8 h-24 bg-[#5FFBF1]"></div>
          <div className="w-8 h-32 bg-[#5FFBF1]"></div>
          <div className="w-8 h-28 bg-[#5FFBF1]"></div>
        </div>
      </div>
    </div>
  );
} 
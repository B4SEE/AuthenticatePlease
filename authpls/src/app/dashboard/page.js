'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLastGameStats } from '../statistics/utils';
import BarChart from '../../components/BarChart';

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [lastGameStats, setLastGameStats] = useState(null);


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/user');
        const data = await res.json();
        if (!res.ok) throw new Error('Not authenticated');
        setUsername(data.user.username);
      } catch {
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

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  
  const missed = lastGameStats
    ? lastGameStats.falsePositives + lastGameStats.falseNegatives
    : 0;
  const correct = lastGameStats
    ? lastGameStats.phishingDetected + lastGameStats.legitimateAllowed
    : 0;

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center p-4 font-mono">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <span className="text-[#5FFBF1]">Welcome, {username}!</span>
        <button
          onClick={handleLogout}
          className="text-[#FF3366] hover:text-[#FF5476]"
        >
          Logout
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-[#64FFDA] text-5xl mb-2">AuthenticatePlease</h1>
        <p className="text-[#FF3366] text-xl">Train to detect phishing</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        <Link href="/game" className="w-48">
          <div className="w-full bg-[#64FFDA] text-[#0A192F] font-extrabold shadow-md py-3 px-6 rounded text-lg hover:bg-[#FF4365] hover:text-white transition-colors cursor-pointer flex items-center justify-center">
            START GAME
          </div>
        </Link>

        <Link href="/statistics" className="w-48">
          <div className="w-full bg-[#64FFDA] text-[#0A192F] font-extrabold shadow-md py-3 px-6 rounded text-lg hover:bg-[#FF4365] hover:text-white transition-colors cursor-pointer flex items-center justify-center">
            STATISTICS
          </div>
        </Link>

        <Link href="/tutorial" className="w-48">
          <div className="w-full bg-[#64FFDA] text-[#0A192F] font-extrabold shadow-md py-3 px-6 rounded text-lg hover:bg-[#FF4365] hover:text-white transition-colors cursor-pointer flex items-center justify-center">
            TUTORIAL
          </div>
        </Link>

        <Link href="/settings" className="w-48">
          <div className="w-full bg-[#64FFDA] text-[#0A192F] font-extrabold shadow-md py-3 px-6 rounded text-lg hover:bg-[#FF4365] hover:text-white transition-colors cursor-pointer flex items-center justify-center">
            SETTINGS
          </div>
        </Link>

        <Link href="/feedback" className="w-48">
          <div className="w-full bg-[#64FFDA] text-[#0A192F] font-extrabold shadow-md py-3 px-6 rounded text-lg hover:bg-[#FF4365] hover:text-white transition-colors cursor-pointer flex items-center justify-center">
            FEEDBACK
          </div>
        </Link>
      </div>

   
      <div className="bg-[#0B1120] border-4 border-[#112240] rounded-lg w-full max-w-md shadow-heavy">
        <div className="py-6">
          <h2 className="text-[#64FFDA] text-2xl font-bold mb-4 text-center">
            YOUR LAST SCORE:{' '}
            <span className="text-[#FF3366]">
              {lastGameStats ? lastGameStats.score : 0}
            </span>
          </h2>

          <div className="flex justify-between mb-6 px-6">
            <span className="text-[#FF3366] text-lg font-medium">
              Missed:{' '}
              {lastGameStats
                ? lastGameStats.falsePositives + lastGameStats.falseNegatives
                : 0}
            </span>
            <span className="text-[#5FFBF1] text-lg font-medium">
              Correct:{' '}
              {lastGameStats
                ? lastGameStats.phishingDetected + lastGameStats.legitimateAllowed
                : 0}
            </span>
          </div>

     
          <div className="w-full  ">
            <BarChart
              data={[missed, correct]}
              barHeight={52}  
              barGap={24}      
            />
          </div>
        </div>
      </div>
    </div>
  );
}

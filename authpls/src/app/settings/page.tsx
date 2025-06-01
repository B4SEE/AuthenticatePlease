'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Settings {
  timerLength: number;
  emailsToIgnore: number;
}

const SETTINGS_KEY = 'gameSettings';

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    timerLength: 60,
    emailsToIgnore: 3,
  });

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const update = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const handleTimer = (value: number) => {
    update({ ...settings, timerLength: value });
  };

  const handleIgnore = (value: number) => {
    update({ ...settings, emailsToIgnore: value });
  };

  return (
    <div className="relative min-h-screen bg-[#0A192F] font-mono">
      <div className="flex items-start p-4">
        <Link
          href="/dashboard"
          className="text-[#00FFD1] hover:text-[#00FFD1]/80 text-lg font-bold"
        >
          Back
        </Link>
      </div>

      {/* Основной контент чуть ниже и по центру по горизонтали */}
      <div className="flex flex-col items-center px-4 pt-32">
        {/* Заголовок */}
        <h1 className="text-[#64FFDA] text-5xl md:text-6xl mb-8 text-center">
          AuthenticatePlease
        </h1>

        {/* Карточка с заголовком SETTINGS */}
        <div className="bg-[#0B1120] border-4 border-[#112240] shadow-md rounded-sm w-full max-w-xl p-8 mb-8">
          <h2 className="text-[#64FFDA] text-4xl text-center">SETTINGS</h2>
        </div>

        {/* Секция: Timer Length (без бордера) */}
        <div className="w-full max-w-xl mb-8">
          <h3 className="text-[#64FFDA] text-3xl text-center mb-4">
            Timer length
          </h3>
          <div className="flex justify-center gap-1 flex-wrap">
            {[20, 30, 60].map((val) => (
              <button
                key={val}
                onClick={() => handleTimer(val)}
                className={`
                  px-4 py-2
                  ${settings.timerLength === val ? 'text-[#FF3366]' : 'text-[#767676]'}
                  hover:text-[#FF3366] transition-colors
                  text-2xl
                `}
              >
                {val}s
              </button>
            ))}
          </div>
        </div>

        {/* Секция: Emails to Ignore (без бордера) */}
        <div className="w-full max-w-xl mb-8">
          <h3 className="text-[#64FFDA] text-3xl text-center mb-4">
            Emails to ignore
          </h3>
          <div className="flex justify-center gap-1 flex-wrap">
            {[1, 3, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleIgnore(val)}
                className={`
                  px-4 py-2
                  ${settings.emailsToIgnore === val ? 'text-[#FF3366]' : 'text-[#767676]'}
                  hover:text-[#FF3366] transition-colors
                  text-2xl
                `}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

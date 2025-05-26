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
    emailsToIgnore: 3
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const handleTimerSelect = (value: number) => {
    updateSettings({ ...settings, timerLength: value });
  };

  const handleIgnoreSelect = (value: number) => {
    updateSettings({ ...settings, emailsToIgnore: value });
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center p-4">
      <div className="w-full max-w-xl">
        <h1 className="text-[#5FFBF1] text-6xl font-mono text-center mb-16">
          AuthenticatePlease
        </h1>

        <div className="bg-[#0E1F37] p-8 rounded-lg shadow-xl">
          <h2 className="text-[#5FFBF1] text-4xl font-mono text-center mb-12">
            SETTINGS
          </h2>

          <div className="space-y-12">
            {/* Timer Length */}
            <div className="space-y-4">
              <h3 className="text-[#5FFBF1] text-xl text-center">Timer length</h3>
              <div className="flex justify-center gap-8">
                {[20, 30, 60].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleTimerSelect(value)}
                    className={`px-4 py-2 rounded ${
                      settings.timerLength === value
                        ? 'bg-[#FF4365] text-white'
                        : 'text-gray-400 hover:text-[#5FFBF1]'
                    }`}
                  >
                    {value}s
                  </button>
                ))}
              </div>
            </div>

            {/* Emails to Ignore */}
            <div className="space-y-4">
              <h3 className="text-[#5FFBF1] text-xl text-center">Emails to ignore</h3>
              <div className="flex justify-center gap-8">
                {[1, 3, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleIgnoreSelect(value)}
                    className={`px-4 py-2 rounded ${
                      settings.emailsToIgnore === value
                        ? 'bg-[#FF4365] text-white'
                        : 'text-gray-400 hover:text-[#5FFBF1]'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="block w-full bg-[#5FFBF1] text-[#0A192F] py-3 rounded text-center font-mono hover:bg-[#4EEAE0] transition-colors"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
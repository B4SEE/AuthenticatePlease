'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-[#2A0E24] border-2 border-[#FF4365] p-12 rounded text-center mb-8">
          <h1 className="text-[#FF4365] text-8xl font-mono">500</h1>
        </div>
        
        <h2 className="text-[#FF4365] text-4xl font-mono text-center mb-4">Server Error</h2>
        <p className="text-[#FF4365] text-xl text-center mb-8">There was a problem on our end.</p>

        <div className="flex justify-center">
          <button
            onClick={reset}
            className="text-[#5FFBF1] text-xl font-mono hover:text-[#4EEAE0] transition-colors"
          >
            RETRY
          </button>
        </div>
      </div>
    </div>
  );
} 
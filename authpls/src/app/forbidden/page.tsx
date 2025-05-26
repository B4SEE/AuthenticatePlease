'use client';

import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-[#2A0E24] border-2 border-[#FF4365] p-12 rounded text-center mb-8">
          <h1 className="text-[#FF4365] text-8xl font-mono">403</h1>
        </div>
        
        <h2 className="text-[#FF4365] text-4xl font-mono text-center mb-4">Access denied</h2>
        <p className="text-[#FF4365] text-xl text-center mb-8">You don't have permission to view this page.</p>

        <div className="flex justify-center">
          <Link 
            href="/"
            className="text-[#5FFBF1] text-xl font-mono hover:text-[#4EEAE0] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
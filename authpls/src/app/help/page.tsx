'use client';

import React from 'react';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-4">
      <h1 className="text-[#5FFBF1] text-5xl font-mono mb-12">AuthenticatePlease</h1>
      
      <div className="bg-[#0E1F37] p-8 rounded-lg w-full max-w-md">
        <h2 className="text-[#5FFBF1] text-3xl font-mono mb-4">Need Help?</h2>
        
        <div className="space-y-6 text-gray-300">
          <div>
            <h3 className="text-[#5FFBF1] text-xl mb-2">Account Creation</h3>
            <p>To create an account, you need to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Choose a unique username</li>
              <li>Create a password (minimum 6 characters)</li>
              <li>Click &quot;START GAME&quot; to begin</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#5FFBF1] text-xl mb-2">Login Issues</h3>
            <p>If you&apos;re having trouble logging in:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Make sure your username is spelled correctly</li>
              <li>Check that your password is correct</li>
              <li>Ensure caps lock is not enabled</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link 
            href="/"
            className="text-[#5FFBF1] hover:underline font-mono"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 
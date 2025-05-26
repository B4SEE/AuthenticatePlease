'use client'

import Link from 'next/link'

export default function TutorialPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#00ffd1] p-4">
      <div className="flex items-start">
        <Link href="/" className="text-gray-400 hover:text-[#00ffd1] transition-colors">
          Back
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center mt-8 max-w-2xl mx-auto w-full">
        <h1 className="text-6xl font-mono mb-12">AuthenticatePlease</h1>

        <div className="bg-[#1a1a1a]/50 px-12 py-4 rounded-lg mb-12">
          <h2 className="text-3xl text-center">TUTORIAL</h2>
        </div>

        <div className="space-y-8 w-full">
          <div className="bg-[#1a1a1a]/50 p-6 rounded-lg flex items-start gap-6">
            <div className="flex-shrink-0 w-8 h-8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-mono mb-2">Step 1: Check the sender's address</h3>
              <p className="text-gray-400">Phishing emails often use fake domains like @security-mail.com, @security-mail.spce.</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/50 p-6 rounded-lg flex items-start gap-6">
            <div className="flex-shrink-0 w-8 h-8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-mono mb-2">Step 2: Hover before clicking links</h3>
              <p className="text-gray-400">Always inspect URLs – don't trust display text.</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/50 p-6 rounded-lg flex items-start gap-6">
            <div className="flex-shrink-0 w-8 h-8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-mono mb-2">Step 3: Check spelling and grammar</h3>
              <p className="text-gray-400">Many phishing attempts contain mistakes</p>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/50 p-6 rounded-lg flex items-start gap-6">
            <div className="flex-shrink-0 w-8 h-8">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-mono mb-2">Step 4: Urgent language is a red flag</h3>
              <p className="text-gray-400">"Act now!" or "Your account will be locked" = warning</p>
            </div>
          </div>
        </div>

        <button className="mt-12 text-[#ff4365] text-2xl hover:text-[#ff4365]/80 transition-colors">
          VIDEO TUTORIAL
        </button>
      </div>
    </div>
  )
} 
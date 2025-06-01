'use client';

import { useRouter } from 'next/navigation';
import FeedbackForm from '../../components/FeedbackForm';
import Link from 'next/link';

export default function FeedbackPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A192F] font-mono flex flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-start">
          <Link
            href="/dashboard"
            className="text-[#00FFD1] hover:text-[#00FFD1]/80 text-lg font-bold"
          >
            Back
          </Link>
        </div>

        <h1 className="text-[#64FFDA] text-5xl mb-12 text-center">Feedback</h1>

        <div className="bg-[#0B1120] border-4 border-[#112240] p-8 rounded-sm shadow-heavy">
          <h2 className="text-[#64FFDA] text-3xl mb-2 text-center">Share Your Experience</h2>
          <p className="text-[#8892B0] mb-6 text-center">
            Help us improve AuthenticatePlease by providing your feedback
          </p>

          <FeedbackForm />
        </div>
      </div>
    </div>
  );
} 
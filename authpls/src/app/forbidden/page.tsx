'use client';

import { useRouter } from 'next/navigation';

export default function BadGatewayPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center p-4 font-mono">
      <div className="w-full max-w-lg">
        <div className="bg-[#2A0E24] border-2 border-[#FF4365] p-12 rounded text-center mb-8">
          <h1 className="text-[#FF4365] text-8xl">403</h1>
        </div>
        
        <h2 className="text-[#FF4365] text-4xl text-center mb-4">BAD GATEWAY</h2>
        <p className="text-[#FF4365] text-xl text-center mb-8">We couldn't reach the server. Try again later.</p>

        <div className="flex justify-center">
          <button
            onClick={() => router.refresh()}
            className="text-[#5FFBF1] text-xl hover:text-[#4EEAE0] transition-colors"
          >
            RETRY
          </button>
        </div>
      </div>
    </div>
  );
}

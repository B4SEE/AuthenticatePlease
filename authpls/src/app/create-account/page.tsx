'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateAccountPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/user');
        if (res.ok) {
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        // Not authenticated, stay on create account page
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center">
        <div className="text-[#64FFDA] text-xl font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A192F] font-mono flex flex-col items-center justify-center p-4">
      <h1 className="text-[#64FFDA] text-5xl mb-12">AuthenticatePlease</h1>

      <div className="bg-[#0B1120] border-4 border-[#112240] p-8 rounded-sm w-full max-w-md shadow-heavy">
        <h2 className="text-[#64FFDA] text-3xl mb-2 text-center">Create Account</h2>
        <p className="text-[#FF4365] mb-6 text-center font-thin">
          Create a secure account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full p-3 rounded bg-[#1A2C44] text-white focus:outline-none focus:ring-2 focus:ring-[#5FFBF1]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full p-3 rounded bg-[#1A2C44] text-white focus:outline-none focus:ring-2 focus:ring-[#5FFBF1]"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#64FFDA] text-[#0A192F] py-3 rounded font-extrabold text-lg hover:bg-[#4EEAE0] transition-colors"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <div className="mt-6 flex justify-between items-center">
          <Link href="/help" className="text-[#64FFDA] hover:underline">
            Need help?
          </Link>
          <Link href="/" className="text-[#FF4365] hover:underline font-bold">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

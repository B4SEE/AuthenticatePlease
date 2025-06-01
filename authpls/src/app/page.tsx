'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
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
        // Not authenticated, stay on login page
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex items-center justify-center font-mono text-[#5FFBF1] text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A192F] font-mono flex flex-col items-center justify-center p-4">
      <h1 className="text-[#64FFDA] text-5xl font-mono mb-12">AuthenticatePlease</h1>

      <div className="bg-[#0B1120] border-4 border-[#112240] shadow-heavy p-8 rounded-sm w-full max-w-md">
        <h2 className="text-[#64FFDA] text-3xl font-mono mb-2 text-center">Login</h2>
        <p className="text-[#FF3366] mb-6 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/create-account" className="font-bold hover:underline">
            Signup
          </Link>
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
              className="w-full p-3 rounded bg-[#1A2C44] text-white border-none focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
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
              className="w-full p-3 rounded bg-[#1A2C44] text-white border-none focus:outline-none focus:ring-2 focus:ring-[#64FFDA]"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#64FFDA] text-[#0A192F] font-extrabold text-lg py-3 rounded shadow-md hover:bg-[#52E9C2] transition-colors"
          >
            LOGIN
          </button>
        </form>

        <div className="mt-6 text-left">
          <Link href="/help" className="text-[#64FFDA] hover:underline">
            Need help?
          </Link>
        </div>
      </div>
    </div>
  );
}

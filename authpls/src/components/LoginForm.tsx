import React, { useState } from "react";

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
  onReport: () => void;
}

export default function LoginForm({ onSubmit, onReport }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      username: 'demo@example.com', 
      password: 'demopassword123' 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-400 mb-2">Email</label>
        <input
          type="email"
          value="demo@example.com"
          disabled
          className="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Password</label>
        <input
          type="password"
          value="demopassword123"
          disabled
          className="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded cursor-not-allowed"
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-cyan-400 text-gray-900 px-6 py-2 rounded hover:bg-cyan-300 transition"
        >
          LOGIN
        </button>
        <button
          type="button"
          onClick={onReport}
          className="flex-1 bg-pink-500 px-6 py-2 rounded hover:bg-pink-400 transition"
        >
          REPORT
        </button>
      </div>
    </form>
  );
} 
import React from "react";

interface SurveyFormProps {
  onSubmit: () => void;
  onReport: () => void;
}

export default function SurveyForm({ onSubmit, onReport }: SurveyFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-gray-400 mb-2">Your full name</label>
        <input
          type="text"
          value="John Smith"
          disabled
          className="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Your email address</label>
        <input
          type="email"
          value="demo@example.com"
          disabled
          className="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-gray-400 mb-2">Do you use antivirus software?</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="antivirus"
              checked
              disabled
              className="mr-2 cursor-not-allowed"
            />
            <span className="text-gray-300">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="antivirus"
              disabled
              className="mr-2 cursor-not-allowed"
            />
            <span className="text-gray-300">No</span>
          </label>
        </div>
      </div>
      <div>
        <label className="block text-gray-400 mb-2">How often do you check your spam folder?</label>
        <select
          disabled
          value="weekly"
          className="w-full bg-gray-700 text-gray-300 px-4 py-2 rounded cursor-not-allowed"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="never">Never</option>
        </select>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-cyan-400 text-gray-900 px-6 py-2 rounded hover:bg-cyan-300 transition"
        >
          SUBMIT
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
export default function TutorialPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        <h2 className="text-xl font-bold text-[#00ffd1] mb-6">Tutorial</h2>
        
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00ffd1] text-black flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Create Your Account</h3>
              <p className="text-gray-400">
                Start by creating your account with a strong password. Make sure to use a combination
                of letters, numbers, and special characters.
              </p>
              <div className="mt-4 p-4 bg-[#111] rounded border border-gray-700">
                <code className="text-[#00ffd1]">password: Min. 8 characters, 1 uppercase, 1 number</code>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00ffd1] text-black flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Setup Two-Factor Authentication</h3>
              <p className="text-gray-400">
                Enable 2FA in your settings for an additional layer of security. We recommend using
                an authenticator app like Google Authenticator or Authy.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00ffd1] text-black flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Configure Your Settings</h3>
              <p className="text-gray-400">
                Visit the settings page to customize your experience. You can set up email notifications,
                adjust session timeouts, and choose your preferred theme.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00ffd1] text-black flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Monitor Your Activity</h3>
              <p className="text-gray-400">
                Use the dashboard and statistics pages to monitor your authentication activity.
                Keep an eye on failed login attempts and unusual patterns.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <button className="btn-primary">Finish Tutorial</button>
        </div>
      </div>
    </div>
  )
} 
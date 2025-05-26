export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        <h2 className="text-xl font-bold text-[#00ffd1] mb-6">Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Two-Factor Authentication</label>
                <div className="flex items-center gap-4">
                  <button className="btn-primary">Enable 2FA</button>
                  <span className="text-gray-400 text-sm">Not configured</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Session Timeout</label>
                <select className="input-field">
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="login-alerts" className="w-4 h-4" />
                <label htmlFor="login-alerts">Send alerts on new login attempts</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="security-updates" className="w-4 h-4" />
                <label htmlFor="security-updates">Receive security update notifications</label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn-primary">Light Mode</button>
              <button className="bg-[#1a1a1a] border border-[#00ffd1] text-[#00ffd1] px-4 py-2 rounded">
                Dark Mode
              </button>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-700">
            <button className="btn-error">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  )
} 
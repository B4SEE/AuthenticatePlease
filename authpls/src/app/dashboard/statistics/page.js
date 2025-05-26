export default function StatisticsPage() {
  return (
    <div className="grid gap-6">
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        <h2 className="text-xl font-bold text-[#00ffd1] mb-4">Authentication Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 flex items-center justify-center border border-gray-700 rounded">
            <div className="text-gray-500">Login Success Rate Graph</div>
          </div>
          <div className="h-64 flex items-center justify-center border border-gray-700 rounded">
            <div className="text-gray-500">User Growth Graph</div>
          </div>
          <div className="h-64 flex items-center justify-center border border-gray-700 rounded">
            <div className="text-gray-500">Daily Active Users Graph</div>
          </div>
          <div className="h-64 flex items-center justify-center border border-gray-700 rounded">
            <div className="text-gray-500">Failed Attempts Graph</div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1a1a1a] p-6 rounded-lg">
        <h2 className="text-xl font-bold text-[#00ffd1] mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center p-4 border border-gray-700 rounded">
              <div>
                <p className="text-[#00ffd1]">User Login</p>
                <p className="text-sm text-gray-400">user@example.com</p>
              </div>
              <div className="text-sm text-gray-400">2 minutes ago</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
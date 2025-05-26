'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getAllTimeStats, getLastGameStats, calculateAccuracy, calculateAvgTime, resetAllStats, exportStatsToCSV } from './utils'
import { GameStatistics } from '../game/types'
import type { AllTimeStatistics } from './utils'

const emptyGameStats: GameStatistics = {
  score: 0,
  totalEmails: 0,
  phishingDetected: 0,
  legitimateAllowed: 0,
  falsePositives: 0,
  falseNegatives: 0,
  avgResponseTime: 0,
  endReason: 'game_over' as const
}

const emptyAllTimeStats: AllTimeStatistics = {
  totalGames: 0,
  falsePositives: 0,
  falseNegatives: 0,
  totalReported: 0,
  totalResponseTime: 0,
  totalDecisions: 0,
  phishingDetected: 0,
  legitimateAllowed: 0
}

export default function StatisticsPage() {
  const [showAllTime, setShowAllTime] = useState(true)
  const [allTimeStats, setAllTimeStats] = useState<AllTimeStatistics>(emptyAllTimeStats)
  const [lastGameStats, setLastGameStats] = useState<GameStatistics | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      const [allTime, lastGame] = await Promise.all([
        getAllTimeStats(),
        getLastGameStats()
      ])
      setAllTimeStats(allTime)
      setLastGameStats(lastGame || emptyGameStats)
    }
    loadStats()
  }, [])

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
      return
    }
    await resetAllStats()
    setAllTimeStats(emptyAllTimeStats)
    setLastGameStats(emptyGameStats)
  }

  const handleExport = async () => {
    await exportStatsToCSV()
  }

  const currentStats = showAllTime ? allTimeStats : (lastGameStats || emptyGameStats)

  if (!currentStats && showAllTime) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#00ffd1]">No statistics available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <div className="flex items-start p-4">
        <Link href="/dashboard" className="text-[#00ffd1] hover:text-[#00ffd1]/80">
          Back
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
        <h1 className="text-[#00ffd1] text-6xl font-mono">AuthenticatePlease</h1>

        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <h2 className="text-[#00ffd1] text-4xl mb-4">STATISTICS</h2>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <button 
              onClick={() => setShowAllTime(true)}
              className={`px-6 py-2 rounded-lg transition-colors ${
                showAllTime 
                ? 'bg-[#00ffd1] text-black' 
                : 'text-[#00ffd1] border border-[#00ffd1]'
              }`}
            >
              All-Time
            </button>
            <button 
              onClick={() => setShowAllTime(false)}
              className={`px-6 py-2 rounded-lg transition-colors ${
                !showAllTime 
                ? 'bg-[#00ffd1] text-black' 
                : 'text-[#00ffd1] border border-[#00ffd1]'
              }`}
            >
              Last Game
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <div className="bg-[#1a1a1a] p-4 rounded-lg mb-4">
                <h4 className="text-gray-400 mb-2">False Positives</h4>
                <p className="text-[#00ffd1] text-2xl">{currentStats.falsePositives}</p>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <h4 className="text-gray-400 mb-2">Avg Time</h4>
                <p className="text-[#00ffd1] text-2xl">{calculateAvgTime(currentStats)}</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-[#1a1a1a] p-4 rounded-lg mb-4">
                <h4 className="text-gray-400 mb-2">Total Reported</h4>
                <p className="text-[#00ffd1] text-2xl">
                  {showAllTime 
                    ? (currentStats as AllTimeStatistics).totalReported 
                    : (currentStats.phishingDetected + currentStats.falsePositives)}
                </p>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-lg">
                <h4 className="text-gray-400 mb-2">Accuracy</h4>
                <p className="text-[#00ffd1] text-2xl">{calculateAccuracy(currentStats)}</p>
              </div>
            </div>
          </div>

          {showAllTime && (
            <div className="bg-[#1a1a1a] p-4 rounded-lg text-center mb-8">
              <h3 className="text-gray-400 mb-2">Games Played</h3>
              <p className="text-[#ff4365] text-xl">
                {`${(currentStats as AllTimeStatistics).totalGames} phishing simulations completed.`}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={handleExport}
              className="w-full bg-[#ff4365] text-white py-3 rounded-lg hover:bg-[#ff4365]/90 transition-colors"
            >
              EXPORT CSV
            </button>
            
            <button 
              onClick={handleReset}
              className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              RESET STATISTICS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  getAllTimeStats,
  getLastGameStats,
  calculateAccuracy,
  calculateAvgTime,
  resetAllStats,
  exportStatsToCSV
} from './utils'
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
      <div className="min-h-screen font-mono flex flex-col bg-[#0A192F]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#00FFD1] text-2xl font-extrabold">No statistics available</div>
        </div>
      </div>
    )
  }


  const bind3DTilt = () => {
    let ref: HTMLDivElement | null = null

    const onMouseEnter = (e: React.MouseEvent) => {
      ref = e.currentTarget as HTMLDivElement
      ref.style.transition = 'transform 0.3s ease'
      ref.style.transform = 'rotateX(10deg) rotateY(10deg)'
    }

    const onMouseMove = (e: React.MouseEvent) => {
      if (!ref) return
      const rect = ref.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      const maxRotate = 20 
      const rotateY = (x / (rect.width / 2)) * maxRotate
      const rotateX = -(y / (rect.height / 2)) * maxRotate
      ref.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const onMouseLeave = (e: React.MouseEvent) => {
      ref = e.currentTarget as HTMLDivElement
      ref.style.transition = 'transform 0.3s ease'
      ref.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }

    return { onMouseEnter, onMouseMove, onMouseLeave }
  }

  const tiltHandlers = bind3DTilt()

  return (
    <div className="min-h-screen font-mono flex flex-col bg-[#0A192F]">
      <div className="flex items-start p-4">
        <Link href="/dashboard" className="text-[#00FFD1] hover:text-[#00FFD1]/80 text-lg font-bold">
          Back
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
        <div className="bg-[#0B1120] border-4 border-[#112240] shadow-md flex items-center justify-center w-full max-w-xl min-h-[150px]">
          <h2 className="text-[#00FFD1] text-5xl font-extrabold">STATISTICS</h2>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowAllTime(true)}
            className={`
              px-6 py-2 transition-colors font-extrabold text-xl
              ${showAllTime
                ? 'text-[#64FFDA]'
                : 'text-[#767676] hover:text-[#64FFDA]'}
            `}
          >
            All-Time
          </button>
          <button
            onClick={() => setShowAllTime(false)}
            className={`
              px-6 py-2 transition-colors font-extrabold text-xl
              ${!showAllTime
                ? 'text-[#64FFDA]'
                : 'text-[#767676] hover:text-[#64FFDA]'}
            `}
          >
            Last Game
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-xl">
          <div className="flex flex-col gap-8">
            <div
              style={{ perspective: '600px' }}
            >
              <div
                {...tiltHandlers}
                className="bg-[#0B1120] border-4 border-[#112240] shadow-md aspect-square flex flex-col items-center justify-center p-4"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(0deg) rotateY(0deg)',
                }}
              >
                <h4 className="text-gray-400 mb-2 text-lg">False Positives</h4>
                <p className="text-[#00FFD1] text-3xl font-extrabold">
                  {currentStats.falsePositives}
                </p>
              </div>
            </div>

            <div style={{ perspective: '600px' }}>
              <div
                {...tiltHandlers}
                className="bg-[#0B1120] border-4 border-[#112240] shadow-md aspect-square flex flex-col items-center justify-center p-4"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(0deg) rotateY(0deg)',
                }}
              >
                <h4 className="text-gray-400 mb-2 text-lg">Avg Time</h4>
                <p className="text-[#00FFD1] text-3xl font-extrabold">
                  {calculateAvgTime(currentStats)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div style={{ perspective: '600px' }}>
              <div
                {...tiltHandlers}
                className="bg-[#0B1120] border-4 border-[#112240] shadow-md aspect-square flex flex-col items-center justify-center p-4"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(0deg) rotateY(0deg)',
                }}
              >
                <h4 className="text-gray-400 mb-2 text-lg">Total Reported</h4>
                <p className="text-[#00FFD1] text-3xl font-extrabold">
                  {showAllTime
                    ? (currentStats as AllTimeStatistics).totalReported
                    : (currentStats.phishingDetected + currentStats.falsePositives)}
                </p>
              </div>
            </div>

            <div style={{ perspective: '600px' }}>
              <div
                {...tiltHandlers}
                className="bg-[#0B1120] border-4 border-[#112240] shadow-md aspect-square flex flex-col items-center justify-center p-4"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(0deg) rotateY(0deg)',
                }}
              >
                <h4 className="text-gray-400 mb-2 text-lg">Accuracy</h4>
                <p className="text-[#00FFD1] text-3xl font-extrabold">
                  {calculateAccuracy(currentStats)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {showAllTime && (
          <div style={{ perspective: '600px' }}>
            <div
              {...tiltHandlers}
              className="bg-[#0B1120] border-4 border-[#112240] shadow-md aspect-square flex flex-col items-center justify-center w-full max-w-xl p-4"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(0deg) rotateY(0deg)',
              }}
            >
              <h3 className="text-gray-400 mb-2 text-lg">Games Played</h3>
              <p className="text-[#FF4365] text-2xl font-medium">
                {(currentStats as AllTimeStatistics).totalGames} phishing simulations completed.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 w-full max-w-xl">
          <button
            onClick={handleExport}
            className="
              w-full
              bg-[#FF3366]
              text-[#0A192F]
              font-extrabold
              text-xl
              shadow-md
              py-6
              rounded-sm
              transition-colors
              hover:bg-[#64FFDA]
            "
          >
            EXPORT CSV
          </button>

          <button
            onClick={handleReset}
            className="
              w-full
              bg-[#0A192F]
              text-white
              font-extrabold
              text-xl
              shadow-md
              py-6
              rounded-sm
              transition-colors
              hover:bg-[#0B1321]
            "
          >
            RESET STATISTICS
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import useDerivedStats from '../hooks/useDerivedStats'

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function buildSeriesPath(data, key, maxValue) {
  const points = data
    .map((entry, index) => {
      const value = Number(entry[key])
      if (!Number.isFinite(value)) return null

      const x = data.length <= 1 ? 50 : (index / (data.length - 1)) * 100
      const y = 92 - (value / maxValue) * 82
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .filter(Boolean)

  return points.join(' ')
}

function SeriesLine({ data, dataKey, maxValue, className, dashed = false }) {
  const points = buildSeriesPath(data, dataKey, maxValue)
  if (!points) return null

  return (
    <polyline
      fill="none"
      points={points}
      stroke="currentColor"
      strokeDasharray={dashed ? '4 4' : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      className={className}
    />
  )
}

export default function PlayerGraph({ history = [], showYesterday, showProjection, showRollingAvg }) {
  const [localShowYesterday, setLocalShowYesterday] = useState(() => !!showYesterday)
  const [localShowProjection, setLocalShowProjection] = useState(() => !!showProjection)
  const [localShowRollingAvg, setLocalShowRollingAvg] = useState(() => !!showRollingAvg)

  const derived = useDerivedStats({ history })

  const chartData = history.map((entry) => {
    const timestamp = entry?.timestamp ?? 0
    let yesterdayVal = null
    if (localShowYesterday && derived?.yesterdayHistory?.length > 0) {
      const targetTime = timestamp - 24 * 60 * 60 * 1000
      const closest = derived.yesterdayHistory.reduce((prev, curr) =>
        Math.abs((curr?.timestamp ?? 0) - targetTime) <
        Math.abs((prev?.timestamp ?? 0) - targetTime)
          ? curr
          : prev
      )
      if (Math.abs((closest?.timestamp ?? 0) - targetTime) < 30 * 60 * 1000) {
        yesterdayVal = closest?.players?.online ?? null
      }
    }

    let rollingAvgVal = null
    if (localShowRollingAvg && derived?.rollingAvg7d?.length > 0) {
      const dateKey = new Date(timestamp).toISOString().slice(0, 10)
      const match = derived.rollingAvg7d.find((item) => item.date === dateKey)
      rollingAvgVal = match?.avg ?? derived.rollingAvg7d.at(-1)?.avg ?? null
    }

    return {
      timestamp,
      displayTime: formatTime(timestamp),
      today: entry?.players?.online ?? 0,
      yesterday: yesterdayVal,
      rollingAvg: rollingAvgVal,
      projection: null,
    }
  })

  if (localShowProjection && derived?.projectionPoints?.length > 0 && chartData.length > 0) {
    chartData[chartData.length - 1].projection = chartData[chartData.length - 1].today
    derived.projectionPoints.forEach((point) => {
      chartData.push({
        timestamp: point.timestamp,
        displayTime: formatTime(point.timestamp),
        today: null,
        yesterday: null,
        rollingAvg: null,
        projection: point.projected,
      })
    })
  }

  const visibleValues = chartData.flatMap((entry) =>
    ['today', 'yesterday', 'rollingAvg', 'projection']
      .map((key) => Number(entry[key]))
      .filter(Number.isFinite)
  )
  const maxValue = Math.max(1, ...visibleValues)
  const firstLabel = chartData[0]?.displayTime
  const lastLabel = chartData.at(-1)?.displayTime

  return (
    <div className="flex w-full flex-col rounded-xl bg-slate-50 p-5 shadow-sm dark:bg-slate-800 dark:shadow-none">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Player Activity
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setLocalShowYesterday(!localShowYesterday)}
            className={`rounded px-2.5 py-1 text-xs transition-colors ${
              localShowYesterday
                ? 'bg-slate-900 font-semibold text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300/85 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600/85'
            }`}
          >
            Yesterday
          </button>
          <button
            type="button"
            onClick={() => setLocalShowProjection(!localShowProjection)}
            className={`rounded px-2.5 py-1 text-xs transition-colors ${
              localShowProjection
                ? 'bg-slate-900 font-semibold text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300/85 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600/85'
            }`}
          >
            Projection
          </button>
          <button
            type="button"
            onClick={() => setLocalShowRollingAvg(!localShowRollingAvg)}
            className={`rounded px-2.5 py-1 text-xs transition-colors ${
              localShowRollingAvg
                ? 'bg-slate-900 font-semibold text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300/85 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600/85'
            }`}
          >
            7d Avg
          </button>
        </div>
      </div>

      <div className="h-44 w-full">
        {chartData.length > 0 ? (
          <div className="flex h-full flex-col">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="min-h-0 flex-1">
              {[20, 40, 60, 80].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="100"
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.35"
                  className="text-slate-200 dark:text-slate-700"
                />
              ))}
              <SeriesLine data={chartData} dataKey="today" maxValue={maxValue} className="text-blue-500" />
              {localShowYesterday ? (
                <SeriesLine data={chartData} dataKey="yesterday" maxValue={maxValue} dashed className="text-slate-400" />
              ) : null}
              {localShowRollingAvg ? (
                <SeriesLine data={chartData} dataKey="rollingAvg" maxValue={maxValue} className="text-emerald-500" />
              ) : null}
              {localShowProjection ? (
                <SeriesLine data={chartData} dataKey="projection" maxValue={maxValue} dashed className="text-amber-500" />
              ) : null}
            </svg>
            <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-slate-400">
              <span>{firstLabel}</span>
              <span>{maxValue.toFixed(0)} max</span>
              <span>{lastLabel}</span>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white/50 px-4 text-center text-sm text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/30 dark:text-slate-400">
            Player activity will appear after the first successful status check.
          </div>
        )}
      </div>
    </div>
  )
}

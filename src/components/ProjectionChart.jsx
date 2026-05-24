import useDerivedStats from '../hooks/useDerivedStats'

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function buildPath(data, key, maxValue) {
  return data
    .map((entry, index) => {
      const value = Number(entry[key])
      if (!Number.isFinite(value)) return null

      const x = data.length <= 1 ? 50 : (index / (data.length - 1)) * 100
      const y = 92 - (value / maxValue) * 82
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .filter(Boolean)
    .join(' ')
}

function ChartLine({ data, dataKey, maxValue, className, dashed = false }) {
  const points = buildPath(data, dataKey, maxValue)
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

export default function ProjectionChart({ history = [] }) {
  const derived = useDerivedStats({ history })
  const activeHistory = (history || []).slice(-20)
  const activeProjection = derived?.projectionPoints || []

  const chartData = activeHistory.map((entry) => ({
    timestamp: entry.timestamp,
    displayTime: formatTime(entry.timestamp),
    historyVal: entry?.players?.online ?? 0,
    projectionVal: null,
  }))

  const lastHistoryPoint = chartData[chartData.length - 1]
  if (lastHistoryPoint && activeProjection.length > 0) {
    lastHistoryPoint.projectionVal = lastHistoryPoint.historyVal
    activeProjection.forEach((point) => {
      chartData.push({
        timestamp: point.timestamp,
        displayTime: formatTime(point.timestamp),
        historyVal: null,
        projectionVal: point.projected,
      })
    })
  }

  const values = chartData.flatMap((entry) =>
    [entry.historyVal, entry.projectionVal].map(Number).filter(Number.isFinite)
  )
  const maxValue = Math.max(1, ...values)
  const splitIndex = chartData.findIndex((entry) => entry.projectionVal !== null)
  const splitX =
    splitIndex <= 0 || chartData.length <= 1 ? null : (splitIndex / (chartData.length - 1)) * 100

  return (
    <div className="flex w-full flex-col rounded-xl bg-slate-50 p-5 shadow-sm dark:bg-slate-800 dark:shadow-none">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Player Projection
        </h3>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
          Forecasted player activity based on recent status checks.
        </p>
      </div>

      <div className="relative mt-4 flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-200 bg-white/40 dark:border-slate-700/60 dark:bg-slate-900/30">
        {chartData.length > 1 ? (
          <>
            <div className="h-full w-full p-3 pb-8">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
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
                {splitX !== null ? (
                  <line
                    x1={splitX}
                    x2={splitX}
                    y1="4"
                    y2="96"
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    strokeWidth="0.8"
                    className="text-slate-400"
                  />
                ) : null}
                <ChartLine data={chartData} dataKey="historyVal" maxValue={maxValue} className="text-blue-500" />
                <ChartLine
                  data={chartData}
                  dataKey="projectionVal"
                  maxValue={maxValue}
                  dashed
                  className="text-amber-500"
                />
              </svg>
            </div>
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-medium text-slate-400">
              <span>{chartData[0]?.displayTime}</span>
              <span>{maxValue.toFixed(0)} max</span>
              <span>{chartData.at(-1)?.displayTime}</span>
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-3 rounded border border-slate-100 bg-white/80 px-2 py-1 text-[10px] font-semibold backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/80">
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-2 bg-blue-500" /> Historical
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-2 border-t border-dashed border-amber-500" /> Projected
              </span>
            </div>
          </>
        ) : (
          <div className="px-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Projection needs at least two status checks.
          </div>
        )}
      </div>
    </div>
  )
}

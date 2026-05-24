import CapacityBar from '../components/CapacityBar.jsx'
import PlayerCountCard from '../components/PlayerCountCard.jsx'
import StreakCard from '../components/StreakCard.jsx'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

function formatDateTime(value) {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatNumber(value, digits = 1) {
  const nextValue = Number(value)
  if (!Number.isFinite(nextValue)) return '0'
  if (Number.isInteger(nextValue)) return String(nextValue)
  return nextValue.toFixed(digits)
}

export default function Overview({ status = {}, history = {}, derived = {} }) {
  const historyEntries = Array.isArray(history.history) ? history.history : []
  const peak = history.peak ?? null
  const previousCount =
    historyEntries.length > 1
      ? historyEntries[historyEntries.length - 2]?.players?.online ?? 0
      : status.players?.online ?? 0
  const online = status.players?.online ?? 0
  const max = status.players?.max ?? 0

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <PlayerCountCard online={online} max={max} previousCount={previousCount} />

          <div className="rounded-2xl border border-slate-200/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Server Status
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-50">
                  {status.online ? 'Online' : 'Offline'}
                </h2>
              </div>

              <StatusBadge
                online={Boolean(status.online)}
                lastChecked={formatDateTime(status.lastChecked)}
              />
            </div>

            <div className="mt-5 space-y-3">
              <CapacityBar online={online} max={max} />
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{online} players online</span>
                <span>
                  {max > 0 ? `${formatNumber((online / max) * 100, 0)}% capacity` : 'Capacity unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <StreakCard days={history.streak?.days ?? 0} hours={history.streak?.hours ?? 0} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Session Peak" value={formatNumber(derived.sessionPeak, 0)} />
        <StatCard label="Session Avg" value={formatNumber(derived.sessionAvg)} />
        <StatCard label="Uptime" value={`${formatNumber(derived.uptimePct)}%`} />
        <StatCard
          label="All-Time Peak"
          value={peak?.count ?? 0}
          subtext={formatDateTime(peak?.timestamp) || 'No peak recorded yet'}
        />
      </section>
    </div>
  )
}

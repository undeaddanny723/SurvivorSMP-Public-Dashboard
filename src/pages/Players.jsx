import PlayerGraph from '../components/PlayerGraph.jsx'
import SessionTimeline from '../components/SessionTimeline.jsx'
import StatCard from '../components/StatCard.jsx'

function formatSignedValue(value) {
  const nextValue = Number(value)
  const safeValue = Number.isFinite(nextValue) ? nextValue : 0
  return `${safeValue >= 0 ? '+' : ''}${safeValue}`
}

function formatPercent(value) {
  const nextValue = Number(value)
  if (!Number.isFinite(nextValue)) return '0%'
  return `${Math.round(nextValue * 100)}%`
}

export default function Players({ status = {}, history = {}, derived = {} }) {
  const historyEntries = Array.isArray(history.history) ? history.history : []
  const online = Number(status.players?.online ?? 0)
  const max = Number(status.players?.max ?? 0)
  const lastVisitDelta = Number.isFinite(Number(history.lastVisitDelta))
    ? Number(history.lastVisitDelta)
    : 0

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Online Now" value={Number.isFinite(online) ? online : 0} />
        <StatCard label="Max Slots" value={Number.isFinite(max) ? max : 0} />
        <StatCard label="vs Last Visit" value={formatSignedValue(lastVisitDelta)} />
        <StatCard label="Capacity" value={formatPercent(derived.capacityPct)} />
      </section>

      <PlayerGraph history={historyEntries} />
      <SessionTimeline history={historyEntries} />
    </div>
  )
}

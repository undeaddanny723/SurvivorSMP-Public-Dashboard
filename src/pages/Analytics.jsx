import HeatmapCalendar from '../components/HeatmapCalendar.jsx'
import IncidentLog from '../components/IncidentLog.jsx'
import ProjectionChart from '../components/ProjectionChart.jsx'
import StatCard from '../components/StatCard.jsx'

function formatNumber(value, digits = 1) {
  const nextValue = Number(value)
  if (!Number.isFinite(nextValue)) return '0'
  if (Number.isInteger(nextValue)) return String(nextValue)
  return nextValue.toFixed(digits)
}

export default function Analytics({ status = {}, history = {}, derived = {} }) {
  const historyEntries = Array.isArray(history.history) ? history.history : []
  const incidents = Array.isArray(history.incidents) ? history.incidents : []

  void status

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-2">
        <HeatmapCalendar data={derived.heatmapData} />
        <ProjectionChart history={historyEntries} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Incidents" value={incidents.length} />
        <StatCard label="Avg Players" value={formatNumber(derived.sessionAvg)} />
      </section>

      <IncidentLog incidents={incidents} />
    </div>
  )
}

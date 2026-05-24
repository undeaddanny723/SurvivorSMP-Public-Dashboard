import HeatmapCalendar from '../components/HeatmapCalendar.jsx'
import IncidentLog from '../components/IncidentLog.jsx'
import ProjectionChart from '../components/ProjectionChart.jsx'
import StatCard from '../components/StatCard.jsx'
import UptimeRingChart from '../components/UptimeRingChart.jsx'
import PeakHoursChart from '../components/PeakHoursChart.jsx'
import { useMemo } from 'react'
import useServerHistory from '../hooks/useServerHistory.js'

function formatNumber(value, digits = 1) {
  const nextValue = Number(value)
  if (!Number.isFinite(nextValue)) return '0'
  if (Number.isInteger(nextValue)) return String(nextValue)
  return nextValue.toFixed(digits)
}

export default function Analytics({ status = {}, derived = {} }) {
  const { history: serverHistory, incidents: serverIncidents } = useServerHistory()

  const historyEntries = Array.isArray(serverHistory.history) ? serverHistory.history : []
  const incidents = Array.isArray(serverIncidents) ? serverIncidents : []

  // Calculate uptimePercentage
  const uptimePercentage = useMemo(() => {
    if (historyEntries.length <= 1) {
      return 100 // Not enough data to determine uptime, assume 100%
    }

    const firstTimestamp = historyEntries[0].timestamp
    const lastTimestamp = historyEntries[historyEntries.length - 1].timestamp
    const totalTrackedTime = lastTimestamp - firstTimestamp // in milliseconds

    if (totalTrackedTime <= 0) {
      return 100 // No time tracked, assume 100%
    }

    const totalIncidentDuration = incidents.reduce((sum, incident) => sum + (incident.duration || 0), 0) // in milliseconds

    let calculatedUptime = ((totalTrackedTime - totalIncidentDuration) / totalTrackedTime) * 100
    calculatedUptime = Math.max(0, Math.min(100, calculatedUptime)) // Clamp between 0 and 100
    return calculatedUptime
  }, [historyEntries, incidents])

  // Calculate peakHoursData
  const peakHoursData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, totalPlayers: 0, count: 0 }))

    historyEntries.forEach(entry => {
      const date = new Date(entry.timestamp)
      const hour = date.getHours()
      hours[hour].totalPlayers += entry.players.online
      hours[hour].count += 1
    })

    return hours.map(h => ({
      hour: h.hour,
      averagePlayers: h.count > 0 ? h.totalPlayers / h.count : 0
    }))
  }, [historyEntries])


  void status

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-2">
        <HeatmapCalendar data={derived.heatmapData} />
        <ProjectionChart history={historyEntries} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Incidents" value={incidents.length} valueClassName="text-red-500 dark:text-red-400" />
        <StatCard label="Avg Players" value={formatNumber(derived.sessionAvg)} valueClassName="text-blue-500 dark:text-blue-400" />
        <StatCard label="Uptime" value={`${formatNumber(uptimePercentage, 2)}%`} valueClassName="text-green-500 dark:text-green-400" />
      </section>

      <section className="rounded-xl bg-slate-50 p-5 shadow-sm dark:bg-slate-800 dark:shadow-none flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-2">Server Uptime</h3>
        <UptimeRingChart percentage={uptimePercentage} />
        <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          {formatNumber(uptimePercentage, 2)}%
        </p>
      </section>

      {/* New section for PeakHoursChart */}
      <section className="grid gap-4">
        <PeakHoursChart data={peakHoursData} />
      </section>

      <IncidentLog incidents={incidents} />
    </div>
  )
}

import { useMemo } from 'react'
import { CAPACITY_DANGER, CAPACITY_WARN } from '../lib/constants'

const DAY_MS = 24 * 60 * 60 * 1000

function toNumber(value, fallback = 0) {
  const nextValue = Number(value)
  return Number.isFinite(nextValue) ? nextValue : fallback
}

function startOfDay(timestamp) {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date
}

function formatDateKey(timestamp) {
  return startOfDay(timestamp).toISOString().slice(0, 10)
}

function getCapacityStatus(capacityPct) {
  if (capacityPct >= CAPACITY_DANGER) return 'danger'
  if (capacityPct >= CAPACITY_WARN) return 'warning'
  return 'normal'
}

function buildProjectionPoints(entries) {
  if (entries.length < 2) return []

  const points = entries.map((entry, index) => ({
    x: index,
    y: toNumber(entry?.players?.online, 0),
    timestamp: toNumber(entry?.timestamp, 0),
  }))

  const count = points.length
  const sumX = points.reduce((total, point) => total + point.x, 0)
  const sumY = points.reduce((total, point) => total + point.y, 0)
  const sumXY = points.reduce((total, point) => total + point.x * point.y, 0)
  const sumXX = points.reduce((total, point) => total + point.x * point.x, 0)
  const denominator = count * sumXX - sumX * sumX
  const slope = denominator === 0 ? 0 : (count * sumXY - sumX * sumY) / denominator
  const intercept = (sumY - slope * sumX) / count

  const intervals = []
  for (let index = 1; index < points.length; index += 1) {
    const interval = points[index].timestamp - points[index - 1].timestamp
    if (interval > 0) intervals.push(interval)
  }

  const averageInterval =
    intervals.length > 0
      ? intervals.reduce((total, interval) => total + interval, 0) / intervals.length
      : 0

  if (averageInterval <= 0) return []

  const lastPoint = points[points.length - 1]

  return Array.from({ length: 5 }, (_, index) => {
    const projectedX = lastPoint.x + index + 1
    const projected = Math.max(0, slope * projectedX + intercept)

    return {
      timestamp: Math.round(lastPoint.timestamp + averageInterval * (index + 1)),
      projected,
    }
  })
}

export default function useDerivedStats({ history = [], peak, incidents } = {}) {
  return useMemo(() => {
    void peak
    void incidents

    const entries = Array.isArray(history) ? history : []
    const latestEntry = entries[entries.length - 1] ?? null
    const onlineValues = entries.map((entry) => toNumber(entry?.players?.online, 0))
    const sessionPeak = onlineValues.length ? Math.max(...onlineValues) : 0
    const sessionAvg =
      onlineValues.length > 0
        ? onlineValues.reduce((total, value) => total + value, 0) / onlineValues.length
        : 0

    const latestOnline = toNumber(latestEntry?.players?.online, 0)
    const latestMax = toNumber(latestEntry?.players?.max, 0)
    const capacityPct = latestMax > 0 ? latestOnline / latestMax : 0
    const capacityStatus = getCapacityStatus(capacityPct)

    const uptimePct =
      entries.length > 0
        ? (entries.filter((entry) => Boolean(entry?.online)).length / entries.length) * 100
        : 0

    const hourlyTotals = Array.from({ length: 24 }, () => ({ total: 0, count: 0 }))
    const dailyTotals = new Map()

    for (const entry of entries) {
      const timestamp = toNumber(entry?.timestamp, 0)
      const playersOnline = toNumber(entry?.players?.online, 0)
      const date = new Date(timestamp)
      const hour = date.getHours()

      hourlyTotals[hour].total += playersOnline
      hourlyTotals[hour].count += 1

      const dateKey = formatDateKey(timestamp)
      const existing = dailyTotals.get(dateKey) ?? { total: 0, count: 0, date: dateKey }
      existing.total += playersOnline
      existing.count += 1
      dailyTotals.set(dateKey, existing)
    }

    const peakHours = hourlyTotals.map(({ total, count }) => (count > 0 ? total / count : 0))
    const heatmapData = Array.from(dailyTotals.values()).map(({ date, total, count }) => ({
      date,
      avg: count > 0 ? total / count : 0,
    }))

    const today = startOfDay(Date.now())
    const yesterdayStart = new Date(today.getTime() - DAY_MS)
    const yesterdayEnd = today
    const yesterdayHistory = entries.filter((entry) => {
      const timestamp = toNumber(entry?.timestamp, 0)
      return timestamp >= yesterdayStart.getTime() && timestamp < yesterdayEnd.getTime()
    })

    const rollingAvg7d = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today.getTime() - (6 - index) * DAY_MS)
      const dateKey = date.toISOString().slice(0, 10)
      const totals = dailyTotals.get(dateKey)

      return {
        date: dateKey,
        avg: totals && totals.count > 0 ? totals.total / totals.count : 0,
      }
    })

    const projectionPoints = buildProjectionPoints(entries.slice(-20))

    return {
      sessionPeak,
      sessionAvg,
      capacityPct,
      capacityStatus,
      uptimePct,
      peakHours,
      rollingAvg7d,
      yesterdayHistory,
      projectionPoints,
      heatmapData,
    }
  }, [history, peak, incidents])
}

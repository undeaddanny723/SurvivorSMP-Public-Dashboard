import { useCallback, useEffect, useRef, useState } from 'react'
import { LS_KEYS } from '../lib/constants'

function safeJsonParse(value, fallback) {
  if (typeof value !== 'string') return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function toArray(value) {
  return Array.isArray(value) ? value : []
}

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function normalizePlayers(players) {
  return {
    online: toNumber(players?.online, 0),
    max: toNumber(players?.max, 0),
  }
}

function normalizeHistoryEntry(entry) {
  return {
    timestamp: toNumber(entry?.timestamp, Date.now()),
    players: normalizePlayers(entry?.players),
    online: Boolean(entry?.online),
  }
}

function getPersistedState() {
  return {
    history: toArray(safeJsonParse(localStorage.getItem(LS_KEYS.HISTORY), [])).map(
      normalizeHistoryEntry
    ),
    peak: safeJsonParse(localStorage.getItem(LS_KEYS.PEAK), null),
    incidents: toArray(safeJsonParse(localStorage.getItem(LS_KEYS.INCIDENTS), [])),
    lastVisitCount: safeJsonParse(localStorage.getItem(LS_KEYS.LAST_VISIT_COUNT), null),
    streak: safeJsonParse(localStorage.getItem(LS_KEYS.STREAK), {
      days: 0,
      hours: 0,
      lastOnlineAt: null,
    }),
    motdHistory: toArray(safeJsonParse(localStorage.getItem(LS_KEYS.MOTD_HISTORY), [])),
    versionHistory: toArray(safeJsonParse(localStorage.getItem(LS_KEYS.VERSION_HISTORY), [])),
  }
}

function persistState(state) {
  localStorage.setItem(LS_KEYS.HISTORY, JSON.stringify(state.history))
  localStorage.setItem(LS_KEYS.PEAK, JSON.stringify(state.peak))
  localStorage.setItem(LS_KEYS.INCIDENTS, JSON.stringify(state.incidents))
  localStorage.setItem(LS_KEYS.STREAK, JSON.stringify(state.streak))
  localStorage.setItem(LS_KEYS.MOTD_HISTORY, JSON.stringify(state.motdHistory))
  localStorage.setItem(LS_KEYS.VERSION_HISTORY, JSON.stringify(state.versionHistory))
}

function findLastOpenIncident(incidents) {
  for (let i = incidents.length - 1; i >= 0; i -= 1) {
    if (incidents[i] && !incidents[i].endedAt) return i
  }
  return -1
}

function toTimestamp(value) {
  if (value === null || value === undefined || value === '') return null
  const timestamp = Number(value)
  return Number.isFinite(timestamp) ? timestamp : null
}

function isSameCalendarDay(firstTimestamp, secondTimestamp) {
  const first = toTimestamp(firstTimestamp)
  const second = toTimestamp(secondTimestamp)
  if (first === null || second === null) return false

  const firstDate = new Date(first)
  const secondDate = new Date(second)
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  )
}

function getNextStreak(previousStreak, isOnline, timestamp) {
  if (!isOnline) {
    return {
      days: 0,
      hours: 0,
      lastOnlineAt: previousStreak?.lastOnlineAt ?? null,
    }
  }

  const previousDays = toNumber(previousStreak?.days, 0)
  const shouldIncrementDays =
    previousDays === 0 || !isSameCalendarDay(previousStreak?.lastOnlineAt, timestamp)

  return {
    days: previousDays + (shouldIncrementDays ? 1 : 0),
    hours: toNumber(previousStreak?.hours, 0),
    lastOnlineAt: timestamp,
  }
}

export default function useServerHistory() {
  const [initialState] = useState(() => getPersistedState())

  const [history, setHistory] = useState(() => initialState.history)
  const [peak, setPeak] = useState(() => initialState.peak)
  const [incidents, setIncidents] = useState(() => initialState.incidents)
  const [streak, setStreak] = useState(() => initialState.streak)
  const [motdHistory, setMotdHistory] = useState(() => initialState.motdHistory)
  const [versionHistory, setVersionHistory] = useState(() => initialState.versionHistory)
  const [lastVisitCount] = useState(() => initialState.lastVisitCount)
  const currentPlayersRef = useRef(history.length ? history[history.length - 1].players.online : 0)
  const currentOnlineRef = useRef(history.length ? Boolean(history[history.length - 1].online) : false)
  const stateRef = useRef({
    history: initialState.history,
    peak: initialState.peak,
    incidents: initialState.incidents,
    streak: initialState.streak,
    motdHistory: initialState.motdHistory,
    versionHistory: initialState.versionHistory,
  })

  useEffect(() => {
    if (history.length) {
      currentPlayersRef.current = history[history.length - 1].players.online
      currentOnlineRef.current = Boolean(history[history.length - 1].online)
    }
    stateRef.current = { history, peak, incidents, streak, motdHistory, versionHistory }
  }, [peak, incidents, streak, motdHistory, versionHistory, history])

  const addEntry = useCallback((statusSnapshot) => {
    const hasConfirmedOnline =
      typeof statusSnapshot?.online === 'boolean' && !statusSnapshot?.error

    if (!hasConfirmedOnline) return

    const timestamp = toNumber(statusSnapshot?.retrievedAt, Date.now())
    const entry = {
      timestamp,
      players: normalizePlayers(statusSnapshot?.players),
      online: statusSnapshot.online,
    }

    const previous = stateRef.current
    const nextHistory = [...previous.history, entry].slice(-10080)
    const previousPeak = previous.peak
    const nextPeak =
      !previousPeak || entry.players.online > toNumber(previousPeak.count, -1)
        ? { count: entry.players.online, timestamp }
        : previousPeak

    const nextIncidents = previous.incidents.map((incident) => ({ ...incident }))
    const previousOnline = currentOnlineRef.current
    const nextOnline = entry.online

    // Only proceed with incident creation if the server is offline (nextOnline === false).
    // This prevents creating new incidents if the server is online.
    if (previousOnline && !nextOnline) { // server was online, now offline: create new incident
      nextIncidents.push({ startedAt: timestamp })
    } else if (!previousOnline && nextOnline) { // server was offline, now online: close incident
      const openIndex = findLastOpenIncident(nextIncidents)
      if (openIndex !== -1) {
        const startedAt = toNumber(nextIncidents[openIndex].startedAt, timestamp)
        nextIncidents[openIndex] = {
          ...nextIncidents[openIndex],
          endedAt: timestamp,
          duration: Math.max(0, timestamp - startedAt),
        }
      }
    }

    const nextMotdHistory = [...previous.motdHistory]
    const currentMotd = typeof statusSnapshot?.motd === 'string' ? statusSnapshot.motd : ''
    const lastMotdEntry = nextMotdHistory[nextMotdHistory.length - 1]
    if (!lastMotdEntry || lastMotdEntry.motd !== currentMotd) {
      nextMotdHistory.push({ timestamp, motd: currentMotd })
    }

    const nextVersionHistory = [...previous.versionHistory]
    const currentVersion =
      typeof statusSnapshot?.version === 'string' ? statusSnapshot.version : ''
    const lastVersionEntry = nextVersionHistory[nextVersionHistory.length - 1]
    if (!lastVersionEntry || lastVersionEntry.version !== currentVersion) {
      nextVersionHistory.push({ timestamp, version: currentVersion })
    }

    const nextStreak = getNextStreak(previous.streak, entry.online, timestamp)

    currentPlayersRef.current = entry.players.online
    currentOnlineRef.current = entry.online

    stateRef.current = {
      history: nextHistory,
      peak: nextPeak,
      incidents: nextIncidents,
      streak: nextStreak,
      motdHistory: nextMotdHistory,
      versionHistory: nextVersionHistory,
    }

    setHistory(nextHistory)
    setPeak(nextPeak)
    setIncidents(nextIncidents)
    setStreak(nextStreak)
    setMotdHistory(nextMotdHistory)
    setVersionHistory(nextVersionHistory)

    persistState(stateRef.current)
  }, [])

  useEffect(() => {
    return () => {
      localStorage.setItem(
        LS_KEYS.LAST_VISIT_COUNT,
        JSON.stringify(currentPlayersRef.current)
      )
    }
  }, [])

  const lastVisitDelta =
    lastVisitCount === null || lastVisitCount === undefined
      ? null
      : (history[history.length - 1]?.players?.online ?? 0) - toNumber(lastVisitCount, 0)

  return {
    history,
    peak,
    incidents,
    streak,
    motdHistory,
    versionHistory,
    lastVisitDelta,
    addEntry,
  }
}

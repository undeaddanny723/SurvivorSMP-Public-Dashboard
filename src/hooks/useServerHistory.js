import { useEffect, useRef, useState } from 'react'
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

export default function useServerHistory() {
  const initialStateRef = useRef(null)
  if (!initialStateRef.current) {
    initialStateRef.current = getPersistedState()
  }

  const [history, setHistory] = useState(initialStateRef.current.history)
  const [peak, setPeak] = useState(initialStateRef.current.peak)
  const [incidents, setIncidents] = useState(initialStateRef.current.incidents)
  const [streak, setStreak] = useState(initialStateRef.current.streak)
  const [motdHistory, setMotdHistory] = useState(initialStateRef.current.motdHistory)
  const [versionHistory, setVersionHistory] = useState(initialStateRef.current.versionHistory)
  const [lastVisitCount] = useState(initialStateRef.current.lastVisitCount)
  const currentPlayersRef = useRef(history.length ? history[history.length - 1].players.online : 0)
  const stateRef = useRef({
    history: initialStateRef.current.history,
    peak: initialStateRef.current.peak,
    incidents: initialStateRef.current.incidents,
    streak: initialStateRef.current.streak,
    motdHistory: initialStateRef.current.motdHistory,
    versionHistory: initialStateRef.current.versionHistory,
  })

  useEffect(() => {
    if (history.length) {
      currentPlayersRef.current = history[history.length - 1].players.online
    }
    stateRef.current = { history, peak, incidents, streak, motdHistory, versionHistory }
  }, [peak, incidents, streak, motdHistory, versionHistory, history])

  const addEntry = (statusSnapshot) => {
    const timestamp = toNumber(statusSnapshot?.retrievedAt, Date.now())
    const entry = {
      timestamp,
      players: normalizePlayers(statusSnapshot?.players),
      online: Boolean(statusSnapshot?.online),
    }

    const previous = stateRef.current
    const nextHistory = [...previous.history, entry].slice(-10080)
    const previousPeak = previous.peak
    const nextPeak =
      !previousPeak || entry.players.online > toNumber(previousPeak.count, -1)
        ? { count: entry.players.online, timestamp }
        : previousPeak

    const nextIncidents = previous.incidents.map((incident) => ({ ...incident }))
    const previousOnline = currentPlayersRef.current > 0
    const nextOnline = entry.online
    if (previousOnline && !nextOnline) {
      nextIncidents.push({ startedAt: timestamp })
    } else if (!previousOnline && nextOnline) {
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

    const nextStreak = entry.online
      ? {
          days: toNumber(previous.streak?.days, 0) + 1,
          hours: toNumber(previous.streak?.hours, 0),
          lastOnlineAt: timestamp,
        }
      : { days: 0, hours: 0, lastOnlineAt: previous.streak?.lastOnlineAt ?? null }

    currentPlayersRef.current = entry.players.online

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
  }

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
      : currentPlayersRef.current - toNumber(lastVisitCount, 0)

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

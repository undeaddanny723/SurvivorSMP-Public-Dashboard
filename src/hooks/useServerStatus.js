import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IPWHOIS_URL,
  MCSCANS_URL,
  MCSRVSTAT_URL,
  MCSTATUS_URL,
  POLL_INTERVAL_MS,
  LS_KEYS,
} from '../lib/constants'

const EMPTY_STATUS = {
  online: false,
  players: { online: 0, max: 0 },
  version: '',
  motd: '',
  icon: '',
  ip: '',
  software: '',
  latency: 0,
  authMode: 0,
  mods: [],
  lastChecked: null,
  retrievedAt: 0,
}

const EMPTY_GEO = {
  country: '',
  countryCode: '',
  city: '',
  region: '',
  isp: '',
  timezone: '',
  lat: null,
  lon: null,
}

function safeJsonParse(value, fallback) {
  if (typeof value !== 'string') return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function cleanText(value) {
  if (typeof value !== 'string') return ''
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function asNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function normalizeMods(value) {
  if (Array.isArray(value)) return value
  if (value && Array.isArray(value.mods)) return value.mods
  if (value && Array.isArray(value.modinfo?.modList)) return value.modinfo.modList
  return []
}

function parseAuthMode(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return 0
  const lower = value.toLowerCase()
  if (lower.includes('whitelist')) return 2
  if (lower.includes('online')) return 1
  if (lower.includes('offline')) return 0
  return 0
}

function normalizeStatusFromMcstatus(data, fallback = EMPTY_STATUS) {
  const players = data?.players ?? {}
  const version = data?.version ?? {}
  const motd = data?.motd ?? {}
  return {
    online: Boolean(data?.online ?? fallback.online),
    players: {
      online: asNumber(players?.online, fallback.players.online),
      max: asNumber(players?.max, fallback.players.max),
    },
    version:
      typeof version === 'string'
        ? version
        : version?.name_clean ?? version?.name ?? fallback.version,
    motd: cleanText(
      motd?.clean?.join?.(' ') ??
        motd?.clean ??
        motd?.html ??
        motd?.raw ??
        fallback.motd
    ),
    icon: typeof data?.icon === 'string' ? data.icon : fallback.icon,
    ip: typeof data?.ip_address === 'string' ? data.ip_address : fallback.ip,
    software:
      typeof data?.software === 'string'
        ? data.software
        : data?.software?.name ?? fallback.software,
    latency: asNumber(data?.latency, fallback.latency),
    authMode: parseAuthMode(data?.authentication?.type ?? data?.authMode ?? 0),
    mods: normalizeMods(data?.mods ?? data?.modinfo),
    lastChecked: new Date(),
    retrievedAt: Date.now(),
  }
}

function normalizeStatusFromMcsrvstat(data, fallback = EMPTY_STATUS) {
  const players = data?.players ?? {}
  const version = data?.version ?? {}
  return {
    online: Boolean(data?.online ?? fallback.online),
    players: {
      online: asNumber(players?.online, fallback.players.online),
      max: asNumber(players?.max, fallback.players.max),
    },
    version:
      typeof version === 'string'
        ? version
        : version?.clean ?? version?.raw ?? fallback.version,
    motd: cleanText(data?.motd?.clean ?? data?.motd?.raw ?? fallback.motd),
    icon: typeof data?.icon === 'string' ? data.icon : fallback.icon,
    ip: typeof data?.ip === 'string' ? data.ip : fallback.ip,
    software: typeof data?.software === 'string' ? data.software : fallback.software,
    latency: asNumber(data?.latency ?? data?.debug?.ping, fallback.latency),
    authMode: parseAuthMode(data?.authentication?.type ?? data?.auth?.type ?? 0),
    mods: normalizeMods(data?.mods ?? data?.plugins),
    lastChecked: fallback.lastChecked ?? new Date(),
    retrievedAt: fallback.retrievedAt ?? Date.now(),
  }
}

function normalizeStatusFromMcscans(data, fallback = EMPTY_STATUS) {
  const server = Array.isArray(data?.servers) ? data.servers[0] : data?.server ?? data
  const players = server?.players ?? {}
  return {
    online: Boolean(server?.online ?? data?.online ?? fallback.online),
    players: {
      online: asNumber(players?.online ?? server?.players_online, fallback.players.online),
      max: asNumber(players?.max ?? server?.players_max, fallback.players.max),
    },
    version: server?.version ?? fallback.version,
    motd: cleanText(server?.motd ?? fallback.motd),
    icon: typeof server?.icon === 'string' ? server.icon : fallback.icon,
    ip: typeof server?.ip === 'string' ? server.ip : fallback.ip,
    software: server?.software ?? fallback.software,
    latency: asNumber(server?.latency ?? server?.ping, fallback.latency),
    authMode: parseAuthMode(server?.authMode ?? 0),
    mods: normalizeMods(server?.mods ?? server?.plugins),
    lastChecked: fallback.lastChecked ?? new Date(),
    retrievedAt: fallback.retrievedAt ?? Date.now(),
  }
}

function mergeStatus(...parts) {
  const base = { ...EMPTY_STATUS }
  for (const part of parts) {
    if (!part) continue
    if (typeof part.online === 'boolean') base.online = part.online
    if (part.players) {
      base.players = {
        online: asNumber(part.players.online, base.players.online),
        max: asNumber(part.players.max, base.players.max),
      }
    }
    if (typeof part.version === 'string' && part.version) base.version = part.version
    if (typeof part.motd === 'string' && part.motd) base.motd = cleanText(part.motd)
    if (typeof part.icon === 'string' && part.icon) base.icon = part.icon
    if (typeof part.ip === 'string' && part.ip) base.ip = part.ip
    if (typeof part.software === 'string' && part.software) base.software = part.software
    if (Number.isFinite(part.latency) && part.latency >= 0) base.latency = part.latency
    if (Number.isFinite(part.authMode)) base.authMode = part.authMode
    if (Array.isArray(part.mods)) base.mods = part.mods
    if (part.lastChecked instanceof Date) base.lastChecked = part.lastChecked
    if (Number.isFinite(part.retrievedAt)) base.retrievedAt = part.retrievedAt
  }
  return base
}

function normalizeGeo(data) {
  if (!data || typeof data !== 'object') return { ...EMPTY_GEO }
  return {
    country: data.country ?? data.country_name ?? '',
    countryCode: data.country_code ?? data.countryCode ?? '',
    city: data.city ?? '',
    region: data.region ?? data.regionName ?? data.region_name ?? '',
    isp: data.isp ?? data.org ?? '',
    timezone: data.timezone ?? '',
    lat: Number.isFinite(Number(data.lat)) ? Number(data.lat) : null,
    lon: Number.isFinite(Number(data.lon)) ? Number(data.lon) : null,
  }
}

function readStoredGeo() {
  return normalizeGeo(safeJsonParse(localStorage.getItem(LS_KEYS.GEO), null))
}

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json()
}

export default function useServerStatus() {
  const [status, setStatus] = useState(EMPTY_STATUS)
  const [geo, setGeo] = useState(EMPTY_GEO)
  const [countdown, setCountdown] = useState(Math.ceil(POLL_INTERVAL_MS / 1000))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const lastOnlineRef = useRef(null)
  const pollStartedAtRef = useRef(Date.now())
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const abortRef = useRef(null)
  const mountedRef = useRef(true)
  const geoResolvedRef = useRef(false)

  const statusResult = useMemo(() => ({ status, geo, countdown, loading, error }), [
    status,
    geo,
    countdown,
    loading,
    error,
  ])

  useEffect(() => {
    mountedRef.current = true
    const controller = new AbortController()
    abortRef.current = controller

    const runPoll = async () => {
      const startedAt = Date.now()
      pollStartedAtRef.current = startedAt
      if (mountedRef.current) setLoading(true)

      try {
        const mcstatusPromise = fetchJson(MCSTATUS_URL, controller.signal)
        const mcsrvstatPromise = fetchJson(MCSRVSTAT_URL, controller.signal)
        const mcscansPromise = fetchJson(MCSCANS_URL, controller.signal)

        const [mcstatusRes, mcsrvstatRes, mcscansRes] = await Promise.allSettled([
          mcstatusPromise,
          mcsrvstatPromise,
          mcscansPromise,
        ])

        const mcstatusData =
          mcstatusRes.status === 'fulfilled' ? mcstatusRes.value : null
        const mcstatusStatus = normalizeStatusFromMcstatus(mcstatusData, status)

        const mcsrvstatStatus =
          mcsrvstatRes.status === 'fulfilled'
            ? normalizeStatusFromMcsrvstat(mcsrvstatRes.value, mcstatusStatus)
            : null
        const mcscansStatus =
          mcscansRes.status === 'fulfilled'
            ? normalizeStatusFromMcscans(mcscansRes.value, mcstatusStatus)
            : null

        const merged = mergeStatus(mcstatusStatus, mcsrvstatStatus, mcscansStatus)
        const nextOnline = Boolean(merged.online)
        const previousOnline = lastOnlineRef.current

        setStatus(merged)
        setError(null)
        setLoading(false)

        if (previousOnline !== null && previousOnline !== nextOnline) {
          window.dispatchEvent(
            new CustomEvent('serverStatusChange', {
              detail: { online: nextOnline, timestamp: Date.now() },
            })
          )
        }
        lastOnlineRef.current = nextOnline

        if (!geoResolvedRef.current) {
          geoResolvedRef.current = true
          const storedGeo = readStoredGeo()
          if (localStorage.getItem(LS_KEYS.GEO)) {
            if (mountedRef.current) setGeo(storedGeo)
          } else if (mcstatusData?.ip_address) {
            try {
              const geoData = await fetchJson(IPWHOIS_URL(mcstatusData.ip), controller.signal)
              const normalizedGeo = normalizeGeo(geoData)
              localStorage.setItem(LS_KEYS.GEO, JSON.stringify(normalizedGeo))
              if (mountedRef.current) setGeo(normalizedGeo)
            } catch {
              if (mountedRef.current) setGeo(storedGeo)
            }
          } else if (mountedRef.current) {
            setGeo(storedGeo)
          }
        }

        if (mcstatusRes.status === 'rejected' && mcsrvstatRes.status === 'rejected' && mcscansRes.status === 'rejected') {
          throw mcstatusRes.reason ?? mcsrvstatRes.reason ?? mcscansRes.reason
        }
      } catch (err) {
        if (!controller.signal.aborted && mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load server status')
          setLoading(false)
        }
      } finally {
        if (mountedRef.current) {
          const elapsed = Date.now() - startedAt
          setCountdown(Math.max(0, Math.ceil((POLL_INTERVAL_MS - elapsed) / 1000)))
        }
      }
    }

    const scheduleCountdown = () => {
      timeoutRef.current = window.setTimeout(() => {
        const elapsed = Date.now() - pollStartedAtRef.current
        setCountdown(Math.max(0, Math.ceil((POLL_INTERVAL_MS - elapsed) / 1000)))
        scheduleCountdown()
      }, 1000)
    }

    runPoll()
    intervalRef.current = window.setInterval(runPoll, POLL_INTERVAL_MS)
    scheduleCountdown()

    return () => {
      mountedRef.current = false
      controller.abort()
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  return statusResult
}

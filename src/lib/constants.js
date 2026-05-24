export const SERVER_ADDRESS = 'survivorsmp.net'
export const MCSTATUS_URL = `https://api.mcstatus.io/v2/status/java/${SERVER_ADDRESS}`
export const MCSRVSTAT_URL = `https://api.mcsrvstat.us/3/${SERVER_ADDRESS}`
export const MCSCANS_URL = `https://api.mcscans.fi/public/v1/servers?query=${SERVER_ADDRESS}`
export const IPWHOIS_URL = (ip) => `https://ipwhois.io/json/${ip}`
export const POLL_INTERVAL_MS = 120000
export const LS_KEYS = {
  HISTORY: 'smp_history',
  PEAK: 'smp_peak',
  INCIDENTS: 'smp_incidents',
  THEME: 'smp_theme',
  GEO: 'smp_geo',
  LAST_VISIT_COUNT: 'smp_last_visit_count',
  MOTD_HISTORY: 'smp_motd_history',
  VERSION_HISTORY: 'smp_version_history',
  STREAK: 'smp_streak',
}
export const REFRESH_OPTIONS = [60000, 120000, 300000]
export const CAPACITY_WARN = 0.8
export const CAPACITY_DANGER = 0.9

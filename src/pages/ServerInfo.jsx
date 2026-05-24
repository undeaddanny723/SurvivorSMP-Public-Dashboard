import ServerInfoCard from '../components/ServerInfoCard.jsx'
import LocationCard from '../components/LocationCard.jsx'
import PluginList from '../components/PluginList.jsx'
import VersionHistory from '../components/VersionHistory.jsx'
import useServerHistory from '../hooks/useServerHistory.js'

function formatAuthMode(value) {
  const mode = Number(value)

  if (mode === 2) return 'Whitelist'
  if (mode === 1) return 'Online'
  return 'Offline'
}

function formatMods(mods) {
  if (!Array.isArray(mods)) return []

  return mods
    .map((mod) => {
      if (typeof mod === 'string') return mod
      if (!mod || typeof mod !== 'object') return ''

      return (
        mod.name ??
        mod.title ??
        mod.modid ??
        mod.id ??
        mod.slug ??
        ''
      )
    })
    .filter(Boolean)
}

function getDisplayGeo(status = {}, geo = {}) {
  const ip = geo.ip || status.ip || ''
  const hasLocation = [geo.country, geo.city, geo.region, geo.isp].some(
    (part) => typeof part === 'string' && part.trim() && part.trim() !== 'Unknown'
  )

  if (hasLocation || !ip.startsWith('68.169.100.133')) return { ...geo, ip }

  return {
    ip,
    country: 'The Netherlands',
    countryCode: 'NL',
    city: 'Amsterdam',
    region: 'North Holland',
    isp: 'Pufferfish Studios LLC',
    timezone: 'Europe/Amsterdam',
    lat: 52.3907,
    lon: 4.8637,
  }
}

export default function ServerInfo({ status = {}, geo = {} }) {
  const plugins = formatMods(status.mods)
  const displayGeo = getDisplayGeo(status, geo)
  const { versionHistory } = useServerHistory()

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ServerInfoCard
          ip={status.ip || geo.ip || 'Unknown'}
          version={status.version || 'Unknown'}
          software={status.software || 'Unknown'}
          motd={status.motd || 'No MOTD'}
          icon={status.icon}
          authMode={formatAuthMode(status.authMode)}
          latency={status.latency != null ? `${status.latency} ms` : 'Unknown'}
          mods={plugins.length ? plugins.join(', ') : 'None'}
        />

        <LocationCard
          ip={displayGeo.ip || 'Unknown'}
          country={displayGeo.country || 'Unknown'}
          countryCode={displayGeo.countryCode || ''}
          city={displayGeo.city || 'Unknown'}
          region={displayGeo.region || 'Unknown'}
          isp={displayGeo.isp || 'Unknown'}
          timezone={displayGeo.timezone || 'Unknown'}
          lat={displayGeo.lat ?? 'Unknown'}
          lon={displayGeo.lon ?? 'Unknown'}
        />
      </section>

      <section className="rounded-xl border border-slate-200/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Plugins
        </div>
        <PluginList plugins={plugins} />
      </section>

      <section className="rounded-xl bg-slate-50 p-5 shadow-sm dark:bg-slate-800 dark:shadow-none">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Version History
        </div>
        <VersionHistory versionHistory={versionHistory} />
      </section>
    </div>
  )
}

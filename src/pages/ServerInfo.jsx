import ServerInfoCard from '../components/ServerInfoCard.jsx'
import LocationCard from '../components/LocationCard.jsx'
import PluginList from '../components/PluginList.jsx'

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

export default function ServerInfo({ status = {}, geo = {} }) {
  const plugins = formatMods(status.mods)

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ServerInfoCard
          version={status.version || 'Unknown'}
          software={status.software || 'Unknown'}
          motd={status.motd || 'No MOTD'}
          icon={status.icon}
          authMode={formatAuthMode(status.authMode)}
          latency={status.latency != null ? `${status.latency} ms` : 'Unknown'}
          mods={plugins.length ? plugins.join(', ') : 'None'}
        />

        <LocationCard
          country={geo.country || 'Unknown'}
          countryCode={geo.countryCode || ''}
          city={geo.city || 'Unknown'}
          region={geo.region || 'Unknown'}
          isp={geo.isp || 'Unknown'}
          timezone={geo.timezone || 'Unknown'}
          lat={geo.lat ?? 'Unknown'}
          lon={geo.lon ?? 'Unknown'}
        />
      </section>

      <section className="rounded-xl border border-slate-200/10 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20 backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Plugins
        </div>
        <PluginList plugins={plugins} />
      </section>
    </div>
  )
}

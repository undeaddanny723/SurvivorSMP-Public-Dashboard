export default function PluginList({ plugins }) {
  const safePlugins = Array.isArray(plugins) ? plugins : [];

  if (safePlugins.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white/50 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/30 dark:text-slate-400">
        No public plugin data reported.
      </div>
    )
  }

  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
      {safePlugins.map((plugin, index) => (
        <li
          key={index}
          className="max-w-full break-words rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold tracking-wide text-slate-800 transition-colors dark:bg-slate-700 dark:text-slate-200"
        >
          {plugin}
        </li>
      ))}
    </ul>
  );
}

export default function PlayerCountCard({ online, max, previousCount }) {
  const delta = online - previousCount

  return (
    <div className="rounded-xl bg-slate-50 p-6 shadow-sm dark:bg-slate-800 dark:shadow-none">
      <div className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
        {online}
      </div>
      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        / {max} max players
      </div>
      <div className="mt-3 flex items-center gap-1">
        {delta > 0 && (
          <span className="inline-flex items-center gap-0.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            + {delta}
          </span>
        )}
        {delta < 0 && (
          <span className="inline-flex items-center gap-0.5 text-sm font-medium text-red-500">
            - {Math.abs(delta)}
          </span>
        )}
        {delta === 0 && (
          <span className="inline-flex items-center gap-0.5 text-sm font-medium text-slate-400 dark:text-slate-500">
            0
          </span>
        )}
      </div>
    </div>
  )
}

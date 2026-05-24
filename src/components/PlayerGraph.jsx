export default function PlayerGraph({ history, showYesterday, showProjection, showRollingAvg }) {
  return (
    <div className="w-full rounded-xl p-5 bg-slate-50 dark:bg-slate-800 shadow-sm dark:shadow-none flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Player Activity
        </h3>
        <div className="flex gap-1.5">
          <button
            type="button"
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              showYesterday
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300/85 dark:hover:bg-slate-600/85'
            }`}
          >
            Yesterday
          </button>
          <button
            type="button"
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              showProjection
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300/85 dark:hover:bg-slate-600/85'
            }`}
          >
            Projection
          </button>
          <button
            type="button"
            className={`px-2.5 py-1 text-xs rounded transition-colors ${
              showRollingAvg
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300/85 dark:hover:bg-slate-600/85'
            }`}
          >
            7d Avg
          </button>
        </div>
      </div>
      {/* Decorative player activity graph representation */}
      <div className="h-44 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700/60 rounded-lg bg-white/40 dark:bg-slate-900/30">
        <span className="text-xs text-slate-400 dark:text-slate-500">Player activity graph representation</span>
      </div>
    </div>
  );
}

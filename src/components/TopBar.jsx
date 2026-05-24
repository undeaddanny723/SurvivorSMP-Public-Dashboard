export default function TopBar({ theme, onThemeToggle, serverName, isOnline }) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {serverName}
        </h1>
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            isOnline
              ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
              : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
          }`}
        />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <button
        type="button"
        onClick={onThemeToggle}
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
    </header>
  )
}

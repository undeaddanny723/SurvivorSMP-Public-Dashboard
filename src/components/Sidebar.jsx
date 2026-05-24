export default function Sidebar({ activePage, onNavigate }) {
  const navItems = [
    { key: 'Overview', label: 'Overview' },
    { key: 'Players', label: 'Players' },
    { key: 'Analytics', label: 'Analytics' },
    { key: 'ServerInfo', label: 'Server Info' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 flex-row border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 md:top-0 md:h-screen md:w-56 md:flex-col md:border-r md:border-t-0">
      <div className="hidden border-b border-slate-200 px-5 py-6 dark:border-slate-700 md:block">
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
          SurvivorSMP
        </span>
      </div>

      <div className="grid flex-1 grid-cols-4 gap-1 p-2 md:flex md:flex-col md:p-3">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full rounded-lg px-2 py-2 text-center text-xs font-medium transition-colors md:px-4 md:py-2.5 md:text-left md:text-sm
              ${activePage === item.key
                ? 'text-blue-600 bg-blue-50 dark:text-emerald-500 dark:bg-emerald-500/10'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function Sidebar({ activePage, onNavigate }) {
  const navItems = ['Overview', 'Players', 'Analytics', 'ServerInfo'];

  return (
    <nav className="fixed left-0 top-0 h-screen w-56 flex flex-col bg-white border-r border-slate-200 dark:bg-slate-950 dark:border-slate-700">
      <div className="px-5 py-6 border-b border-slate-200 dark:border-slate-700">
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
          SurvivorSMP
        </span>
      </div>

      <div className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${activePage === item
                ? 'text-blue-600 bg-blue-50 dark:text-emerald-500 dark:bg-emerald-500/10'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}

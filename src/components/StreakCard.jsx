export default function StreakCard({ days, hours }) {
  return (
    <div className="rounded-2xl p-6 bg-slate-50 shadow-md dark:bg-slate-800 dark:shadow-none border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-4 w-full">
      {/* Fire icon placeholder space left of number */}
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
        <svg className="w-7 h-7 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1014 0c0-1.307-.349-2.504-.949-3.528a1 1 0 00-1.66.19c-.31.667-.709 1.4-1.138 2.116-.428.714-.874 1.408-1.25 2.013a1 1 0 01-1.707-.838c.09-.44.2-.9.324-1.379.13-.507.286-1.05.449-1.6.326-1.1.626-2.284.626-3.418 0-.904-.22-1.787-.608-2.58z" clipRule="evenodd" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Streak
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          {/* Big number for days */}
          <span className="text-4xl font-extrabold text-blue-600 dark:text-emerald-500 tracking-tight">
            {days}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2.5">
            d
          </span>
          
          {/* Smaller for hours */}
          <span className="text-2xl font-bold text-blue-600/80 dark:text-emerald-500/80 tracking-tight">
            {hours}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            h
          </span>
        </div>
      </div>
    </div>
  );
}

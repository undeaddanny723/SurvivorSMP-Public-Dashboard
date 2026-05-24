export default function SessionTimeline({ history = [], sessions }) {
  // Use history if present, otherwise sessions (if it contains poll-like data), or fallback to mock data
  const points = (history && history.length > 0)
    ? history.slice(-20) // Display last 20 polls for clean horizontal density
    : (sessions && Array.isArray(sessions) && sessions.length > 0 && ('online' in sessions[0] || 'status' in sessions[0]))
      ? sessions.slice(-20)
      : Array.from({ length: 15 }, (_, i) => {
          const now = Date.now();
          const timestamp = now - (14 - i) * 15 * 60 * 1000;
          return {
            timestamp,
            online: i !== 4 && i !== 9, // Mock a few outages
          };
        });

  return (
    <div className="rounded-xl p-5 bg-slate-50 dark:bg-slate-800 shadow-sm dark:shadow-none flex flex-col w-full">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        Active Sessions Timeline
      </h3>

      {/* Horizontal scroll container */}
      <div className="overflow-x-auto pb-10 pt-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        <div className="relative flex items-center justify-between px-6 min-w-[max-content] h-20">
          {/* Horizontal line connecting dots */}
          <div className="absolute left-10 right-10 h-[2px] bg-slate-600 top-[17px] z-0" />

          {points.map((pt, idx) => {
            const date = new Date(pt.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            const isOnline = pt.online;

            return (
              <div key={idx} className="flex flex-col items-center w-16 relative z-10 select-none group">
                {/* Dot */}
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow-xs transition-all duration-300 ${
                    isOnline ? 'bg-emerald-500 hover:scale-125' : 'bg-red-500 hover:scale-125'
                  }`}
                  title={isOnline ? 'Online' : 'Offline'}
                />

                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] px-1.5 py-0.5 rounded shadow-sm z-30 whitespace-nowrap">
                  {isOnline ? 'Online' : 'Offline'}
                </div>

                {/* Timestamp rotated -45deg */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 -rotate-45 whitespace-nowrap text-[10px] font-medium text-slate-500 dark:text-slate-400">
                  {timeStr}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

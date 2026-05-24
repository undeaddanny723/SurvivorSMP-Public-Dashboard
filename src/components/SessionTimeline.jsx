export default function SessionTimeline({ sessions }) {
  const displaySessions = sessions && sessions.length > 0 ? sessions : [
    { id: 1, player: 'UndeadDanny', start: '14:20', duration: '2h 15m', avatar: 'https://minotar.net/avatar/UndeadDanny/32' },
    { id: 2, player: 'ProAtGaming', start: '15:10', duration: '1h 05m', avatar: 'https://minotar.net/avatar/ProAtGaming/32' },
    { id: 3, player: 'Steve', start: '16:00', duration: '45m', avatar: 'https://minotar.net/avatar/Steve/32' },
    { id: 4, player: 'Alex', start: '16:30', duration: '12m', avatar: 'https://minotar.net/avatar/Alex/32' },
    { id: 5, player: 'Notch', start: '17:00', duration: '2h 40m', avatar: 'https://minotar.net/avatar/Notch/32' }
  ];

  return (
    <div className="rounded-xl p-5 bg-slate-50 dark:bg-slate-800 shadow-sm dark:shadow-none flex flex-col w-full">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        Active Sessions
      </h3>
      
      {/* Horizontal scroll container overflow-x-auto */}
      <div className="overflow-x-auto pb-2 flex gap-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {displaySessions.map((session, index) => (
          <div
            key={session.id || index}
            className="flex-shrink-0 flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-xs min-w-[180px]"
          >
            {session.avatar && (
              <img
                src={session.avatar}
                alt={session.player}
                className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                {session.player}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Started {session.start} • {session.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

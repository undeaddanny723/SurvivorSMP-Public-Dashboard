export default function IncidentLog({ incidents }) {
  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (ms) => {
    if (ms === undefined || ms === null) return 'Ongoing';
    const sec = Math.floor(ms / 1000);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    const remMin = min % 60;
    return `${hr}h${remMin > 0 ? ` ${remMin}m` : ''}`;
  };

  return (
    <ul className="space-y-4 p-0 pl-1.5 m-0 list-none">
      {incidents?.map((incident, index) => {
        const isObj = incident && typeof incident === 'object';
        const timestampText = isObj ? formatTime(incident.startedAt) : String(incident);
        const durationText = isObj ? formatDuration(incident.duration) : '';

        return (
          <li
            key={index}
            className="relative pl-6 py-2.5 border-l-2 border-red-500 bg-red-500/5 dark:bg-red-500/10 rounded-r-lg flex justify-between items-center"
          >
            {/* Left red dot indicator */}
            <span className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-800" />
            
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {timestampText}
            </span>
            
            {durationText && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {durationText}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

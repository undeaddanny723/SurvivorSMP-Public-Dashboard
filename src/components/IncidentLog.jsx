export default function IncidentLog({ incidents }) {
  const safeIncidents = Array.isArray(incidents) ? incidents : [];

  const formatTime = (ts) => {
    if (ts === undefined || ts === null) return 'Time unavailable';
    const date = new Date(ts);
    if (Number.isNaN(date.getTime())) return 'Time unavailable';

    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDuration = (ms) => {
    if (ms === undefined || ms === null) return 'Ongoing';

    const duration = Number(ms);
    if (!Number.isFinite(duration)) return 'Unknown';
    if (duration < 1000) return '< 1s';

    const sec = Math.floor(duration / 1000);
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    const remMin = min % 60;
    return `${hr}h${remMin > 0 ? ` ${remMin}m` : ''}`;
  };

  return (
    <div className="rounded-xl bg-slate-50 p-5 shadow-sm dark:bg-slate-800 dark:shadow-none">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Incident Log
      </h3>
      {safeIncidents.length > 0 ? (
    <ul className="m-0 list-none space-y-4 p-0 pl-1.5">
      {safeIncidents.map((incident, index) => {
        const isObj = incident && typeof incident === 'object';
        const timestampText = isObj ? formatTime(incident.startedAt) : String(incident);
        const durationText = isObj ? formatDuration(incident.duration) : '';

        return (
          <li
            key={index}
            className="relative flex items-start justify-between gap-3 rounded-r-lg border-l-2 border-red-500 bg-red-500/5 py-2.5 pl-6 pr-3 dark:bg-red-500/10"
          >
            <span className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-800" />

            <span className="min-w-0">
              <span className="inline-flex rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 dark:bg-red-500/20 dark:text-red-200">
                Server Offline
              </span>
              <span className="mt-1 block truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                {timestampText}
              </span>
            </span>
            
            {durationText && (
              <span className="shrink-0 pt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {durationText}
              </span>
            )}
          </li>
        );
      })}
    </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white/50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/30 dark:text-slate-400">
          No incidents recorded.
        </div>
      )}
    </div>
  );
}

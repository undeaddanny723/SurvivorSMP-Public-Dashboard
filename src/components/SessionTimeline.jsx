const MAX_TIMELINE_POINTS = 24;

function toFiniteNumber(value, fallback = 0) {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : fallback;
}

function getTimestamp(point) {
  const timestamp = Number(point?.timestamp ?? point?.startedAt ?? point?.time);
  if (Number.isFinite(timestamp)) return timestamp;

  const parsed = Date.parse(point?.timestamp ?? point?.startedAt ?? point?.time ?? '');
  return Number.isFinite(parsed) ? parsed : null;
}

function getPlayerCount(point) {
  const value =
    point?.players?.online ??
    point?.onlinePlayers ??
    point?.playersOnline ??
    point?.playerCount ??
    point?.count;
  const hasValue = value !== undefined && value !== null && Number.isFinite(Number(value));

  return {
    count: Math.max(0, toFiniteNumber(value, 0)),
    hasValue,
  };
}

function getOnlineState(point, playerCount) {
  if (typeof point?.online === 'boolean') return point.online;

  if (typeof point?.status === 'string') {
    const status = point.status.toLowerCase();
    if (status.includes('offline')) return false;
    if (status.includes('online')) return true;
  }

  return playerCount > 0;
}

function formatTime(timestamp, index) {
  if (timestamp === null) return `#${index + 1}`;

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return `#${index + 1}`;

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function SessionTimeline({ history = [], sessions }) {
  const safeHistory = Array.isArray(history) ? history : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const sessionHistory = safeSessions.filter(
    (session) =>
      session &&
      typeof session === 'object' &&
      ('online' in session || 'status' in session || 'timestamp' in session || 'players' in session)
  );
  const rawPoints = safeHistory.length > 0 ? safeHistory : sessionHistory;
  const points = rawPoints.slice(-MAX_TIMELINE_POINTS).map((point, index) => {
    const timestamp = getTimestamp(point);
    const playerValue = getPlayerCount(point);
    const online = getOnlineState(point, playerValue.count);

    return {
      timestamp,
      timeLabel: formatTime(timestamp, index),
      players: online ? playerValue.count : 0,
      hasPlayerValue: playerValue.hasValue,
      online,
    };
  });
  const peakPlayers = points.length > 0 ? Math.max(...points.map((point) => point.players)) : 0;

  return (
    <div className="rounded-xl p-5 bg-slate-50 dark:bg-slate-800 shadow-sm dark:shadow-none flex flex-col w-full">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        Active Sessions Timeline
      </h3>

      {points.length > 0 ? (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Last {points.length} checks</span>
            <span>Peak {Math.round(peakPlayers)} players</span>
          </div>

          <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            <div className="flex min-w-[max-content] items-end gap-2 rounded-lg border border-slate-200 bg-white/50 px-3 py-3 dark:border-slate-700/70 dark:bg-slate-900/30">
              {points.map((point, idx) => {
                const heightPct = peakPlayers > 0 ? (point.players / peakPlayers) * 100 : 0;
                const valueLabel = point.hasPlayerValue
                  ? Math.round(point.players)
                  : point.online
                    ? 'On'
                    : 'Off';
                const statusLabel = point.online ? 'Online' : 'Offline';
                const playerLabel = point.hasPlayerValue
                  ? `${Math.round(point.players)} players`
                  : 'Player count unavailable';

                return (
                  <div key={`${point.timestamp ?? 'session'}-${idx}`} className="group flex w-10 select-none flex-col items-center gap-1.5">
                    <span className="h-4 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                      {valueLabel}
                    </span>
                    <div className="relative flex h-24 w-full items-end overflow-hidden rounded-md bg-slate-200/70 dark:bg-slate-950/70">
                      <div
                        className={`w-full rounded-md transition-all duration-300 ${
                          point.online
                            ? 'bg-blue-500 dark:bg-emerald-400'
                            : 'bg-red-400 dark:bg-red-500/80'
                        }`}
                        style={{
                          height: `${heightPct}%`,
                          minHeight: point.online ? '8px' : '4px',
                        }}
                        title={`${statusLabel} - ${playerLabel}`}
                      />
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-sm group-hover:block dark:bg-white dark:text-slate-900">
                        {point.timeLabel}: {statusLabel} - {playerLabel}
                        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-white" />
                      </div>
                    </div>
                    <span className="w-full truncate text-center text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {point.timeLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-500 dark:bg-emerald-400" />
              Online density
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-400 dark:bg-red-500/80" />
              Offline check
            </span>
          </div>
        </>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white/50 px-4 text-center text-sm text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/30 dark:text-slate-400">
          Session timeline will appear after the first successful status check.
        </div>
      )}
    </div>
  );
}

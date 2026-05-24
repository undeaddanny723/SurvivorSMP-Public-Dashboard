function parseDateKey(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeAverage(value) {
  if (value === null || value === undefined) return null;
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? Math.max(0, nextValue) : null;
}

export default function HeatmapCalendar({ data = [] }) {
  const sortedData = (Array.isArray(data) ? data : [])
    .map((item) => {
      if (!item?.date) return null;
      const date = parseDateKey(String(item.date));
      if (!date) return null;

      return {
        ...item,
        date: formatDateKey(date),
        avg: normalizeAverage(item.avg),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));

  const numericValues = sortedData.map((d) => d.avg).filter(Number.isFinite);
  const maxVal = numericValues.length > 0 ? Math.max(...numericValues) : 0;

  const getColorClass = (val) => {
    if (!Number.isFinite(val) || val === 0) return 'bg-slate-100 dark:bg-slate-700';
    if (!Number.isFinite(maxVal) || maxVal === 0) return 'bg-slate-100 dark:bg-slate-700';
    const ratio = val / maxVal;
    if (ratio <= 0.33) {
      return 'bg-blue-100 dark:bg-emerald-900';
    } else if (ratio <= 0.66) {
      return 'bg-blue-400 dark:bg-emerald-500';
    } else {
      return 'bg-blue-600 dark:bg-emerald-300';
    }
  };

  const firstDate = sortedData.length
    ? new Date(sortedData[0].date + 'T00:00:00')
    : new Date()
  const startDayOfWeek = firstDate.getDay();
  const paddedData = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    paddedData.push({ date: null, avg: null, isPadding: true });
  }
  sortedData.forEach((item) => {
    paddedData.push({ ...item, isPadding: false });
  });

  const weeks = [];
  for (let i = 0; i < paddedData.length; i += 7) {
    weeks.push(paddedData.slice(i, i + 7));
  }

  return (
    <div className="rounded-xl p-5 bg-slate-50 dark:bg-slate-800 shadow-sm dark:shadow-none flex flex-col w-full">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        Activity Heatmap
      </h3>

      <div className="flex flex-col mb-4 overflow-x-auto pb-2 scrollbar-thin">
        {sortedData.length > 0 ? (
          <>
            <div className="flex gap-1 mb-1 text-[10px] text-slate-400 dark:text-slate-500 h-4 pl-[32px]">
              {weeks.map((week, weekIdx) => {
            const firstValidDay = week.find((d) => !d.isPadding && d.date);
            if (firstValidDay) {
              const d = new Date(firstValidDay.date + 'T00:00:00');
              const monthName = d.toLocaleDateString([], { month: 'short' });

              const prevWeek = weeks[weekIdx - 1];
              const prevValidDay = prevWeek ? prevWeek.find((d) => !d.isPadding && d.date) : null;
              const prevMonthName = prevValidDay
                ? new Date(prevValidDay.date + 'T00:00:00').toLocaleDateString([], { month: 'short' })
                : null;

              if (monthName !== prevMonthName) {
                return (
                  <div key={weekIdx} className="w-6 text-center truncate text-[9px] font-semibold" style={{ minWidth: '24px' }}>
                    {monthName}
                  </div>
                );
              }
            }
            return <div key={weekIdx} className="w-6" style={{ minWidth: '24px' }} />;
              })}
            </div>

            <div className="flex gap-1">
              <div className="flex flex-col gap-1 text-[8px] font-semibold text-slate-400 dark:text-slate-500 pr-1.5 justify-between h-[174px] py-1 w-6">
                <span>Sun</span>
                <span>Tue</span>
                <span>Thu</span>
                <span>Sat</span>
              </div>

              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => {
                  if (day.avg === null || day.avg === undefined) {
                    const emptyLabel = day.date
                      ? `${day.date}: No activity data`
                      : 'No activity data';

                    return (
                      <div
                        key={dayIdx}
                        className="group relative flex h-6 w-6 cursor-help items-center justify-center rounded-xs border border-dashed border-slate-200 bg-white/70 text-[7px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-500"
                        style={{ minWidth: '24px', minHeight: '24px' }}
                        title={emptyLabel}
                      >
                        <span aria-hidden="true">N/A</span>
                        <span className="sr-only">{emptyLabel}</span>
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-md group-hover:block dark:bg-white dark:text-slate-900 whitespace-nowrap">
                          {emptyLabel}
                          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-white" />
                        </div>
                      </div>
                    );
                  }

                  const intensityClass = getColorClass(day.avg);

                  return (
                    <div
                      key={dayIdx}
                      className={`w-6 h-6 rounded-xs transition-all duration-300 cursor-pointer relative group ${intensityClass}`}
                      style={{ minWidth: '24px', minHeight: '24px' }}
                    >
                      {/* Custom Tooltip */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] py-1 px-2 rounded shadow-md whitespace-nowrap">
                        {day.date}: {day.avg.toFixed(1)} avg
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-white" />
                      </div>
                    </div>
                  );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white/50 px-4 text-center text-sm text-slate-500 dark:border-slate-700/70 dark:bg-slate-900/30 dark:text-slate-400">
            Activity will appear after the first successful status checks.
          </div>
        )}
      </div>

      {/* Legend row */}
      <div className="mt-auto flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-xs bg-slate-100 dark:bg-slate-700" />
        <div className="w-3.5 h-3.5 rounded-xs bg-blue-100 dark:bg-emerald-900" />
        <div className="w-3.5 h-3.5 rounded-xs bg-blue-400 dark:bg-emerald-500" />
        <div className="w-3.5 h-3.5 rounded-xs bg-blue-600 dark:bg-emerald-300" />
        <span>More</span>
      </div>
    </div>
  );
}

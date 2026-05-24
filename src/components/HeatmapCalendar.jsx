import useDerivedStats from '../hooks/useDerivedStats';

export default function HeatmapCalendar({ data = [] }) {
  const derived = useDerivedStats({ history: data });
  const heatmapData = derived?.heatmapData || [];

  // Sort chronologically
  let sortedData = [...heatmapData].sort((a, b) => a.date.localeCompare(b.date));

  // Fallback to mock data if empty
  if (sortedData.length === 0) {
    const today = new Date();
    sortedData = Array.from({ length: 28 }, (_, idx) => {
      const d = new Date(today.getTime() - (27 - idx) * 24 * 60 * 60 * 1000);
      return {
        date: d.toISOString().slice(0, 10),
        avg: (idx * 3 + 7) % 15, // Mock values
      };
    });
  }

  const maxVal = sortedData.length > 0 ? Math.max(...sortedData.map((d) => d.avg)) : 0;

  const getColorClass = (val) => {
    if (val === 0) return 'bg-slate-100 dark:bg-slate-700';
    if (maxVal === 0) return 'bg-slate-100 dark:bg-slate-700';
    const ratio = val / maxVal;
    if (ratio <= 0.33) {
      return 'bg-blue-100 dark:bg-emerald-900';
    } else if (ratio <= 0.66) {
      return 'bg-blue-400 dark:bg-emerald-500';
    } else {
      return 'bg-blue-600 dark:bg-emerald-300';
    }
  };

  // Group into weeks, padding Sunday of the starting week
  const firstDate = new Date(sortedData[0].date + 'T00:00:00');
  const startDayOfWeek = firstDate.getDay(); // 0 = Sunday, ..., 6 = Saturday
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
        {/* Month labels row */}
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

        {/* Heatmap grid */}
        <div className="flex gap-1">
          {/* Day of week labels */}
          <div className="flex flex-col gap-1 text-[8px] font-semibold text-slate-400 dark:text-slate-500 pr-1.5 justify-between h-[174px] py-1 w-6">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          {/* Columns */}
          <div className="flex gap-1">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) => {
                  if (day.isPadding || day.avg === null) {
                    return (
                      <div
                        key={dayIdx}
                        className="w-6 h-6 rounded-xs bg-transparent"
                        style={{ minWidth: '24px', minHeight: '24px' }}
                      />
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
      </div>

      {/* Legend row */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-auto">
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

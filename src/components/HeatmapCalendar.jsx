export default function HeatmapCalendar({ data }) {
  // Generate 28 blocks to represent daily activity intensities
  const blocks = Array.from({ length: 28 }, (_, i) => (i * 3 + 7) % 5);

  const getColorClass = (intensity) => {
    switch (intensity) {
      case 0: return 'bg-slate-200 dark:bg-slate-700';
      case 1: return 'bg-emerald-200 dark:bg-emerald-950/40';
      case 2: return 'bg-emerald-350 dark:bg-emerald-800/60 bg-emerald-300';
      case 3: return 'bg-emerald-500 dark:bg-emerald-600';
      case 4: return 'bg-emerald-650 dark:bg-emerald-550 bg-emerald-600';
      default: return 'bg-slate-200 dark:bg-slate-700';
    }
  };

  return (
    <div className="rounded-xl p-5 bg-slate-50 dark:bg-slate-800 shadow-sm dark:shadow-none flex flex-col w-full">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        Activity Heatmap
      </h3>
      
      {/* Grid area: flex-wrap gap-1 placeholder */}
      <div className="flex flex-wrap gap-1 mb-4">
        {blocks.map((val, idx) => (
          <div
            key={idx}
            className={`w-6 h-6 rounded-xs transition-colors duration-300 ${getColorClass(val)}`}
            title={`Intensity: ${val}`}
          />
        ))}
      </div>

      {/* Legend row at bottom: low to high color scale */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-auto">
        <span>Less</span>
        <div className="w-3.5 h-3.5 rounded-xs bg-slate-200 dark:bg-slate-700" />
        <div className="w-3.5 h-3.5 rounded-xs bg-emerald-200 dark:bg-emerald-950/40" />
        <div className="w-3.5 h-3.5 rounded-xs bg-emerald-350 dark:bg-emerald-800/60 bg-emerald-300" />
        <div className="w-3.5 h-3.5 rounded-xs bg-emerald-500 dark:bg-emerald-600" />
        <div className="w-3.5 h-3.5 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
        <span>More</span>
      </div>
    </div>
  );
}

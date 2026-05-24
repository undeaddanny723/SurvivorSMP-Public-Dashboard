export default function CapacityBar({ online, max }) {
  const pct = max > 0 ? Math.round((online / max) * 100) : 0;

  const fillColor =
    pct >= 100
      ? 'bg-red-500'
      : pct >= 90
        ? 'bg-orange-500'
        : pct >= 80
          ? 'bg-amber-500'
          : 'bg-emerald-500';

  return (
    <div className="w-full">
      <div className="flex justify-end mb-1">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {pct}%
        </span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${fillColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

import SparkLine from './SparkLine';

export default function StatCard({ label, value, subtext, sparkData, valueClassName = "text-slate-900 dark:text-slate-100" }) {
  return (
    <div className="rounded-xl p-5 bg-slate-50 shadow-sm dark:bg-slate-800 dark:shadow-none flex flex-col">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className={`mt-1 text-3xl font-bold ${valueClassName}`}>
        {value}
      </div>
      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        {subtext}
      </div>
      <div className="mt-auto pt-3">
        <SparkLine data={sparkData} />
      </div>
    </div>
  );
}

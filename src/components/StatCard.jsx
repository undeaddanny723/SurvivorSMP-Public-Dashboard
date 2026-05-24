import SparkLine from './SparkLine';
import Card from './Card'; // Import the new Card component

export default function StatCard({ label, value, subtext, sparkData, valueClassName = "text-slate-900 dark:text-slate-100" }) {
  return (
    <Card className="flex flex-col">
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
    </Card>
  );
}

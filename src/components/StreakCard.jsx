import Card from './Card';

export default function StreakCard({ days, hours }) {
  return (
    <Card className="flex flex-col justify-between h-full">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Current Streak
      </div>
      <div className="mt-1">
        <span className="text-3xl font-bold text-green-500 dark:text-green-400">{days}</span>
        <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">days</span>
        <span className="ml-2 text-3xl font-bold text-green-500 dark:text-green-400">{hours}</span>
        <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">hours</span>
      </div>
    </Card>
  );
}

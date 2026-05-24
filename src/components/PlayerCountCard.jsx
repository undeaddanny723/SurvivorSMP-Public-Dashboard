import Card from './Card';

export default function PlayerCountCard({ online, max, previousCount }) {
  const delta = online - previousCount;
  
  return (
    <Card>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Players Online
      </div>
      <div className="mt-1 text-3xl font-bold text-blue-500 dark:text-blue-400">
        {online} <span className="text-xl font-normal text-slate-400">/ {max}</span>
      </div>
      <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {delta >= 0 ? '+' : ''}{delta} vs previous
      </div>
    </Card>
  );
}

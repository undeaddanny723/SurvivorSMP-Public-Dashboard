import Card from './Card';

export default function ServerHealthCard({ healthScore, uptimePercentage, incidentCount24h, streakDays }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500 dark:text-green-400';
    if (score >= 50) return 'text-amber-500 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Server Health Score
        </div>
        <div className={`mt-1 text-3xl font-bold ${getScoreColor(healthScore)}`}>
          {healthScore}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Uptime</div>
          <div className="font-medium text-slate-900 dark:text-slate-100">{uptimePercentage}%</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Incidents</div>
          <div className="font-medium text-slate-900 dark:text-slate-100">{incidentCount24h}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Streak</div>
          <div className="font-medium text-slate-900 dark:text-slate-100">{streakDays}d</div>
        </div>
      </div>
    </Card>
  );
}

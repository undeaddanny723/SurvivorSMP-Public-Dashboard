export default function StatusBadge({ online, lastChecked }) {
  return (
    <div className="inline-flex max-w-full flex-wrap items-center justify-end gap-2 text-right">
      <span
        className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${
          online
            ? 'bg-emerald-600 dark:bg-emerald-500'
            : 'bg-red-500'
        }`}
      >
        {online ? 'Online' : 'Offline'}
      </span>
      <span className="min-w-0 text-[10px] leading-snug text-slate-500 dark:text-slate-400">
        {lastChecked}
      </span>
    </div>
  );
}

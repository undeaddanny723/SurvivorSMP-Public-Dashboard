export default function StatusBadge({ online, lastChecked }) {
  return (
    <div className="inline-flex flex-col items-center gap-1">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white ${
          online
            ? 'bg-emerald-600 dark:bg-emerald-500'
            : 'bg-red-500'
        }`}
      >
        {online ? 'Online' : 'Offline'}
      </span>
      <span className="text-[10px] text-slate-500 dark:text-slate-400">
        {lastChecked}
      </span>
    </div>
  );
}

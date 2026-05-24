export default function ServerInfoCard({ ip, version, software, motd, icon, authMode, latency, mods }) {
  const rows = [
    { label: 'IP Address', value: ip },
    { label: 'Version', value: version },
    { label: 'Software', value: software },
    { label: 'MOTD', value: motd },
    { label: 'Auth Mode', value: authMode },
    { label: 'Latency', value: latency },
    { label: 'Mods', value: mods },
  ];

  return (
    <div className="flex w-full min-w-0 flex-col rounded-lg bg-slate-50 p-5 shadow-sm dark:bg-slate-800 dark:shadow-none">
      {icon && (
        <div className="mb-4 flex justify-start">
          {typeof icon === 'string' && icon.startsWith('data:image') ? (
            <img src={icon} alt="Server Icon" className="h-12 w-12 rounded-lg object-cover" />
          ) : (
            <div className="h-12 w-12 overflow-hidden rounded-lg">{icon}</div>
          )}
        </div>
      )}
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 gap-1 py-2.5 text-sm first:pt-0 last:pb-0 sm:grid-cols-[8rem_minmax(0,1fr)]"
          >
            <span className="font-medium text-slate-500 dark:text-slate-400">{row.label}</span>
            <span className="min-w-0 break-words text-left font-semibold text-slate-900 dark:text-slate-100 sm:text-right">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

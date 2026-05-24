export default function ServerInfoCard({ version, software, motd, icon, authMode, latency, mods }) {
  const rows = [
    { label: 'Version', value: version },
    { label: 'Software', value: software },
    { label: 'MOTD', value: motd },
    { label: 'Auth Mode', value: authMode },
    { label: 'Latency', value: latency },
    { label: 'Mods', value: mods },
  ];

  return (
    <div className="rounded-xl p-5 bg-slate-50 shadow-sm dark:bg-slate-800 dark:shadow-none flex flex-col w-full">
      {icon && (
        <div className="mb-4 flex justify-start">
          {typeof icon === 'string' ? (
            <img src={icon} alt="Server Icon" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg overflow-hidden">{icon}</div>
          )}
        </div>
      )}
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {rows.map((row, idx) => (
          <div key={idx} className="flex justify-between py-2.5 text-sm first:pt-0 last:pb-0">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{row.label}</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

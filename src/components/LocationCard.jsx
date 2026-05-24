function InfoRow({ label, value, children }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-2.5 text-sm first:pt-0 last:pb-0 sm:grid-cols-[7rem_minmax(0,1fr)]">
      <span className="font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <span className="min-w-0 break-words text-left font-semibold text-slate-900 dark:text-slate-100 sm:text-right">
        {children ?? value}
      </span>
    </div>
  )
}

export default function LocationCard({ ip, country, countryCode, city, region, isp, timezone, lat, lon }) {
  return (
    <div className="flex w-full min-w-0 flex-col rounded-lg bg-slate-50 p-5 shadow-sm dark:bg-slate-800 dark:shadow-none">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        <InfoRow label="IP Address" value={ip} />

        <InfoRow label="Country">
          <span className="inline-flex min-w-0 flex-wrap items-center justify-start gap-1.5 sm:justify-end">
            <span>{country}</span>
            {countryCode ? (
              <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {countryCode}
              </span>
            ) : null}
          </span>
        </InfoRow>

        <InfoRow label="City" value={city} />
        <InfoRow label="Region" value={region} />
        <InfoRow label="ISP" value={isp} />
        <InfoRow label="Timezone" value={timezone} />
        <InfoRow label="Latitude" value={lat} />
        <InfoRow label="Longitude" value={lon} />
      </div>
    </div>
  );
}

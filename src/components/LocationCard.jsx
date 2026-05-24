function getFlagEmoji(countryCode) {
  if (!countryCode || typeof countryCode !== 'string') return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return '';
  }
}

export default function LocationCard({ country, countryCode, city, region, isp, timezone, lat, lon }) {
  return (
    <div className="rounded-xl p-5 bg-slate-50 shadow-sm dark:bg-slate-800 dark:shadow-none flex flex-col w-full">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {/* Country Row */}
        <div className="flex justify-between py-2.5 text-sm first:pt-0">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Country</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold flex items-center gap-1.5 text-right">
            {countryCode && <span className="text-base leading-none">{getFlagEmoji(countryCode)}</span>}
            {country} {countryCode ? `(${countryCode})` : ''}
          </span>
        </div>

        {/* City Row */}
        <div className="flex justify-between py-2.5 text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium">City</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">{city}</span>
        </div>

        {/* Region Row */}
        <div className="flex justify-between py-2.5 text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Region</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">{region}</span>
        </div>

        {/* ISP Row with icon/label */}
        <div className="flex justify-between py-2.5 text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            ISP
          </span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">{isp}</span>
        </div>

        {/* Timezone Row with icon/label */}
        <div className="flex justify-between py-2.5 text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Timezone
          </span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">{timezone}</span>
        </div>

        {/* Latitude Row */}
        <div className="flex justify-between py-2.5 text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Latitude</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">{lat}</span>
        </div>

        {/* Longitude Row */}
        <div className="flex justify-between py-2.5 text-sm last:pb-0">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Longitude</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold text-right">{lon}</span>
        </div>
      </div>
    </div>
  );
}

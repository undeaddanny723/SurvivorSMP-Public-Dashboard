export default function ProjectionChart({ history }) {
  return (
    <div className="w-full rounded-xl p-5 bg-slate-50 dark:bg-slate-800 shadow-sm dark:shadow-none flex flex-col">
      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Player Projection
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Forecasted player activity for the next 24 hours based on historical trends.
        </p>
      </div>

      {/* Styled placeholder SVG for projection graph */}
      <div className="h-44 mt-4 relative w-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden bg-white/40 dark:bg-slate-900/30">
        <svg className="absolute inset-0 w-full h-full text-blue-500/20 dark:text-emerald-500/10" preserveAspectRatio="none" viewBox="0 0 100 100">
          {/* Baseline Grid */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.25" strokeDasharray="2,2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.25" strokeDasharray="2,2" />
          <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.25" strokeDasharray="2,2" />
          
          {/* Historical Data (Solid Line) */}
          <path
            d="M 0 85 Q 15 70, 30 75 T 60 50"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Projection/Forecast Data (Dashed Line) */}
          <path
            d="M 60 50 Q 75 30, 90 20 T 100 10"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          
          {/* Glow indicator at split point */}
          <circle cx="60" cy="50" r="3" fill="#10b981" />
        </svg>
        <div className="absolute bottom-3 right-3 flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded text-[10px] font-semibold backdrop-blur-xs border border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-blue-500 inline-block" /> Historical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-emerald-500 border-t border-dashed inline-block" /> Projected
          </span>
        </div>
      </div>
    </div>
  );
}

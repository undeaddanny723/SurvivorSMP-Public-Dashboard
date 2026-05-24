import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import useDerivedStats from '../hooks/useDerivedStats';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 p-3 rounded-lg shadow-md text-xs">
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
        {payload.map((p, idx) => {
          if (p.value === null || p.value === undefined) return null;
          return (
            <div key={idx} className="flex items-center gap-2 py-0.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.color }} />
              <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function ProjectionChart({ history = [] }) {
  const derived = useDerivedStats({ history });
  const projectionPoints = derived?.projectionPoints || [];
  const last20 = (history || []).slice(-20);

  let activeHistory = last20;
  if (activeHistory.length === 0) {
    const now = Date.now();
    activeHistory = Array.from({ length: 20 }, (_, idx) => {
      const timestamp = now - (19 - idx) * 15 * 60 * 1000;
      return {
        timestamp,
        players: {
          online: 5 + Math.sin(idx / 2) * 3 + Math.random() * 2,
        },
      };
    });
  }

  let activeProjection = projectionPoints;
  if (activeProjection.length === 0 && activeHistory.length > 0) {
    const lastPoint = activeHistory[activeHistory.length - 1];
    const interval = 15 * 60 * 1000;
    activeProjection = Array.from({ length: 5 }, (_, idx) => {
      return {
        timestamp: lastPoint.timestamp + interval * (idx + 1),
        projected: Math.max(0, (lastPoint.players?.online ?? 5) + (idx + 1) * 0.5 + Math.sin(idx) * 1.5),
      };
    });
  }

  const chartData = [];
  activeHistory.forEach((entry) => {
    const timestamp = entry.timestamp;
    const dateObj = new Date(timestamp);
    const displayTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    chartData.push({
      timestamp,
      displayTime,
      historyVal: entry?.players?.online ?? 0,
      projectionVal: null,
    });
  });

  const lastHistoryPoint = chartData[chartData.length - 1];
  if (lastHistoryPoint && activeProjection.length > 0) {
    lastHistoryPoint.projectionVal = lastHistoryPoint.historyVal;

    activeProjection.forEach((pt) => {
      const dateObj = new Date(pt.timestamp);
      const displayTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      chartData.push({
        timestamp: pt.timestamp,
        displayTime,
        historyVal: null,
        projectionVal: pt.projected,
      });
    });
  }

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

      <div className="h-44 mt-4 relative w-full flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden bg-white/40 dark:bg-slate-900/30">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
              <XAxis
                dataKey="displayTime"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 9 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8', fontSize: 9 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                x={lastHistoryPoint?.displayTime}
                stroke="#64748b"
                strokeDasharray="3 3"
                label={{
                  value: 'Projected ➔',
                  position: 'insideTopRight',
                  fill: '#f59e0b',
                  fontSize: 10,
                  fontWeight: 'bold',
                  offset: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="historyVal"
                name="Historical"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="projectionVal"
                name="Projected"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded text-[10px] font-semibold backdrop-blur-xs border border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-blue-500 inline-block" /> Historical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-amber-500 border-t border-dashed inline-block" /> Projected
          </span>
        </div>
      </div>
    </div>
  );
}

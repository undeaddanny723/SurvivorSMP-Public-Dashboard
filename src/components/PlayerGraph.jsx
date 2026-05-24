import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import useDerivedStats from '../hooks/useDerivedStats';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 p-3 rounded-lg shadow-md text-xs">
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
        {payload.map((p, idx) => (
          <div key={idx} className="flex items-center gap-2 py-0.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.stroke || p.color }} />
            <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PlayerGraph({ history = [], showYesterday, showProjection, showRollingAvg }) {
  const [localShowYesterday, setLocalShowYesterday] = useState(!!showYesterday);
  const [localShowProjection, setLocalShowProjection] = useState(!!showProjection);
  const [localShowRollingAvg, setLocalShowRollingAvg] = useState(!!showRollingAvg);

  useEffect(() => {
    setLocalShowYesterday(!!showYesterday);
  }, [showYesterday]);

  useEffect(() => {
    setLocalShowProjection(!!showProjection);
  }, [showProjection]);

  useEffect(() => {
    setLocalShowRollingAvg(!!showRollingAvg);
  }, [showRollingAvg]);

  const derived = useDerivedStats({ history });

  // Format chart data
  const chartData = history.map((entry) => {
    const timestamp = entry?.timestamp ?? 0;
    const dateObj = new Date(timestamp);
    const displayTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    // Yesterday value
    let yesterdayVal = null;
    if (localShowYesterday && derived?.yesterdayHistory?.length > 0) {
      const targetTime = timestamp - 24 * 60 * 60 * 1000;
      const closest = derived.yesterdayHistory.reduce((prev, curr) => {
        return Math.abs((curr?.timestamp ?? 0) - targetTime) < Math.abs((prev?.timestamp ?? 0) - targetTime) ? curr : prev;
      });
      if (Math.abs((closest?.timestamp ?? 0) - targetTime) < 30 * 60 * 1000) {
        yesterdayVal = closest?.players?.online ?? null;
      }
    }

    // 7d Avg value
    let rollingAvgVal = null;
    if (localShowRollingAvg && derived?.rollingAvg7d?.length > 0) {
      const dateKey = new Date(timestamp).toISOString().slice(0, 10);
      const match = derived.rollingAvg7d.find((r) => r.date === dateKey);
      if (match) {
        rollingAvgVal = match.avg;
      } else {
        rollingAvgVal = derived.rollingAvg7d[derived.rollingAvg7d.length - 1]?.avg ?? null;
      }
    }

    return {
      timestamp,
      displayTime,
      today: entry?.players?.online ?? 0,
      yesterday: yesterdayVal,
      rollingAvg: rollingAvgVal,
      projection: null,
    };
  });

  // Append projection points if active
  if (localShowProjection && derived?.projectionPoints?.length > 0 && chartData.length > 0) {
    const lastPoint = chartData[chartData.length - 1];
    lastPoint.projection = lastPoint.today;

    derived.projectionPoints.forEach((pt) => {
      const dateObj = new Date(pt.timestamp);
      const displayTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      chartData.push({
        timestamp: pt.timestamp,
        displayTime,
        today: null,
        yesterday: null,
        rollingAvg: null,
        projection: pt.projected,
      });
    });
  }

  return (
    <div className="w-full rounded-xl p-5 bg-slate-50 dark:bg-slate-800 shadow-sm dark:shadow-none flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          Player Activity
        </h3>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setLocalShowYesterday(!localShowYesterday)}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              localShowYesterday
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300/85 dark:hover:bg-slate-600/85'
            }`}
          >
            Yesterday
          </button>
          <button
            type="button"
            onClick={() => setLocalShowProjection(!localShowProjection)}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              localShowProjection
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300/85 dark:hover:bg-slate-600/85'
            }`}
          >
            Projection
          </button>
          <button
            type="button"
            onClick={() => setLocalShowRollingAvg(!localShowRollingAvg)}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              localShowRollingAvg
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-300/85 dark:hover:bg-slate-600/85'
            }`}
          >
            7d Avg
          </button>
        </div>
      </div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="displayTime"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
            <Line
              type="monotone"
              dataKey="today"
              name="Today"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
            />
            {localShowYesterday && (
              <Line
                type="monotone"
                dataKey="yesterday"
                name="Yesterday"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 3 }}
                connectNulls
              />
            )}
            {localShowRollingAvg && (
              <Line
                type="monotone"
                dataKey="rollingAvg"
                name="7d Avg"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
                connectNulls
              />
            )}
            {localShowProjection && (
              <Line
                type="monotone"
                dataKey="projection"
                name="Projected"
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 3 }}
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

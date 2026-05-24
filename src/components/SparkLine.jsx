import { ResponsiveContainer, LineChart, Line } from 'recharts';

export default function SparkLine({ data = [] }) {
  const chartData = data.map((val, idx) => {
    if (typeof val === 'object' && val !== null) {
      return val;
    }
    return { value: Number(val) || 0 };
  });

  return (
    <div className="w-full h-full min-h-[32px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            className="stroke-blue-500 dark:stroke-blue-400"
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

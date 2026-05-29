"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#38bdf8",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#64748b",
];

function groupCount(data: any[], key: string, limit = 5) {
  const result: Record<string, number> = {};

  data.forEach((item) => {
    const value = String(item[key] ?? "Unknown");
    result[value] = (result[value] || 0) + 1;
  });

  const sorted = Object.entries(result)
    .map(([name, value]) => ({
      name: key === "product_id" ? `Product ${name}` : name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const top = sorted.slice(0, limit);
  const others = sorted.slice(limit);

  if (others.length > 0) {
    top.push({
      name: "Others",
      value: others.reduce((sum, item) => sum + item.value, 0),
    });
  }

  return top;
}

export default function PieChartCard({
  title,
  data,
  dataKeyName,
}: {
  title: string;
  data: any[];
  dataKeyName: string;
}) {
  const chartData = groupCount(data, dataKeyName, 5);

  if (!chartData.length) {
    return (
      <div className="chart-card">
        <h3>{title}</h3>
        <div className="empty-chart">
          No chart data available
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>{title}</h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

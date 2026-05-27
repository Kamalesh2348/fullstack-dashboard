"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#9333ea", "#f97316", "#dc2626"];

export default function PieChartCard({
  title,
  data,
}: {
  title: string;
  data: { name: string; value: number }[];
}) {
  const chartData = data.filter((item) => item.value > 0);

  return (
    <section className="glass-card rounded-2xl shadow-xl p-5 card-hover mb-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {chartData.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-gray-500">
          No chart data available
        </div>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}"use client";

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

export default function ClearPieChart({
  title,
  data,
  dataKeyName,
}: {
  title: string;
  data: any[];
  dataKeyName: string;
}) {
  const chartData = groupCount(data, dataKeyName, 5);

  return (
    <div className="chart-card">
      <h3>{title}</h3>

      <div className="pie-chart-box">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
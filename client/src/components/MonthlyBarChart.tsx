import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthSummary } from "@/hooks/use-weather-year-summary";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface MonthlyBarChartProps {
  data: MonthSummary[];
  metric?: "avgTemp" | "totalRainfall";
}

const CustomTooltip = ({
  active,
  payload,
  metric,
}: {
  active?: boolean;
  payload?: Array<{ payload?: MonthSummary }>;
  metric?: "avgTemp" | "totalRainfall";
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  if (!p) return null;
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{MONTH_NAMES[p.month - 1]} </p>
      {metric === "totalRainfall" ? (
        <p className="text-primary">Rainfall: {p.totalRainfall.toFixed(1)} mm</p>
      ) : (
        <p className="text-primary">Avg temp: {p.avgTemp.toFixed(1)}°C</p>
      )}
      <p className="text-muted-foreground">AQI (avg): {p.avgAqi.toFixed(0)}</p>
    </div>
  );
};

export function MonthlyBarChart({ data, metric = "avgTemp" }: MonthlyBarChartProps) {
  if (!data.length) return null;

  const chartData = data.map((d) => ({
    ...d,
    monthName: MONTH_NAMES[d.month - 1],
    value: metric === "totalRainfall" ? d.totalRainfall : d.avgTemp,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="monthName"
          tick={{ fontSize: 10 }}
          className="text-muted-foreground"
        />
        <YAxis
          tick={{ fontSize: 10 }}
          className="text-muted-foreground"
          tickFormatter={(v) => (metric === "totalRainfall" ? `${v}` : `${v}°C`)}
        />
        <Tooltip content={<CustomTooltip metric={metric} />} />
        <Bar
          dataKey="value"
          name={metric === "totalRainfall" ? "Rainfall (mm)" : "Avg temp (°C)"}
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

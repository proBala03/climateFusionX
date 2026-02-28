import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyWeatherPoint } from "@/hooks/use-weather-by-month";

interface RainfallHistogramChartProps {
  daily: DailyWeatherPoint[];
}

const BINS = [
  { label: "0–5 mm", min: 0, max: 5 },
  { label: "5–10 mm", min: 5, max: 10 },
  { label: "10–20 mm", min: 10, max: 20 },
  { label: "20+ mm", min: 20, max: Infinity },
];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: { bin: string; count: number } }>;
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload ?? { bin: 0, count: 0 };
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{p.bin}</p>
      <p className="text-primary">Days: {p.count}</p>
    </div>
  );
};

export function RainfallHistogramChart({ daily }: RainfallHistogramChartProps) {
  if (!daily.length) return null;

  const chartData = BINS.map((bin) => {
    const count = daily.filter((d) => {
      const r = d.rainfall ?? 0;
      return r >= bin.min && r < bin.max;
    }).length;
    return { bin: bin.label, count };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="bin"
          tick={{ fontSize: 10 }}
          className="text-muted-foreground"
        />
        <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="count"
          name="Days"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

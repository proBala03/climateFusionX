import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyWeatherPoint } from "@/hooks/use-weather-by-month";

interface TempBandChartProps {
  daily: DailyWeatherPoint[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: { date?: string; minTemp?: number; maxTemp?: number; avgTemp?: number };
  }>;
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload ?? {};
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{p.date}</p>
      <p className="text-primary">Avg: {Number(p.avgTemp ?? 0).toFixed(1)}°C</p>
      <p className="text-muted-foreground">
        Min: {Number(p.minTemp ?? 0).toFixed(1)}°C · Max: {Number(p.maxTemp ?? 0).toFixed(1)}°C
      </p>
    </div>
  );
};

export function TempBandChart({ daily }: TempBandChartProps) {
  const hasMinMax = daily.some(
    (d) =>
      (d.minTemp != null && !Number.isNaN(d.minTemp)) ||
      (d.maxTemp != null && !Number.isNaN(d.maxTemp))
  );
  if (!daily.length || !hasMinMax) return null;

  const chartData = daily.map((d) => ({
    ...d,
    dateLabel: d.date.slice(5),
    minTemp: d.minTemp ?? d.avgTemp,
    maxTemp: d.maxTemp ?? d.avgTemp,
    avgTemp: d.avgTemp ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="tempBandFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 10 }}
          className="text-muted-foreground"
        />
        <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="maxTemp"
          stroke="none"
          fill="url(#tempBandFill)"
          stackId="band"
          name="Max"
        />
        <Area
          type="monotone"
          dataKey="minTemp"
          stroke="none"
          fill="hsl(var(--background))"
          stackId="band"
          name="Min"
        />
        <Line
          type="monotone"
          dataKey="avgTemp"
          name="Avg temp (°C)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

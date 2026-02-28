import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyWeatherPoint } from "@/hooks/use-weather-by-month";

interface HumidityRainfallChartProps {
  daily: DailyWeatherPoint[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload?: { date?: string; humidity?: number; rainfall?: number };
  }>;
}) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload ?? {};
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{p.date}</p>
      <p className="text-primary">Humidity: {Number(p.humidity ?? 0).toFixed(0)}%</p>
      <p className="text-muted-foreground">Rainfall: {Number(p.rainfall ?? 0).toFixed(1)} mm</p>
    </div>
  );
};

export function HumidityRainfallChart({ daily }: HumidityRainfallChartProps) {
  const hasHumidity = daily.some(
    (d) => d.humidity != null && !Number.isNaN(d.humidity)
  );
  if (!daily.length || !hasHumidity) return null;

  const chartData = daily.map((d) => ({
    ...d,
    dateLabel: d.date.slice(5),
    humidity: d.humidity ?? 0,
    rainfall: d.rainfall ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 10 }}
          className="text-muted-foreground"
        />
        <YAxis yAxisId="humidity" tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <YAxis yAxisId="rain" orientation="right" tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Line
          yAxisId="humidity"
          type="monotone"
          dataKey="humidity"
          name="Humidity (%)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="rain"
          type="monotone"
          dataKey="rainfall"
          name="Rainfall (mm)"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

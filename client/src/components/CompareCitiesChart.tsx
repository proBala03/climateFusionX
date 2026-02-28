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

interface CompareCitiesChartProps {
  dailyA: DailyWeatherPoint[];
  dailyB: DailyWeatherPoint[];
  cityA: string;
  cityB: string;
}

function CustomTooltip(
  props: {
    active?: boolean;
    payload?: Array<{ payload?: Record<string, unknown> }>;
    cityA: string;
    cityB: string;
  }
) {
  const { active, payload, cityA, cityB } = props;
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload ?? {};
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">{String(p.date)}</p>
      <p className="text-primary">{cityA}: {Number(p.tempA ?? 0).toFixed(1)}°C</p>
      <p className="text-secondary">{cityB}: {Number(p.tempB ?? 0).toFixed(1)}°C</p>
    </div>
  );
}

export function CompareCitiesChart({
  dailyA,
  dailyB,
  cityA,
  cityB,
}: CompareCitiesChartProps) {
  if (!dailyA.length || !dailyB.length) return null;

  const dateSet = new Set(dailyA.map((d) => d.date));
  dailyB.forEach((d) => dateSet.add(d.date));
  const dates = Array.from(dateSet).sort();
  const mapA = new Map(dailyA.map((d) => [d.date, d]));
  const mapB = new Map(dailyB.map((d) => [d.date, d]));

  const chartData = dates.map((date) => ({
    date,
    dateLabel: date.slice(5),
    tempA: mapA.get(date)?.avgTemp ?? null,
    tempB: mapB.get(date)?.avgTemp ?? null,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 10 }}
          className="text-muted-foreground"
        />
        <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
        <Tooltip content={<CustomTooltip cityA={cityA} cityB={cityB} />} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Line
          type="monotone"
          dataKey="tempA"
          name={cityA + " (°C)"}
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="tempB"
          name={cityB + " (°C)"}
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          dot={false}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

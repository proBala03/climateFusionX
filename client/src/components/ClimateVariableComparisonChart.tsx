import { useMemo } from "react";
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

interface DataPoint {
  year: number;
  value: number;
}

interface ClimateVariableComparisonChartProps {
  temperature: DataPoint[];
  co2: DataPoint[];
  seaLevel: DataPoint[];
}

function normalize(series: DataPoint[]): { year: number; value: number }[] {
  if (!series.length) return [];
  const values = series.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return series.map((d) => ({ year: d.year, value: (d.value - min) / range }));
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color?: string; payload: { year: number } }>;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground">Year: {payload[0]?.payload?.year}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={entry.color ? { color: entry.color } : undefined}>
          {entry.name}: {Number(entry.value).toFixed(3)}
        </p>
      ))}
    </div>
  );
};

export function ClimateVariableComparisonChart({
  temperature,
  co2,
  seaLevel,
}: ClimateVariableComparisonChartProps) {
  const chartData = useMemo(() => {
    const years = new Set<number>();
    temperature.forEach((d) => years.add(d.year));
    co2.forEach((d) => years.add(d.year));
    seaLevel.forEach((d) => years.add(d.year));
    const arr = Array.from(years).sort((a, b) => a - b);
    const mapT = new Map(temperature.map((d) => [d.year, d.value]));
    const mapC = new Map(co2.map((d) => [d.year, d.value]));
    const mapS = new Map(seaLevel.map((d) => [d.year, d.value]));
    const tNorm = normalize(temperature);
    const cNorm = normalize(co2);
    const sNorm = normalize(seaLevel);
    const mapTn = new Map(tNorm.map((d) => [d.year, d.value]));
    const mapCn = new Map(cNorm.map((d) => [d.year, d.value]));
    const mapSn = new Map(sNorm.map((d) => [d.year, d.value]));
    return arr.map((year) => ({
      year,
      temp: mapTn.get(year) ?? null,
      co2: mapCn.get(year) ?? null,
      seaLevel: mapSn.get(year) ?? null,
      _tempRaw: mapT.get(year),
      _co2Raw: mapC.get(year),
      _seaRaw: mapS.get(year),
    }));
  }, [temperature, co2, seaLevel]);

  if (!chartData.length) return null;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 10 }}
          className="text-muted-foreground"
        />
        <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" tickFormatter={(v) => v.toFixed(2)} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Line
          type="monotone"
          dataKey="temp"
          name="Temperature (norm)"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="co2"
          name="CO2 (norm)"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
          dot={false}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="seaLevel"
          name="Sea level (norm)"
          stroke="hsl(var(--accent))"
          strokeWidth={2}
          dot={false}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts';
import type { DataPoint, ForecastPoint } from '@shared/schema';

interface ClimateChartProps {
  historical: DataPoint[];
  forecast: ForecastPoint[];
  variableName: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const year = Math.floor(data.year);
    const fraction = data.year % 1;
    
    // Determine if this is a daily or monthly forecast based on fraction magnitude
    let dateLabel = year.toString();
    
    if (fraction > 0) {
      if (fraction > 0.1) {
        // Likely monthly (fraction > 0.08 means > ~1 month)
        const month = Math.round(fraction * 12) || 0;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        dateLabel = `${months[month - 1] || 'Jan'} ${year}`;
      } else {
        // Likely daily (fraction < 0.01 means < ~4 days)
        const dayOfYear = Math.round(fraction * 365);
        const date = new Date(year, 0, dayOfYear);
        dateLabel = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    }
    
    return (
      <div className="bg-card border-2 border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-foreground">Date: {dateLabel}</p>
        {data.actual != null && (
          <p className="text-primary">Historical: {Number(data.actual).toFixed(2)}</p>
        )}
        {data.forecast != null && (
          <p className="text-secondary">Forecast: {Number(data.forecast).toFixed(2)}</p>
        )}
        {data.lowerBound != null && data.upperBound != null && (
          <p className="text-muted-foreground text-sm">
            95% Confidence Interval: {Number(data.lowerBound).toFixed(2)} - {Number(data.upperBound).toFixed(2)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function ClimateChart({ historical, forecast, variableName }: ClimateChartProps) {
  const chartData = useMemo(() => {
    if (!historical.length) return [];

    // Format historical data
    const histData = historical.map(d => ({
      year: d.year,
      actual: d.value,
      forecast: null,
      lowerBound: null,
      upperBound: null,
    }));

    // Find the last historical point to connect the lines seamlessly
    const lastHist = histData[histData.length - 1];
    
    // Format forecast data
    const foreData = forecast.map(d => ({
      year: d.year,
      actual: null,
      forecast: d.value,
      lowerBound: d.lowerBound,
      upperBound: d.upperBound,
      confidenceArea: [d.lowerBound, d.upperBound], // For Area range
    }));

    // Create a bridge point to connect historical actuals to the forecast line
    const bridgePoint = {
      year: lastHist.year,
      actual: null,
      forecast: lastHist.actual,
      lowerBound: lastHist.actual,
      upperBound: lastHist.actual,
      confidenceArea: [lastHist.actual, lastHist.actual],
    };

    return [...histData, bridgePoint, ...foreData];
  }, [historical, forecast]);

  // Determine Y-axis domain to ensure bounds are visible
  const minVal = useMemo(() => {
    const allVals = chartData.flatMap(d => [d.actual, d.lowerBound]).filter(v => v !== null) as number[];
    return allVals.length ? Math.min(...allVals) * 0.95 : 'auto';
  }, [chartData]);

  const maxVal = useMemo(() => {
    const allVals = chartData.flatMap(d => [d.actual, d.upperBound]).filter(v => v !== null) as number[];
    return allVals.length ? Math.max(...allVals) * 1.05 : 'auto';
  }, [chartData]);

  if (!chartData.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No data available to display.
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.0}/>
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke="hsl(var(--muted-foreground))" 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => {
              const year = Math.floor(value);
              const fraction = value % 1;
              
              if (fraction > 0) {
                if (fraction > 0.1) {
                  // Monthly format for fractional years
                  const month = Math.round(fraction * 12) || 0;
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  return `${months[month - 1] || 'Jan'} ${year}`;
                } else {
                  // Daily format
                  const dayOfYear = Math.round(fraction * 365);
                  const date = new Date(year, 0, dayOfYear);
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
              }
              return year.toString();
            }}
            tickMargin={10}
            minTickGap={30}
            interval={Math.floor(Math.max(0, chartData.length / 12))}
          />
          <YAxis 
            domain={[minVal, maxVal]}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => value.toFixed(1)}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          {/* Confidence Interval Area */}
          <Area 
            type="monotone" 
            dataKey="confidenceArea" 
            stroke="none" 
            fill="url(#colorConfidence)" 
            name="95% Confidence Interval"
            isAnimationActive={true}
          />
          
          {/* Historical Line */}
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: '#fff', strokeWidth: 2 }}
            name={`Historical ${variableName}`}
            filter="url(#glow)"
          />
          
          {/* Forecast Line */}
          <Line 
            type="monotone" 
            dataKey="forecast" 
            stroke="hsl(var(--secondary))" 
            strokeWidth={3} 
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 6, fill: 'hsl(var(--secondary))', stroke: '#fff', strokeWidth: 2 }}
            name={`Forecast ${variableName}`}
            filter="url(#glow)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

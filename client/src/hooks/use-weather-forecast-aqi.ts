"use client";

import { useEffect, useState } from "react";

export interface DailyWeatherData {
  date: string;
  aqi?: number;
}

export interface ForecastPoint {
  date: string;
  value: number;
  lowerBound: number;
  upperBound: number;
}

interface UseWeatherForecastAqiResult {
  historical: DailyWeatherData[];
  forecast: ForecastPoint[];
  isLoading: boolean;
  error: string | null;
}

export function useWeatherForecastAqi(
  city: string,
  days: number = 7
): UseWeatherForecastAqiResult {
  const [historical, setHistorical] = useState<DailyWeatherData[]>([]);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city || city.trim() === "") {
      setHistorical([]);
      setForecast([]);
      return;
    }

    let cancelled = false;

    async function fetchForecast() {
      setError(null);
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          city: city.trim(),
          days: String(days),
        });
        const response = await fetch(`/api/weather/forecast/aqi?${params}`);
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(
            (body as { message?: string }).message ||
              `Failed to fetch AQI forecast: ${response.statusText}`
          );
        }
        const json = await response.json();
        if (cancelled) return;
        setHistorical(Array.isArray(json.historical) ? json.historical : []);
        setForecast(Array.isArray(json.forecast) ? json.forecast : []);
      } catch (err) {
        if (cancelled) return;
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setHistorical([]);
        setForecast([]);
        console.error("AQI forecast fetch error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchForecast();

    return () => {
      cancelled = true;
    };
  }, [city, days]);

  return { historical, forecast, isLoading, error };
}

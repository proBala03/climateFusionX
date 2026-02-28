"use client";

import { useEffect, useState } from "react";

export interface WeatherForecastDay {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  rainfall: number;
  aqi: number;
}

interface UseWeatherForecastResult {
  data: WeatherForecastDay[];
  isLoading: boolean;
  error: string | null;
}

export function useWeatherForecast(
  city: string,
  days: number = 7
): UseWeatherForecastResult {
  const [data, setData] = useState<WeatherForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enabled =
    Boolean(city?.trim()) &&
    Number.isInteger(days) &&
    days >= 1 &&
    days <= 14;

  useEffect(() => {
    if (!enabled) {
      setData([]);
      setError(null);
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
        const response = await fetch(`/api/weather/forecast?${params}`);
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(
            (body as { message?: string }).message ||
              `Failed to fetch forecast: ${response.statusText}`
          );
        }
        const json = await response.json();
        if (cancelled) return;
        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        if (cancelled) return;
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setData([]);
        console.error("Weather forecast fetch error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchForecast();
    return () => {
      cancelled = true;
    };
  }, [city, days, enabled]);

  return { data, isLoading, error };
}

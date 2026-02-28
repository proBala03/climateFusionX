"use client";

import { useEffect, useState } from "react";
import {
  type ClimateCondition,
  getClimateCondition,
  formatWeatherData,
  type WeatherData,
} from "@/lib/climate-utils";

interface UseWeatherByMonthResult {
  condition: ClimateCondition;
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  city: string;
}

export function useWeatherByMonthYear(
  city: string,
  year: number,
  month: number
): UseWeatherByMonthResult {
  const [condition, setCondition] = useState<ClimateCondition>("Partly Cloudy");
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayCity, setDisplayCity] = useState(city || "");

  const enabled =
    Boolean(city?.trim()) &&
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12;

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setError(null);
      setCondition("Partly Cloudy");
      setDisplayCity(city || "");
      return;
    }

    let cancelled = false;

    async function fetchWeather() {
      setError(null);
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          city: city.trim(),
          year: String(year),
          month: String(month),
        });
        const response = await fetch(`/api/weather/by-month?${params}`);
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(
            (body as { message?: string }).message ||
              `Failed to fetch weather: ${response.statusText}`
          );
        }
        const rawData = await response.json();
        if (!rawData) {
          throw new Error("No weather data received");
        }
        if (cancelled) return;
        const formatted = formatWeatherData(rawData);
        const climateCondition = getClimateCondition(formatted);
        setData(formatted);
        setCondition(climateCondition);
        setDisplayCity(formatted.city);
      } catch (err) {
        if (cancelled) return;
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setData(null);
        console.error("Weather by month fetch error:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [city, year, month, enabled]);

  return {
    condition,
    data,
    isLoading,
    error,
    city: displayCity,
  };
}

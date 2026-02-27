"use client";

import { useEffect, useState } from "react";
import { type ClimateCondition, getClimateCondition, formatWeatherData, type WeatherData } from "@/lib/climate-utils";

interface UseWeatherResult {
  condition: ClimateCondition;
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  city: string;
}

export function useLatestWeather(city?: string): UseWeatherResult {
  const [condition, setCondition] = useState<ClimateCondition>("Partly Cloudy");
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCity, setDisplayCity] = useState(city || "");

  useEffect(() => {
    async function fetchWeather() {
      try {
        setIsLoading(true);
        setError(null);

        const url = city
          ? `/api/weather/latest/${encodeURIComponent(city)}`
          : "/api/weather/latest";

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch weather: ${response.statusText}`);
        }

        const rawData = await response.json();
        
        // Handle both single object and array responses
        const weatherData = Array.isArray(rawData) ? rawData[0] : rawData;
        
        if (!weatherData) {
          throw new Error("No weather data received");
        }

        const formatted = formatWeatherData(weatherData);
        const climateCondition = getClimateCondition(formatted);

        setData(formatted);
        setCondition(climateCondition);
        setDisplayCity(formatted.city);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Weather fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeather();

    // Optionally set up auto-refresh (e.g., every 5 minutes)
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  return {
    condition,
    data,
    isLoading,
    error,
    city: displayCity,
  };
}

export type ClimateCondition = "Rainy" | "Cloudy" | "Sunny" | "Humid" | "Partly Cloudy";

export interface WeatherData {
  date: string;
  city: string;
  state: string;
  maxTemp: number;
  minTemp: number;
  avgTemp: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  aqi: number;
  aqiCategory: string;
  pressure: number;
  cloudCover: number;
}

/**
 * Determines the climate condition based on rainfall, humidity, and temperature
 * Uses the specified logic:
 * - If rainfall > 5 → "Rainy"
 * - If rainfall > 0 → "Cloudy"
 * - If rainfall == 0 && avg_temp >= 30 → "Sunny"
 * - Else → "Partly Cloudy"
 */
export function getClimateCondition(data: WeatherData): ClimateCondition {
  const { rainfall, humidity, avgTemp } = data;

  if (rainfall > 5) {
    return "Rainy";
  } else if (rainfall > 0) {
    return "Cloudy";
  } else if (rainfall === 0 && avgTemp >= 30) {
    return "Sunny";
  } else if (humidity > 75) {
    return "Humid";
  } else {
    return "Partly Cloudy";
  }
}

/**
 * Gets the emoji representation of a climate condition
 */
export function getClimateEmoji(condition: ClimateCondition): string {
  const emojiMap: Record<ClimateCondition, string> = {
    Rainy: "🌧️",
    Cloudy: "☁️",
    Sunny: "☀️",
    Humid: "💧",
    "Partly Cloudy": "⛅",
  };
  return emojiMap[condition];
}

/**
 * Gets the color theme for a climate condition
 */
export function getClimateColors(condition: ClimateCondition): {
  bg: string;
  text: string;
  border: string;
  accent: string;
} {
  const colorMap: Record<
    ClimateCondition,
    { bg: string; text: string; border: string; accent: string }
  > = {
    Rainy: {
      bg: "from-blue-500/20 to-slate-500/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      accent: "bg-blue-100 dark:bg-blue-900",
    },
    Cloudy: {
      bg: "from-slate-400/20 to-gray-500/20",
      text: "text-slate-700 dark:text-slate-300",
      border: "border-slate-300 dark:border-slate-700",
      accent: "bg-slate-100 dark:bg-slate-900",
    },
    Sunny: {
      bg: "from-yellow-400/20 to-orange-400/20",
      text: "text-yellow-700 dark:text-yellow-300",
      border: "border-yellow-200 dark:border-yellow-800",
      accent: "bg-yellow-100 dark:bg-yellow-900",
    },
    Humid: {
      bg: "from-cyan-400/20 to-blue-500/20",
      text: "text-cyan-700 dark:text-cyan-300",
      border: "border-cyan-200 dark:border-cyan-800",
      accent: "bg-cyan-100 dark:bg-cyan-900",
    },
    "Partly Cloudy": {
      bg: "from-orange-300/20 to-blue-400/20",
      text: "text-orange-700 dark:text-orange-300",
      border: "border-orange-200 dark:border-orange-800",
      accent: "bg-orange-100 dark:bg-orange-900",
    },
  };
  return colorMap[condition];
}

/**
 * Formats weather data from API response
 */
export function formatWeatherData(raw: any): WeatherData {
  return {
    date: raw.date || raw.Date || "",
    city: raw.city || raw.City || "",
    state: raw.state || raw.State || "",
    maxTemp: Number(raw.maxTemp || raw["Temperature_Max (°C)"] || 0),
    minTemp: Number(raw.minTemp || raw["Temperature_Min (°C)"] || 0),
    avgTemp: Number(raw.avgTemp || raw["Temperature_Avg (°C)"] || 0),
    humidity: Number(raw.humidity || raw["Humidity (%)"] || 0),
    rainfall: Number(raw.rainfall || raw["Rainfall (mm)"] || 0),
    windSpeed: Number(raw.windSpeed || raw["Wind_Speed (km/h)"] || 0),
    aqi: Number(raw.aqi || raw.AQI || 0),
    aqiCategory: raw.aqiCategory || raw.AQI_Category || "",
    pressure: Number(raw.pressure || raw["Pressure (hPa)"] || 0),
    cloudCover: Number(raw.cloudCover || raw["Cloud_Cover (%)"] || 0),
  };
}

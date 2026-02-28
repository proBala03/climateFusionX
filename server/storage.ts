import { climateData, type ClimateData, type InsertClimateData, type DataPoint, type ForecastPoint, type ForecastResponse } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

export interface IndianWeatherData {
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

export interface WeatherForecastDay {
  date: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  rainfall: number;
  aqi: number;
}

export interface MonthSummary {
  month: number;
  avgTemp: number;
  totalRainfall: number;
  avgAqi: number;
}

/** Per (year, month) aggregate for a city — used for seasonal forecast. */
export interface MonthlyHistoricalSummary {
  year: number;
  month: number;
  totalRainfall: number;
  avgTemp: number;
  rainDays: number;
  daysInMonth: number;
}

/** Single-month forecast (historical or predicted). */
export interface MonthForecastResponse {
  year: number;
  month: number;
  predictedTotalRainfall: number;
  predictedAvgTemp: number;
  predictedRainDays: number;
  willItRain: boolean;
  summary: string;
  basedOnYears: number[];
  lowerBoundRainfall?: number;
  upperBoundRainfall?: number;
}

/** One point in the 12-month yearly forecast list. */
export interface MonthlyForecastPoint {
  month: number;
  year: number;
  predictedTotalRainfall: number;
  predictedAvgTemp: number;
  predictedRainDays: number;
  lowerBoundRainfall?: number;
  upperBoundRainfall?: number;
}

export interface IStorage {
  getSeries(variable: string, region: string): Promise<DataPoint[]>;
  insertClimateData(data: InsertClimateData): Promise<ClimateData>;
  bulkInsertClimateData(data: InsertClimateData[]): Promise<void>;
  getAllData(): Promise<ClimateData[]>;
  getLatestWeather(city?: string): Promise<IndianWeatherData | IndianWeatherData[]>;
  getWeatherByMonthYear(city: string, year: number, month: number): Promise<IndianWeatherData[]>;
  getWeatherByDateRange(city: string, from: string, to: string): Promise<IndianWeatherData[]>;
  getWeatherForecast(city: string, days: number): Promise<WeatherForecastDay[]>;
  getWeatherYearSummary(city: string, year: number): Promise<MonthSummary[]>;
  getMonthlyHistoricalSummaries(city: string): Promise<MonthlyHistoricalSummary[]>;
  getWeatherForecastMonth(city: string, year: number, month: number): Promise<MonthForecastResponse | null>;
  getWeatherForecastYear(city: string, year: number): Promise<MonthlyForecastPoint[]>;
  getWeatherForecastMonthDaily(city: string, year: number, month: number): Promise<IndianWeatherData[]>;
}

// In-memory storage implementation
class InMemoryStorage implements IStorage {
  private data: ClimateData[] = [];
  private indianWeatherData: Map<string, IndianWeatherData[]> = new Map();
  private idCounter = 1;

  constructor() {
    // Initialize with sample climate data and Indian weather data
    this.initializeSampleData();
    this.loadIndianWeatherData();
  }

  private loadIndianWeatherData() {
    try {
      const csvPath = path.join(
        process.cwd(),
        "attached_assets",
        "Indian_Climate_Dataset_2024_2025.csv"
      );

      if (fs.existsSync(csvPath)) {
        const fileContent = fs.readFileSync(csvPath, "utf-8");
        const lines = fileContent.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const values = line.split(",").map((v) => v.trim());
          const record: any = {};

          headers.forEach((header, index) => {
            record[header] = values[index];
          });

          const {
            Date,
            City,
            State,
            "Temperature_Max (°C)": maxTemp,
            "Temperature_Min (°C)": minTemp,
            "Temperature_Avg (°C)": avgTemp,
            "Humidity (%)": humidity,
            "Rainfall (mm)": rainfall,
            "Wind_Speed (km/h)": windSpeed,
            AQI,
            AQI_Category,
            "Pressure (hPa)": pressure,
            "Cloud_Cover (%)": cloudCover,
          } = record;

          if (!Date || !City) continue;

          const weatherData: IndianWeatherData = {
            date: Date,
            city: City,
            state: State,
            maxTemp: parseFloat(maxTemp),
            minTemp: parseFloat(minTemp),
            avgTemp: parseFloat(avgTemp),
            humidity: parseFloat(humidity),
            rainfall: parseFloat(rainfall),
            windSpeed: parseFloat(windSpeed),
            aqi: parseFloat(AQI),
            aqiCategory: AQI_Category,
            pressure: parseFloat(pressure),
            cloudCover: parseFloat(cloudCover),
          };

          const cityKey = City.toLowerCase();
          if (!this.indianWeatherData.has(cityKey)) {
            this.indianWeatherData.set(cityKey, []);
          }
          this.indianWeatherData.get(cityKey)!.push(weatherData);
        }

        console.log(
          `Loaded Indian weather data for ${this.indianWeatherData.size} cities`
        );
      }
    } catch (error) {
      console.warn("Failed to load Indian weather data:", error);
    }
  }

  private initializeSampleData() {
    // Sample temperature data (global, India, USA)
    const sampleData: InsertClimateData[] = [
      // Global temperature
      { variable: 'temperature', region: 'global', year: 2000, value: 14.4 },
      { variable: 'temperature', region: 'global', year: 2005, value: 14.6 },
      { variable: 'temperature', region: 'global', year: 2010, value: 14.6 },
      { variable: 'temperature', region: 'global', year: 2015, value: 14.8 },
      { variable: 'temperature', region: 'global', year: 2020, value: 14.9 },
      { variable: 'temperature', region: 'global', year: 2025, value: 15.1 },
      // India temperature
      { variable: 'temperature', region: 'india', year: 2000, value: 24.2 },
      { variable: 'temperature', region: 'india', year: 2005, value: 24.5 },
      { variable: 'temperature', region: 'india', year: 2010, value: 24.7 },
      { variable: 'temperature', region: 'india', year: 2015, value: 25.0 },
      { variable: 'temperature', region: 'india', year: 2020, value: 25.3 },
      { variable: 'temperature', region: 'india', year: 2025, value: 25.6 },
      // USA temperature
      { variable: 'temperature', region: 'usa', year: 2000, value: 13.5 },
      { variable: 'temperature', region: 'usa', year: 2005, value: 13.8 },
      { variable: 'temperature', region: 'usa', year: 2010, value: 14.0 },
      { variable: 'temperature', region: 'usa', year: 2015, value: 14.3 },
      { variable: 'temperature', region: 'usa', year: 2020, value: 14.5 },
      { variable: 'temperature', region: 'usa', year: 2025, value: 14.8 },
      // CO2 data
      { variable: 'co2', region: 'global', year: 2000, value: 369.5 },
      { variable: 'co2', region: 'global', year: 2005, value: 379.8 },
      { variable: 'co2', region: 'global', year: 2010, value: 389.9 },
      { variable: 'co2', region: 'global', year: 2015, value: 401.0 },
      { variable: 'co2', region: 'global', year: 2020, value: 413.5 },
      { variable: 'co2', region: 'global', year: 2025, value: 426.0 },
      // Sea level data
      { variable: 'sea_level', region: 'global', year: 2000, value: 0.0 },
      { variable: 'sea_level', region: 'global', year: 2005, value: 16.5 },
      { variable: 'sea_level', region: 'global', year: 2010, value: 34.2 },
      { variable: 'sea_level', region: 'global', year: 2015, value: 52.1 },
      { variable: 'sea_level', region: 'global', year: 2020, value: 71.5 },
      { variable: 'sea_level', region: 'global', year: 2025, value: 92.3 },
    ];

    this.data = sampleData.map((item) => ({
      id: this.idCounter++,
      ...item,
    } as ClimateData));
  }

  async getSeries(variable: string, region: string): Promise<DataPoint[]> {
    return this.data
      .filter(
        (item) => item.variable === variable && item.region === region
      )
      .map((item) => ({
        year: item.year,
        value: item.value,
      }))
      .sort((a, b) => a.year - b.year);
  }

  async insertClimateData(data: InsertClimateData): Promise<ClimateData> {
    const newData = {
      id: this.idCounter++,
      ...data,
    } as ClimateData;
    this.data.push(newData);
    return newData;
  }

  async bulkInsertClimateData(data: InsertClimateData[]): Promise<void> {
    for (const item of data) {
      this.data.push({
        id: this.idCounter++,
        ...item,
      } as ClimateData);
    }
  }

  async getAllData(): Promise<ClimateData[]> {
    return this.data;
  }

  async getLatestWeather(city?: string): Promise<IndianWeatherData | IndianWeatherData[]> {
    if (city) {
      const cityKey = city.toLowerCase();
      const cityData = this.indianWeatherData.get(cityKey);
      
      if (cityData && cityData.length > 0) {
        // Return the latest entry for that city
        return cityData[cityData.length - 1];
      }
      
      // Return default if not found
      return {
        date: new Date().toISOString().split("T")[0],
        city: city,
        state: "Unknown",
        maxTemp: 30,
        minTemp: 20,
        avgTemp: 25,
        humidity: 65,
        rainfall: 0,
        windSpeed: 10,
        aqi: 100,
        aqiCategory: "Moderate",
        pressure: 1013,
        cloudCover: 50,
      };
    }

    // Return latest from all cities
    const allLatest: IndianWeatherData[] = [];
    this.indianWeatherData.forEach((cityData) => {
      if (cityData.length > 0) {
        allLatest.push(cityData[cityData.length - 1]);
      }
    });

    // If no data, return a default
    if (allLatest.length === 0) {
      return {
        date: new Date().toISOString().split("T")[0],
        city: "Mumbai",
        state: "Maharashtra",
        maxTemp: 32,
        minTemp: 22,
        avgTemp: 27,
        humidity: 70,
        rainfall: 0,
        windSpeed: 8,
        aqi: 150,
        aqiCategory: "Moderate",
        pressure: 1015,
        cloudCover: 40,
      };
    }

    return allLatest;
  }

  async getWeatherByMonthYear(city: string, year: number, month: number): Promise<IndianWeatherData[]> {
    const cityKey = city.toLowerCase();
    const cityData = this.indianWeatherData.get(cityKey);
    if (!cityData || cityData.length === 0) return [];

    return cityData.filter((row) => {
      const d = new Date(row.date);
      if (isNaN(d.getTime())) return false;
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }

  async getWeatherByDateRange(city: string, from: string, to: string): Promise<IndianWeatherData[]> {
    const cityKey = city.toLowerCase();
    const cityData = this.indianWeatherData.get(cityKey);
    if (!cityData || cityData.length === 0) return [];

    return cityData.filter((row) => {
      const date = row.date;
      return date >= from && date <= to;
    });
  }

  async getWeatherForecast(city: string, days: number): Promise<WeatherForecastDay[]> {
    const cityKey = city.toLowerCase();
    const cityData = this.indianWeatherData.get(cityKey);
    if (!cityData || cityData.length === 0) {
      return this.generateSyntheticForecast(city, days, null);
    }
    const sorted = [...cityData].sort((a, b) => b.date.localeCompare(a.date));
    const lastWeek = sorted.slice(0, Math.min(7, sorted.length));
    return this.generateSyntheticForecast(city, days, lastWeek);
  }

  private generateSyntheticForecast(
    city: string,
    days: number,
    lastWeek: IndianWeatherData[] | null
  ): WeatherForecastDay[] {
    const result: WeatherForecastDay[] = [];
    let baseDate: Date;
    let avgT = 28;
    let minT = 22;
    let maxT = 34;
    let rain = 0;
    let aqi = 80;

    if (lastWeek && lastWeek.length > 0) {
      const n = lastWeek.length;
      avgT = lastWeek.reduce((s, d) => s + d.avgTemp, 0) / n;
      minT = lastWeek.reduce((s, d) => s + d.minTemp, 0) / n;
      maxT = lastWeek.reduce((s, d) => s + d.maxTemp, 0) / n;
      rain = lastWeek.reduce((s, d) => s + d.rainfall, 0) / n;
      aqi = lastWeek.reduce((s, d) => s + d.aqi, 0) / n;
      const lastDate = new Date(lastWeek[lastWeek.length - 1].date);
      baseDate = new Date(lastDate);
      baseDate.setDate(baseDate.getDate() + 1);
    } else {
      baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + 1);
    }

    const pad = (n: number) => String(n).padStart(2, "0");
    for (let i = 0; i < days; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const delta = () => (Math.random() - 0.5) * 1;
      result.push({
        date: dateStr,
        avgTemp: Math.round((avgT + delta()) * 10) / 10,
        minTemp: Math.round((minT + delta()) * 10) / 10,
        maxTemp: Math.round((maxT + delta()) * 10) / 10,
        rainfall: Math.max(0, Math.round((rain + Math.random() * 2) * 10) / 10),
        aqi: Math.round(aqi + (Math.random() - 0.5) * 20),
      });
    }
    return result;
  }

  async getWeatherYearSummary(city: string, year: number): Promise<MonthSummary[]> {
    const result: MonthSummary[] = [];
    for (let month = 1; month <= 12; month++) {
      const daily = await this.getWeatherByMonthYear(city, year, month);
      if (daily.length === 0) {
        result.push({ month, avgTemp: 0, totalRainfall: 0, avgAqi: 0 });
        continue;
      }
      const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
      const avg = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);
      result.push({
        month,
        avgTemp: avg(daily.map((d) => d.avgTemp)),
        totalRainfall: sum(daily.map((d) => d.rainfall)),
        avgAqi: avg(daily.map((d) => d.aqi)),
      });
    }
    return result;
  }

  async getMonthlyHistoricalSummaries(city: string): Promise<MonthlyHistoricalSummary[]> {
    const cityKey = city.toLowerCase();
    const cityData = this.indianWeatherData.get(cityKey);
    if (!cityData || cityData.length === 0) return [];

    const byKey = new Map<string, IndianWeatherData[]>();
    for (const row of cityData) {
      const d = new Date(row.date);
      if (isNaN(d.getTime())) continue;
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${month}`;
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key)!.push(row);
    }

    const result: MonthlyHistoricalSummary[] = [];
    const entries = Array.from(byKey.entries());
    for (const [key, daily] of entries) {
      const [y, m] = key.split("-").map(Number);
      const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
      const avg = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);
      const rainDays = daily.filter((d: IndianWeatherData) => (d.rainfall ?? 0) > 0).length;
      const daysInMonth = new Date(y, m, 0).getDate();
      result.push({
        year: y,
        month: m,
        totalRainfall: sum(daily.map((d: IndianWeatherData) => d.rainfall)),
        avgTemp: avg(daily.map((d: IndianWeatherData) => d.avgTemp)),
        rainDays,
        daysInMonth,
      });
    }
    return result.sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
  }

  async getWeatherForecastMonth(
    city: string,
    year: number,
    month: number
  ): Promise<MonthForecastResponse | null> {
    const cityKey = city.toLowerCase();
    if (!this.indianWeatherData.has(cityKey)) return null;

    const historical = await this.getMonthlyHistoricalSummaries(city);
    const sameMonth = historical.filter((h) => h.month === month);
    const currentYear = new Date().getFullYear();
    const isPastOrCurrent = year < currentYear || (year === currentYear && month <= new Date().getMonth() + 1);

    if (isPastOrCurrent) {
      const exact = historical.find((h) => h.year === year && h.month === month);
      if (exact) {
        const willItRain = exact.rainDays > 0 || exact.totalRainfall > 0;
        const summary = `Historical data for ${month}/${year}: ${exact.totalRainfall.toFixed(1)} mm total rainfall, ~${exact.rainDays} rain days.`;
        return {
          year,
          month,
          predictedTotalRainfall: exact.totalRainfall,
          predictedAvgTemp: exact.avgTemp,
          predictedRainDays: exact.rainDays,
          willItRain,
          summary,
          basedOnYears: [year],
        };
      }
    }

    if (sameMonth.length === 0) {
      return {
        year,
        month,
        predictedTotalRainfall: 0,
        predictedAvgTemp: 0,
        predictedRainDays: 0,
        willItRain: false,
        summary: "Insufficient historical data for this month.",
        basedOnYears: [],
      };
    }

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    const avg = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);
    const totalRainfall = avg(sameMonth.map((h) => h.totalRainfall));
    const avgTemp = avg(sameMonth.map((h) => h.avgTemp));
    const rainDaysAvg = avg(sameMonth.map((h) => h.rainDays));
    const daysInMonth = new Date(year, month, 0).getDate();
    const predictedRainDays = Math.round(rainDaysAvg);
    const willItRain = predictedRainDays >= 1 || totalRainfall > 0;
    const basedOnYears = Array.from(new Set(sameMonth.map((h) => h.year))).sort((a, b) => a - b);
    const rainfalls = sameMonth.map((h) => h.totalRainfall);
    const lowerBoundRainfall = Math.min(...rainfalls);
    const upperBoundRainfall = Math.max(...rainfalls);
    const summary = `Expected rainfall in ${month}/${year}: ~${totalRainfall.toFixed(1)} mm; rain likely on ~${predictedRainDays} days (based on ${basedOnYears.join(", ")}).`;

    return {
      year,
      month,
      predictedTotalRainfall: totalRainfall,
      predictedAvgTemp: avgTemp,
      predictedRainDays,
      willItRain,
      summary,
      basedOnYears,
      lowerBoundRainfall,
      upperBoundRainfall,
    };
  }

  async getWeatherForecastYear(city: string, year: number): Promise<MonthlyForecastPoint[]> {
    const result: MonthlyForecastPoint[] = [];
    for (let month = 1; month <= 12; month++) {
      const forecast = await this.getWeatherForecastMonth(city, year, month);
      if (!forecast) continue;
      result.push({
        month: forecast.month,
        year: forecast.year,
        predictedTotalRainfall: forecast.predictedTotalRainfall,
        predictedAvgTemp: forecast.predictedAvgTemp,
        predictedRainDays: forecast.predictedRainDays,
        lowerBoundRainfall: forecast.lowerBoundRainfall,
        upperBoundRainfall: forecast.upperBoundRainfall,
      });
    }
    return result;
  }

  async getWeatherForecastMonthDaily(
    city: string,
    year: number,
    month: number
  ): Promise<IndianWeatherData[]> {
    const cityKey = city.toLowerCase();
    const cityData = this.indianWeatherData.get(cityKey);
    if (!cityData || cityData.length === 0) return [];

    const existing = await this.getWeatherByMonthYear(city, year, month);
    if (existing.length > 0) return existing;

    const forecast = await this.getWeatherForecastMonth(city, year, month);
    if (!forecast) return [];

    const daysInMonth = new Date(year, month, 0).getDate();
    const pad = (n: number) => String(n).padStart(2, "0");

    const historical = await this.getMonthlyHistoricalSummaries(city);
    const sameMonth = historical.filter((h) => h.month === month);
    let avgHumidity = 65;
    let avgWind = 10;
    let avgCloud = 50;
    let avgAqi = 80;

    if (sameMonth.length > 0) {
      const allDaily: IndianWeatherData[] = [];
      for (const h of sameMonth) {
        const daily = await this.getWeatherByMonthYear(city, h.year, h.month);
        allDaily.push(...daily);
      }
      if (allDaily.length > 0) {
        const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
        avgHumidity = sum(allDaily.map((d: IndianWeatherData) => d.humidity)) / allDaily.length;
        avgWind = sum(allDaily.map((d: IndianWeatherData) => d.windSpeed)) / allDaily.length;
        avgCloud = sum(allDaily.map((d: IndianWeatherData) => d.cloudCover)) / allDaily.length;
        avgAqi = sum(allDaily.map((d: IndianWeatherData) => d.aqi)) / allDaily.length;
      }
    }

    const rainDays = Math.max(0, Math.min(forecast.predictedRainDays, daysInMonth));
    const rainPerDay =
      rainDays > 0 && forecast.predictedTotalRainfall > 0
        ? forecast.predictedTotalRainfall / rainDays
        : 0;

    const result: IndianWeatherData[] = [];
    const firstCity = cityData[0];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${pad(month)}-${pad(day)}`;
      const isRainDay = day <= rainDays;
      const rainfall = isRainDay ? rainPerDay : 0;
      const variance = (Math.sin(day * 0.7) * 0.5 + 0.5) * 2;
      const avgTemp = forecast.predictedAvgTemp + (variance - 1);
      result.push({
        date: dateStr,
        city: firstCity.city,
        state: firstCity.state,
        maxTemp: avgTemp + 2,
        minTemp: avgTemp - 2,
        avgTemp,
        humidity: Math.round(avgHumidity + (Math.sin(day) * 5)),
        rainfall,
        windSpeed: Math.max(0, avgWind + (Math.sin(day * 0.3) * 3)),
        aqi: Math.round(avgAqi + (Math.sin(day * 0.5) * 15)),
        aqiCategory: firstCity.aqiCategory,
        pressure: firstCity.pressure,
        cloudCover: Math.max(0, Math.min(100, avgCloud + (Math.sin(day * 0.4) * 10))),
      });
    }
    return result;
  }
}

export const storage = new InMemoryStorage();

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

export interface IStorage {
  getSeries(variable: string, region: string): Promise<DataPoint[]>;
  insertClimateData(data: InsertClimateData): Promise<ClimateData>;
  bulkInsertClimateData(data: InsertClimateData[]): Promise<void>;
  getAllData(): Promise<ClimateData[]>;
  getLatestWeather(city?: string): Promise<IndianWeatherData | IndianWeatherData[]>;
  getWeatherByMonthYear(city: string, year: number, month: number): Promise<IndianWeatherData[]>;
  getWeatherByDateRange(city: string, from: string, to: string): Promise<IndianWeatherData[]>;
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
}

export const storage = new InMemoryStorage();

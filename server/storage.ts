import { climateData, type ClimateData, type InsertClimateData, type DataPoint, type ForecastPoint, type ForecastResponse } from "@shared/schema";

export interface IStorage {
  getSeries(variable: string, region: string): Promise<DataPoint[]>;
  insertClimateData(data: InsertClimateData): Promise<ClimateData>;
  bulkInsertClimateData(data: InsertClimateData[]): Promise<void>;
  getAllData(): Promise<ClimateData[]>;
}

// In-memory storage implementation
class InMemoryStorage implements IStorage {
  private data: ClimateData[] = [];
  private idCounter = 1;

  constructor() {
    // Initialize with sample climate data
    this.initializeSampleData();
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
}

export const storage = new InMemoryStorage();

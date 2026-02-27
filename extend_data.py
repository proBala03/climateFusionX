import pandas as pd
from datetime import datetime, timedelta
import numpy as np

# Read existing CSV
df = pd.read_csv('attached_assets/Indian_Climate_Dataset_2024_2025.csv')

# Get unique cities and states
cities_data = df[['City', 'State']].drop_duplicates().values
print(f"Cities in dataset: {len(cities_data)}")
print("Cities:", [c[0] for c in cities_data])

# Generate new data from 2026-01-01 to 2026-02-27
last_date = pd.to_datetime('2025-12-31')
target_date = pd.to_datetime('2026-02-27')

new_rows = []
current_date = last_date + timedelta(days=1)

# Set random seed for reproducibility
np.random.seed(42)

while current_date <= target_date:
    for city, state in cities_data:
        # Generate realistic climate data based on seasonal patterns
        month = current_date.month
        
        # Temperature ranges for February (winter in India)
        if month == 1:  # January
            max_temp = np.random.uniform(28, 34)
            min_temp = np.random.uniform(12, 20)
        else:  # February
            max_temp = np.random.uniform(30, 36)
            min_temp = np.random.uniform(14, 22)
        
        avg_temp = (max_temp + min_temp) / 2
        humidity = np.random.uniform(35, 75)
        rainfall = np.random.choice([0, 0, 0, 0, 0, np.random.uniform(0.1, 5)])  # Mostly dry
        wind_speed = np.random.uniform(5, 20)
        aqi = np.random.uniform(50, 200)
        
        # AQI Category
        if aqi < 50:
            aqi_cat = 'Good'
        elif aqi < 100:
            aqi_cat = 'Satisfactory'
        elif aqi < 200:
            aqi_cat = 'Moderate'
        elif aqi < 300:
            aqi_cat = 'Poor'
        else:
            aqi_cat = 'Very Poor'
        
        pressure = np.random.uniform(1000, 1015)
        cloud_cover = np.random.uniform(10, 60)
        
        row = {
            'Date': current_date.strftime('%Y-%m-%d'),
            'City': city,
            'State': state,
            'Temperature_Max (°C)': round(max_temp, 1),
            'Temperature_Min (°C)': round(min_temp, 1),
            'Temperature_Avg (°C)': round(avg_temp, 1),
            'Humidity (%)': round(humidity, 1),
            'Rainfall (mm)': round(rainfall, 1),
            'Wind_Speed (km/h)': round(wind_speed, 1),
            'AQI': int(aqi),
            'AQI_Category': aqi_cat,
            'Pressure (hPa)': round(pressure, 1),
            'Cloud_Cover (%)': round(cloud_cover, 1)
        }
        new_rows.append(row)
    
    current_date += timedelta(days=1)

# Create new dataframe
new_df = pd.DataFrame(new_rows)

# Combine with existing data
combined_df = pd.concat([df, new_df], ignore_index=True)

# Save to CSV
combined_df.to_csv('attached_assets/Indian_Climate_Dataset_2024_2025.csv', index=False)

print(f"\nExtended dataset to {target_date.strftime('%Y-%m-%d')}")
print(f"Total rows: {len(combined_df)}")
print(f"Date range: {combined_df['Date'].min()} to {combined_df['Date'].max()}")
print(f"Cities: {combined_df['City'].nunique()}")

# Show last few rows
print("\nLast 5 rows:")
print(combined_df.tail())

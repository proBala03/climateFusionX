// ============================================================================
// CLIMATE BACKGROUND COMPONENT - Quick Reference
// ============================================================================
// Location: client/src/components/ClimateBackground.tsx
// ============================================================================

export function ClimateBackground({ condition, isLoading = false }) {
  // 1. Dynamic rendering based on weather condition
  const renderWeatherElements = () => {
    switch (condition) {
      case "Rainy":     return <RainyBackground />;      // 50 falling droplets
      case "Sunny":     return <SunnyBackground />;      // Pulsing sun glow
      case "Cloudy":    return <CloudyBackground />;     // Drifting clouds
      case "Humid":     return <HumidBackground />;      // Floating mist
      case "Partly Cloudy": return <PartlyCloudyBackground />; // Subtle clouds
    }
  };

  // 2. Smooth 300ms transition when condition changes
  // 3. Animated emoji badge at top center
  // 4. Full-screen background (position: fixed, z-index: 0)

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient background with smooth transition */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} 
        transition-all duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} />

      {/* Weather animations (rain/sun/clouds/etc) */}
      {renderWeatherElements()}

      {/* Climate badge with emoji */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 px-6 py-3 rounded-full">
          <span className="text-3xl animate-bounce-gentle">{emoji}</span>
          <p className="text-sm font-semibold">{condition}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CLIMATE DETECTION UTILITY - Quick Reference
// ============================================================================
// Location: client/src/lib/climate-utils.ts
// ============================================================================

export function getClimateCondition(data: WeatherData): ClimateCondition {
  const { rainfall, humidity, avgTemp } = data;

  if (rainfall > 5)              return "Rainy";      // Heavy rain
  if (rainfall > 0)              return "Cloudy";     // Light rain/mist
  if (rainfall === 0 && avgTemp >= 30) return "Sunny"; // Hot & dry
  if (humidity > 75)             return "Humid";      // Humid conditions
  return "Partly Cloudy";         // Default
}

// Color schemes for each condition
export function getClimateColors(condition: ClimateCondition) {
  return {
    Rainy: { bg: "from-blue-500/20 to-slate-500/20", ... },
    Sunny: { bg: "from-yellow-400/20 to-orange-400/20", ... },
    // ... etc
  };
}

// ============================================================================
// CUSTOM HOOK - useLatestWeather
// ============================================================================
// Location: client/src/hooks/use-latest-weather.ts
// ============================================================================

export function useLatestWeather(city?: string) {
  const [condition, setCondition] = useState<ClimateCondition>("Partly Cloudy");
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch from /api/weather/latest/:city or /api/weather/latest
    const response = await fetch(url);
    const weatherData = await response.json();

    // Determine climate condition
    const climateCondition = getClimateCondition(formatted);
    
    // Update state
    setCondition(climateCondition);
    setData(formatted);

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [city]);

  return { condition, data, isLoading, error, city };
}

// ============================================================================
// CSS ANIMATIONS
// ============================================================================
// Location: client/src/index.css
// ============================================================================

@keyframes falling {
  to {
    transform: translateY(100vh);
    opacity: 0;
  }
}

@keyframes cloud-drift {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

@keyframes sun-glow {
  0%, 100% {
    box-shadow: 0 0 40px 20px rgba(250, 204, 21, 0.4);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 60px 30px rgba(250, 204, 21, 0.3);
    transform: scale(1.05);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
  50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
}

@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

// ============================================================================
// DASHBOARD INTEGRATION
// ============================================================================
// Location: client/src/pages/Dashboard.tsx
// ============================================================================

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const { condition, data, isLoading } = useLatestWeather(selectedCity);

  return (
    <div className="min-h-screen relative p-4 md:p-8">
      {/* Climate animated background */}
      <ClimateBackground condition={condition} isLoading={isLoading} />

      {/* Rest of dashboard... */}
      
      {/* City selector */}
      <Select 
        label="Indian City"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        options={CITY_OPTIONS}
      />

      {/* Current weather card */}
      {data && (
        <div>
          <p>Location: {data.city}, {data.state}</p>
          <p>Temperature: {data.avgTemp}°C</p>
          <p>Humidity: {data.humidity}%</p>
          <p>Rainfall: {data.rainfall}mm</p>
          <p>Condition: {condition}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// BACKEND API ENDPOINTS
// ============================================================================
// Location: server/routes.ts
// ============================================================================

app.get('/api/weather/latest', async (req, res) => {
  // GET /api/weather/latest
  // Returns latest weather for first/random city
  const weatherData = await storage.getLatestWeather();
  res.json(weatherData);
});

app.get('/api/weather/latest/:city', async (req, res) => {
  // GET /api/weather/latest/Mumbai
  // Returns latest weather for specific city
  const { city } = req.params;
  const weatherData = await storage.getLatestWeather(city);
  res.json(weatherData);
});

// ============================================================================
// DATA FLOW
// ============================================================================

// 1. User selects city in Dashboard
//    ↓
// 2. useLatestWeather hook fetches GET /api/weather/latest/:city
//    ↓
// 3. Backend loads from Indian_Climate_Dataset_2024_2025.csv memory cache
//    ↓
// 4. Returns latest weather data for city
//    ↓
// 5. getClimateCondition() determines weather type (Rainy/Sunny/etc)
//    ↓
// 6. ClimateBackground renders appropriate animation
//    ↓
// 7. 300ms fade transition when climate condition changes
//    ↓
// 8. Animated emoji badge + weather elements update

// ============================================================================
// WEATHER DETECTION LOGIC
// ============================================================================

RAINFALL = data.rainfall_mm
HUMIDITY = data.humidity_%
TEMP = data.avg_temp_c

IF rainfall > 5mm:
  WEATHER = "Rainy" 🌧️
  ANIMATION = 50 falling droplets
  COLORS = blue/slate gradient

ELSE IF rainfall > 0mm:
  WEATHER = "Cloudy" ☁️
  ANIMATION = 3 drifting clouds
  COLORS = slate/gray gradient

ELSE IF rainfall == 0 AND temp >= 30°C:
  WEATHER = "Sunny" ☀️
  ANIMATION = pulsing sun glow
  COLORS = yellow/orange gradient

ELSE IF humidity > 75%:
  WEATHER = "Humid" 💧
  ANIMATION = floating mist particles
  COLORS = cyan/blue gradient

ELSE:
  WEATHER = "Partly Cloudy" ⛅
  ANIMATION = subtle drifting clouds
  COLORS = orange/blue gradient

// ============================================================================
// ANIMATION DETAILS
// ============================================================================

RAINY:
  - 50 divs with 0.5-1.5px width
  - Fall duration: 0.5-0.8s (randomized)
  - Y-transform: -10vh to 110vh
  - Opacity: 0 → 1 → 0
  - Random left position: 0-100%

SUNNY:
  - Single sun element at top-right
  - Pulse animation: scale(1) → scale(1.05) → scale(1)  
  - Duration: 4s
  - Box-shadow: 40px 20px with opacity change
  - Filter: blur effect

CLOUDY:
  - 3 cloud elements
  - Drift X: -100% to 200%
  - Duration: 8-14s (each different)
  - Opacity: 30% (background)
  - Vertical offset: top-1/4

HUMID:
  - 30 particles (1-4px size)
  - Float animation: both Y and X translate
  - Duration: 4-7s per particle
  - Opacity pulse: 0.3 → 0.6 → 0.3

PARTLY CLOUDY:
  - 2 subtle clouds
  - Slower drift: 12-15s
  - Opacity: 20% (very subtle)
  - Warm orange/yellow colors

// ============================================================================
// PERFORMANCE NOTES
// ============================================================================

✓ Uses CSS keyframes (GPU accelerated)
✓ Transform-only animations (no layout thrashing)
✓ Position: fixed (no scroll impact)
✓ Pointer-events: none (no interaction blocking)
✓ 50-80 DOM elements maximum
✓ Data refresh: 5 minutes (configurable)
✓ Memory efficient: CSV loaded once at startup
✓ Dark mode support via Tailwind dark: prefix

// ============================================================================

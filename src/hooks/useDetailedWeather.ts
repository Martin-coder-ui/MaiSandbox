import { useState, useEffect } from 'react';
import { useGeolocation } from './useGeolocation';

interface WeatherForecast {
  date: Date;
  temperature: {
    min: number;
    max: number;
    feelsLike: number;
  };
  conditions: string;
  precipitation: {
    chance: number;
    amount: number;
  };
  wind: {
    speed: number;
    direction: string;
  };
  humidity: number;
  uvIndex: number;
  clothingRecommendation: string;
  healthWarnings: string[];
}

interface DetailedWeatherData {
  current: WeatherForecast;
  forecast: WeatherForecast[];
  alerts: string[];
  lastUpdated: Date;
}

export const useDetailedWeather = () => {
  const { location } = useGeolocation();
  const [weatherData, setWeatherData] = useState<DetailedWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWeatherForecast = (baseTemp: number, city: string): DetailedWeatherData => {
    const today = new Date();
    const forecast: WeatherForecast[] = [];
    const alerts: string[] = [];

    // Generate 7-day forecast with realistic UK weather patterns
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Simulate temperature fluctuations (your scenario about weather falling and rising)
      let dayTemp = baseTemp;
      if (i === 1) dayTemp -= 8; // Sudden drop tomorrow
      if (i === 2) dayTemp -= 5; // Still cool
      if (i === 3) dayTemp += 3; // Starting to warm up
      if (i === 4) dayTemp += 8; // Much warmer
      if (i === 5) dayTemp += 2; // Slight increase
      if (i === 6) dayTemp -= 3; // Cooling again

      const minTemp = dayTemp - 5;
      const maxTemp = dayTemp + 3;
      const feelsLike = dayTemp - (i === 1 ? 6 : 2); // Wind chill effect on the cold day

      // Weather conditions based on temperature and patterns
      let conditions = 'partly-cloudy';
      let precipChance = 20;
      let precipAmount = 0;
      let windSpeed = 15;
      
      if (i === 1 || i === 2) {
        conditions = 'rainy';
        precipChance = 80;
        precipAmount = 5.2;
        windSpeed = 25; // Stronger winds during storm
      } else if (i === 4) {
        conditions = 'sunny';
        precipChance = 10;
      }

      // Simulate extreme weather conditions
      if (city.includes('Edinburgh') && i === 1) {
        windSpeed = 35; // Strong winds in Scotland
        alerts.push(`🌪️ Strong wind warning for ${city} - gusts up to 35mph expected`);
      }

      if (city.includes('Manchester') && i === 2) {
        precipAmount = 8.5; // Heavy rain
        alerts.push(`🌊 Heavy rainfall warning for ${city} - potential flooding risk`);
      }

      const uvIndex = conditions === 'sunny' ? 6 : conditions === 'partly-cloudy' ? 4 : 2;

      // Enhanced clothing recommendations based on temperature and conditions
      let clothingRecommendation = '';
      if (feelsLike < 0) {
        clothingRecommendation = 'EXTREME COLD: Heavy winter coat, thermal layers, waterproof boots, insulated gloves, warm hat, scarf';
      } else if (feelsLike < 5) {
        clothingRecommendation = 'Heavy coat, warm layers, waterproof boots, gloves and hat';
      } else if (feelsLike < 10) {
        clothingRecommendation = 'Warm jacket, layers, closed shoes, consider scarf';
      } else if (feelsLike < 15) {
        clothingRecommendation = 'Light jacket or cardigan, long pants, comfortable shoes';
      } else if (feelsLike < 20) {
        clothingRecommendation = 'Light sweater or long sleeves, jeans or trousers';
      } else if (feelsLike < 25) {
        clothingRecommendation = 'T-shirt, light pants or shorts, sandals or light shoes';
      } else {
        clothingRecommendation = 'HEAT WARNING: Light, breathable clothing, sun hat, plenty of water';
      }

      // Enhanced health warnings based on conditions
      const healthWarnings: string[] = [];
      if (feelsLike < 0) {
        healthWarnings.push('EXTREME COLD WARNING: Risk of frostbite and hypothermia');
        healthWarnings.push('Limit outdoor exposure time');
      } else if (feelsLike < 5) {
        healthWarnings.push('Risk of hypothermia - dress warmly');
        healthWarnings.push('Increased risk of cold and flu transmission');
      }
      
      if (precipChance > 70) {
        healthWarnings.push('High chance of rain - risk of getting wet and cold');
      }
      
      if (windSpeed > 30) {
        healthWarnings.push('Strong winds - risk of falling debris, avoid exposed areas');
      }
      
      if (uvIndex > 5) {
        healthWarnings.push('High UV exposure - use sun protection');
      }
      
      if (feelsLike > 25) {
        healthWarnings.push('Heat warning - stay hydrated, seek shade');
      }
      
      if (Math.abs(dayTemp - baseTemp) > 5) {
        healthWarnings.push('Significant temperature change - adjust clothing accordingly');
      }

      // Location-specific health warnings
      if (city.includes('Edinburgh') && windSpeed > 25) {
        healthWarnings.push('Edinburgh wind warning - secure loose items, avoid coastal areas');
      }

      forecast.push({
        date,
        temperature: { min: minTemp, max: maxTemp, feelsLike },
        conditions,
        precipitation: { chance: precipChance, amount: precipAmount },
        wind: { speed: windSpeed, direction: 'SW' },
        humidity: 60 + Math.random() * 30,
        uvIndex,
        clothingRecommendation,
        healthWarnings
      });
    }

    // Generate comprehensive alerts based on forecast
    if (forecast[1].temperature.feelsLike < forecast[0].temperature.feelsLike - 5) {
      alerts.push(`⚠️ Significant temperature drop expected tomorrow in ${city} - from ${Math.round(forecast[0].temperature.feelsLike)}°C to ${Math.round(forecast[1].temperature.feelsLike)}°C`);
    }

    if (forecast.some(f => f.precipitation.chance > 70)) {
      alerts.push(`🌧️ Heavy rain expected in ${city} - carry waterproof clothing`);
    }

    if (forecast.some(f => f.uvIndex > 6)) {
      alerts.push(`☀️ High UV levels expected in ${city} - use sun protection`);
    }

    if (forecast.some(f => f.wind.speed > 30)) {
      alerts.push(`💨 Strong winds expected in ${city} - secure outdoor items`);
    }

    // Temperature fluctuation warning (your scenario)
    const tempRange = Math.max(...forecast.map(f => f.temperature.max)) - Math.min(...forecast.map(f => f.temperature.min));
    if (tempRange > 15) {
      alerts.push(`🌡️ Large temperature variations expected in ${city} over the next week - be prepared for changing conditions`);
    }

    // Frost warning
    if (forecast.some(f => f.temperature.min < 2)) {
      alerts.push(`❄️ Frost warning for ${city} - protect plants and pipes`);
    }

    // Heat warning
    if (forecast.some(f => f.temperature.max > 30)) {
      alerts.push(`🔥 Heat warning for ${city} - temperatures reaching 30°C+, stay hydrated`);
    }

    return {
      current: forecast[0],
      forecast,
      alerts,
      lastUpdated: new Date()
    };
  };

  const fetchWeatherData = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = generateWeatherForecast(location.weather?.temperature || 15, location.city);
      setWeatherData(data);
      
      // Cache the data
      localStorage.setItem('mai_weather_data', JSON.stringify(data));
    } catch (err) {
      setError('Failed to fetch weather data');
      
      // Try to load cached data
      const cached = localStorage.getItem('mai_weather_data');
      if (cached) {
        try {
          setWeatherData(JSON.parse(cached));
        } catch (e) {
          console.error('Failed to parse cached weather data');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getClothingAlert = () => {
    if (!weatherData) return null;
    
    const tomorrow = weatherData.forecast[1];
    const today = weatherData.current;
    
    if (Math.abs(tomorrow.temperature.feelsLike - today.temperature.feelsLike) > 5) {
      return {
        type: 'clothing-change',
        message: `Temperature changing from ${Math.round(today.temperature.feelsLike)}°C to ${Math.round(tomorrow.temperature.feelsLike)}°C tomorrow`,
        recommendation: tomorrow.clothingRecommendation
      };
    }
    
    return null;
  };

  const getHealthAlerts = () => {
    if (!weatherData) return [];
    
    const alerts: string[] = [];
    
    // Check next 3 days for health-related weather warnings
    weatherData.forecast.slice(0, 3).forEach((day, index) => {
      day.healthWarnings.forEach(warning => {
        const dayLabel = index === 0 ? 'today' : index === 1 ? 'tomorrow' : 'in 2 days';
        alerts.push(`${dayLabel}: ${warning}`);
      });
    });
    
    return alerts;
  };

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  // Refresh weather data every 2 hours
  useEffect(() => {
    const interval = setInterval(() => {
      if (location) {
        fetchWeatherData();
      }
    }, 2 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [location]);

  return {
    weatherData,
    loading,
    error,
    refreshData: fetchWeatherData,
    getClothingAlert,
    getHealthAlerts
  };
};
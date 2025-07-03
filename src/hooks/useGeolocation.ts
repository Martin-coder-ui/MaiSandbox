import { useState, useEffect } from 'react';

interface GeolocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  region: string;
  timezone: string;
  weather?: {
    temperature: number;
    condition: string;
    humidity: number;
    uvIndex: number;
  };
}

interface GeolocationHook {
  location: GeolocationData | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export const useGeolocation = (): GeolocationHook => {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocationFromCoords = async (latitude: number, longitude: number): Promise<GeolocationData> => {
    // In a real app, you'd use a geocoding service like Google Maps API
    // For demo purposes, we'll simulate based on common UK coordinates
    let locationData: GeolocationData = {
      latitude,
      longitude,
      city: 'London',
      country: 'United Kingdom',
      region: 'England',
      timezone: 'Europe/London',
      weather: {
        temperature: 18,
        condition: 'partly-cloudy',
        humidity: 65,
        uvIndex: 4
      }
    };

    // Simulate different UK locations based on coordinates
    if (latitude > 55.8) {
      locationData.city = 'Edinburgh';
      locationData.region = 'Scotland';
      locationData.weather!.temperature = 15;
    } else if (latitude > 53.4 && longitude < -2.2) {
      locationData.city = 'Manchester';
      locationData.region = 'England';
      locationData.weather!.temperature = 16;
    } else if (latitude > 52.4 && longitude > -1.9) {
      locationData.city = 'Birmingham';
      locationData.region = 'England';
      locationData.weather!.temperature = 17;
    }

    return locationData;
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationData = await getLocationFromCoords(latitude, longitude);
          setLocation(locationData);
          
          // Save to localStorage for future use
          localStorage.setItem('mai_user_location', JSON.stringify(locationData));
        } catch (err) {
          setError('Failed to get location details');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(`Location access denied: ${err.message}`);
        setLoading(false);
        
        // Fallback to saved location or default to London
        const savedLocation = localStorage.getItem('mai_user_location');
        if (savedLocation) {
          try {
            setLocation(JSON.parse(savedLocation));
          } catch (e) {
            // Default to London if parsing fails
            setLocation({
              latitude: 51.5074,
              longitude: -0.1278,
              city: 'London',
              country: 'United Kingdom',
              region: 'England',
              timezone: 'Europe/London',
              weather: {
                temperature: 18,
                condition: 'partly-cloudy',
                humidity: 65,
                uvIndex: 4
              }
            });
          }
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  useEffect(() => {
    // Try to load saved location on mount
    const savedLocation = localStorage.getItem('mai_user_location');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.error('Failed to parse saved location');
      }
    }
  }, []);

  return { location, loading, error, requestLocation };
};
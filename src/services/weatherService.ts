const API_KEY = '7d61014656e038485a4c316375a93e66';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Mock weather data for fallback
const generateMockWeatherData = (city: string): WeatherData => {
  const weatherConditions = [
    { main: 'Clear', description: 'clear sky', id: 800, icon: '01d' },
    { main: 'Clouds', description: 'scattered clouds', id: 802, icon: '03d' },
    { main: 'Rain', description: 'light rain', id: 500, icon: '10d' },
    { main: 'Drizzle', description: 'light intensity drizzle', id: 300, icon: '09d' },
    { main: 'Thunderstorm', description: 'thunderstorm with light rain', id: 200, icon: '11d' },
    { main: 'Snow', description: 'light snow', id: 600, icon: '13d' },
    { main: 'Mist', description: 'mist', id: 701, icon: '50d' },
    { main: 'Fog', description: 'fog', id: 741, icon: '50d' }
  ];

  const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  const temp = Math.floor(Math.random() * 30) + 10; // Temperature between 10-40°C
  const humidity = Math.floor(Math.random() * 40) + 40; // Humidity between 40-80%
  const windSpeed = Math.floor(Math.random() * 10) + 1; // Wind speed between 1-11 m/s

  return {
    coord: {
      lon: Math.random() * 180 - 90,
      lat: Math.random() * 90 - 45
    },
    weather: [randomWeather],
    base: 'stations',
    main: {
      temp: temp,
      feels_like: temp + Math.floor(Math.random() * 5) - 2,
      temp_min: temp - 3,
      temp_max: temp + 3,
      pressure: Math.floor(Math.random() * 200) + 1000,
      humidity: humidity
    },
    visibility: Math.floor(Math.random() * 5000) + 5000,
    wind: {
      speed: windSpeed,
      deg: Math.floor(Math.random() * 360)
    },
    clouds: {
      all: Math.floor(Math.random() * 100)
    },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      country: 'IN',
      sunrise: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
      sunset: Math.floor(Date.now() / 1000) + 21600   // 6 hours from now
    },
    timezone: 19800, // IST
    id: Math.floor(Math.random() * 1000000),
    name: city,
    cod: 200
  };
};

export const getWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      console.warn(`Weather API error: ${response.status}. Using mock data for ${city}`);
      return generateMockWeatherData(city);
    }
    
    const data = await response.json();
    console.log('Weather data:', data);
    return data;
  } catch (error) {
    console.warn('Error fetching weather data, using mock data:', error);
    return generateMockWeatherData(city);
  }
};

export const getForecastData = async (city: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      console.warn(`Forecast API error: ${response.status}. Using mock data for ${city}`);
      return { list: [generateMockWeatherData(city)] };
    }
    
    const data = await response.json();
    console.log('Forecast data:', data);
    return data;
  } catch (error) {
    console.warn('Error fetching forecast data, using mock data:', error);
    return { list: [generateMockWeatherData(city)] };
  }
};


import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getWeatherData, WeatherData } from '../services/weatherService';
import { getLocationData, LocationData } from '../data/locations';
import PlaceInfo from './PlaceInfo';
import WeatherEffects from './WeatherEffects';
const weatherEmojis: Record<string, string> = {
  clear: '☀️',
  clouds: '☁️',
  rain: '🌧️',
  drizzle: '🌦️',
  thunderstorm: '⛈️',
  snow: '❄️',
  mist: '🌫️',
  fog: '🌫️',
  haze: '🌫️',
  smoke: '💨',
  dust: '🌪️',
  sand: '🏜️',
  ash: '🌋',
  squall: '🌬️',
  tornado: '🌪️',
};

const WeatherApp = () => {
  const [location, setLocation] = useState('Mumbai');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      const weather = await getWeatherData(city);
      const locData = getLocationData(city);
      setWeatherData(weather);
      setLocationData(locData);
      setLocation(city);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('Mumbai');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
      setSearchInput('');
    }
  };

  const getWeatherBackground = () => {
    if (!weatherData) return 'from-blue-400 via-blue-500 to-blue-600';
    
    const weather = weatherData.weather[0].main.toLowerCase();
    const isNight = new Date().getHours() >= 18 || new Date().getHours() <= 6;
    
    switch (weather) {
      case 'rain':
      case 'drizzle':
        return isNight 
          ? 'from-gray-800 via-slate-700 to-blue-900'
          : 'from-gray-400 via-blue-400 to-blue-600';
      case 'thunderstorm':
        return 'from-gray-900 via-purple-900 to-black';
      case 'snow':
        return isNight
          ? 'from-blue-900 via-indigo-800 to-slate-800'
          : 'from-blue-100 via-white to-blue-200';
      case 'clouds':
        return isNight
          ? 'from-gray-700 via-gray-600 to-gray-800'
          : 'from-gray-200 via-gray-300 to-gray-400';
      case 'clear':
        return isNight
          ? 'from-indigo-900 via-purple-900 to-black'
          : 'from-yellow-200 via-orange-300 to-blue-400';
      case 'mist':
      case 'fog':
        return isNight
          ? 'from-gray-800 via-gray-700 to-gray-900'
          : 'from-gray-300 via-gray-200 to-gray-300';
      default:
        return isNight
          ? 'from-indigo-900 via-purple-900 to-black'
          : 'from-blue-400 via-blue-500 to-blue-600';
    }
  };

  const isNight = new Date().getHours() >= 18 || new Date().getHours() <= 6;
  const popularCities = [
    'Mumbai', 'Hyderabad', 'Vijayawada', 'Visakhapatnam', 
    'Guntur', 'Nellore', 'Chittoor', 'Anantapur',
    'Paris', 'New York', 'Tokyo', 'London', 'Dubai', 'Sydney'
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getWeatherBackground()} relative overflow-hidden transition-all duration-1000 ease-in-out`}>
      {/* Dynamic Weather Effects */}
      {weatherData && (
        <WeatherEffects 
          weatherCondition={weatherData.weather[0].main} 
          isNight={isNight}
        />
      )}
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in drop-shadow-2xl">
            🌤️ WeatherVerse
          </h1>
          <p className="text-xl text-white/90 animate-fade-in drop-shadow-lg">
            Experience the world's weather with immersive backgrounds
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for a city..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 bg-white/90 border-white/50 backdrop-blur-sm"
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                Search
              </Button>
            </form>
            
            {/* Popular Cities */}
            <div className="flex flex-wrap gap-2">
              <span className="text-white text-sm font-medium mr-2">Popular:</span>
              {popularCities.map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  size="sm"
                  onClick={() => fetchWeather(city)}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs backdrop-blur-sm"
                >
                  {city}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="w-full space-y-6">
          {/* Place Info Section */}
          <PlaceInfo 
            location={location}
            coordinates={locationData?.coordinates}
          />

          {/* Weather Info */}
          <div className="space-y-6">
            {weatherData && (
              <>
                {/* Main Weather Display */}
                <Card className="backdrop-blur-lg bg-white/15 border-white/20 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <MapPin className="w-6 h-6 text-white/80" />
                        <h2 className="text-3xl font-bold text-white drop-shadow-lg">{location}</h2>
                      </div>
                      
                      <div className="text-8xl mb-4 drop-shadow-lg">
                        {weatherEmojis[weatherData.weather[0].main.toLowerCase()] || '🌤️'}
                      </div>
                      
                      <div className="text-6xl font-bold text-white drop-shadow-lg mb-2">
                        {Math.round(weatherData.main.temp)}°C
                      </div>
                      
                      <p className="text-2xl text-white/90 capitalize font-medium mb-2">
                        {weatherData.weather[0].description}
                      </p>
                      
                      <p className="text-lg text-white/70">
                        Feels like {Math.round(weatherData.main.feels_like)}°C
                      </p>
                      
                      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/20">
                        <div className="text-center">
                          <p className="text-sm text-white/60 mb-1">High</p>
                          <p className="text-xl font-semibold text-white">{Math.round(weatherData.main.temp_max)}°</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-white/60 mb-1">Low</p>
                          <p className="text-xl font-semibold text-white">{Math.round(weatherData.main.temp_min)}°</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weather Parameters Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Humidity */}
                  <Card className="backdrop-blur-lg bg-white/15 border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Droplets className="w-8 h-8 text-blue-300 mx-auto mb-3" />
                      <p className="text-sm text-white/70 uppercase tracking-wide font-medium mb-2">Humidity</p>
                      <p className="text-2xl font-bold text-white">{weatherData.main.humidity}%</p>
                    </CardContent>
                  </Card>

                  {/* Wind Speed */}
                  <Card className="backdrop-blur-lg bg-white/15 border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Wind className="w-8 h-8 text-green-300 mx-auto mb-3" />
                      <p className="text-sm text-white/70 uppercase tracking-wide font-medium mb-2">Wind Speed</p>
                      <p className="text-2xl font-bold text-white">{weatherData.wind.speed} m/s</p>
                    </CardContent>
                  </Card>

                  {/* Visibility */}
                  <Card className="backdrop-blur-lg bg-white/15 border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <Eye className="w-8 h-8 text-purple-300 mx-auto mb-3" />
                      <p className="text-sm text-white/70 uppercase tracking-wide font-medium mb-2">Visibility</p>
                      <p className="text-2xl font-bold text-white">{(weatherData.visibility / 1000).toFixed(1)} km</p>
                    </CardContent>
                  </Card>

                  {/* Pressure */}
                  <Card className="backdrop-blur-lg bg-white/15 border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">🌡️</div>
                      <p className="text-sm text-white/70 uppercase tracking-wide font-medium mb-2">Pressure</p>
                      <p className="text-2xl font-bold text-white">{weatherData.main.pressure} hPa</p>
                    </CardContent>
                  </Card>

                  {/* Wind Direction */}
                  <Card className="backdrop-blur-lg bg-white/15 border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">🧭</div>
                      <p className="text-sm text-white/70 uppercase tracking-wide font-medium mb-2">Wind Direction</p>
                      <p className="text-2xl font-bold text-white">{weatherData.wind.deg || 0}°</p>
                    </CardContent>
                  </Card>

                  {/* Cloud Cover */}
                  <Card className="backdrop-blur-lg bg-white/15 border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">☁️</div>
                      <p className="text-sm text-white/70 uppercase tracking-wide font-medium mb-2">Cloud Cover</p>
                      <p className="text-2xl font-bold text-white">{weatherData.clouds?.all || 0}%</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sun Times */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="backdrop-blur-lg bg-white/15 border-white/20 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">🌅</div>
                      <p className="text-sm text-white/70 uppercase tracking-wide font-medium mb-2">Sunrise</p>
                      <p className="text-xl font-bold text-white">
                        {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-lg bg-white/15 border-white/20 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">🌇</div>
                      <p className="text-sm text-white/70 uppercase tracking-wide font-medium mb-2">Sunset</p>
                      <p className="text-xl font-bold text-white">
                        {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {loading && (
              <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-8 bg-white/30 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-white/30 rounded"></div>
                      <div className="h-4 bg-white/30 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;

<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
  .font-cute {
    font-family: 'Fredoka One', cursive;
    letter-spacing: 0.5px;
  }
  .drop-shadow-cute {
    filter: drop-shadow(0 4px 24px rgba(255, 182, 193, 0.25));
  }
  @keyframes bounce-cute {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px) scale(1.1); }
  }
  .animate-bounce-cute {
    animation: bounce-cute 1.6s infinite;
  }
`}</style>

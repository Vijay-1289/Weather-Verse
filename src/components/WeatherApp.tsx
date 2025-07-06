
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getWeatherData, WeatherData } from '../services/weatherService';
import { getLocationData, LocationData } from '../data/locations';
import GoogleEarthView from './GoogleEarthView';

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
          ? 'from-gray-800 via-gray-700 to-slate-900'
          : 'from-gray-500 via-gray-600 to-gray-700';
      case 'thunderstorm':
        return 'from-gray-900 via-purple-900 to-black';
      case 'snow':
        return isNight
          ? 'from-blue-900 via-indigo-800 to-slate-800'
          : 'from-blue-100 via-blue-200 to-blue-300';
      case 'clouds':
        return isNight
          ? 'from-gray-700 via-gray-600 to-gray-800'
          : 'from-gray-300 via-gray-400 to-gray-500';
      case 'clear':
        return isNight
          ? 'from-indigo-900 via-purple-900 to-black'
          : 'from-blue-400 via-sky-500 to-cyan-400';
      case 'mist':
      case 'fog':
        return isNight
          ? 'from-gray-800 via-gray-700 to-gray-900'
          : 'from-gray-400 via-gray-300 to-gray-400';
      default:
        return isNight
          ? 'from-indigo-900 via-purple-900 to-black'
          : 'from-blue-400 via-blue-500 to-blue-600';
    }
  };

  const getWeatherOverlay = () => {
    if (!weatherData) return '';
    
    const weather = weatherData.weather[0].main.toLowerCase();
    
    switch (weather) {
      case 'rain':
      case 'drizzle':
        return (
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-blue-900/40"></div>
            {/* Rain effect */}
            <div className="absolute inset-0 opacity-30">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-px h-8 bg-blue-300 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${0.5 + Math.random() * 1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        );
      case 'thunderstorm':
        return (
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-gray-900/40 to-black/50"></div>
            {/* Lightning effect */}
            <div className="absolute inset-0 animate-pulse opacity-20">
              <div className="absolute top-10 left-1/4 w-1 h-20 bg-white transform rotate-12 animate-ping"></div>
              <div className="absolute top-20 right-1/3 w-1 h-16 bg-white transform -rotate-45 animate-ping"></div>
            </div>
          </div>
        );
      case 'snow':
        return (
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-blue-100/20 to-blue-200/30"></div>
            {/* Snow effect */}
            <div className="absolute inset-0 opacity-60">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        );
      case 'clouds':
        return (
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-200/20 via-gray-300/30 to-gray-400/20"></div>
          </div>
        );
      case 'mist':
      case 'fog':
        return (
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-400/30 via-gray-300/40 to-gray-400/30"></div>
            {/* Fog effect */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-0 bg-gray-300/20 animate-pulse"></div>
            </div>
          </div>
        );
      default:
        return '';
    }
  };

  const popularCities = ['Mumbai', 'Paris', 'New York', 'Tokyo', 'London', 'Dubai', 'Sydney'];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getWeatherBackground()} relative overflow-hidden`}>
      {getWeatherOverlay()}
      
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Satellite View */}
          <Card className="backdrop-blur-lg bg-white/20 border-white/30 overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="h-96 lg:h-[400px] relative">
                {!loading && locationData ? (
                  <GoogleEarthView 
                    location={locationData.name}
                    coordinates={locationData.coordinates}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-200/50 backdrop-blur-sm">
                    <div className="text-white text-xl drop-shadow-lg">Loading satellite view...</div>
                  </div>
                )}
                {locationData && (
                  <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
                    <p className="text-lg font-semibold">{locationData.name}</p>
                    <p className="text-sm opacity-80">{locationData.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weather Info */}
          <div className="space-y-6">
            {weatherData && (
              <>
                {/* Current Weather */}
                <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-white/80" />
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg">{location}</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-white drop-shadow-lg">
                          {Math.round(weatherData.main.temp)}°C
                        </p>
                        <p className="text-white/90 capitalize drop-shadow-sm">
                          {weatherData.weather[0].description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-white">
                        <Thermometer className="w-4 h-4 text-white/80" />
                        <span className="text-sm drop-shadow-sm">Feels like {Math.round(weatherData.main.feels_like)}°C</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Droplets className="w-4 h-4 text-white/80" />
                        <span className="text-sm drop-shadow-sm">Humidity {weatherData.main.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Wind className="w-4 h-4 text-white/80" />
                        <span className="text-sm drop-shadow-sm">Wind {weatherData.wind.speed} m/s</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Eye className="w-4 h-4 text-white/80" />
                        <span className="text-sm drop-shadow-sm">Visibility {(weatherData.visibility / 1000).toFixed(1)} km</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Info */}
                <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 drop-shadow-lg">Weather Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-white">
                      <div>
                        <p className="text-sm text-white/80">Pressure</p>
                        <p className="font-semibold drop-shadow-sm">{weatherData.main.pressure} hPa</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/80">UV Index</p>
                        <p className="font-semibold drop-shadow-sm">Moderate</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/80">Sunrise</p>
                        <p className="font-semibold drop-shadow-sm">
                          {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-white/80">Sunset</p>
                        <p className="font-semibold drop-shadow-sm">
                          {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

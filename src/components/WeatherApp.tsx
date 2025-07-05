import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import WeatherScene from './WeatherScene';
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

  const popularCities = ['Mumbai', 'Paris', 'New York', 'Tokyo', 'London', 'Dubai', 'Sydney'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            🌤️ WeatherVerse
          </h1>
          <p className="text-xl text-blue-100 animate-fade-in">
            Explore the world's weather in 3D with real satellite imagery
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 backdrop-blur-sm bg-white/20 border-white/30">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for a city..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 bg-white/90 border-white/50"
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
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
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 text-xs"
                >
                  {city}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 3D Scene */}
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="h-96 lg:h-[400px] relative">
                <WeatherScene 
                  weather={weatherData?.weather[0].main.toLowerCase() || 'clear'}
                  landmark={locationData?.landmark || 'gateway'}
                  loading={loading}
                />
                {locationData && (
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-lg font-semibold">{locationData.name}</p>
                    <p className="text-sm opacity-80">{locationData.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Satellite View */}
          <Card className="backdrop-blur-sm bg-white/10 border-white/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="h-96 lg:h-[400px] relative">
                {!loading && locationData ? (
                  <GoogleEarthView 
                    location={locationData.name}
                    coordinates={locationData.coordinates}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-200">
                    <div className="text-white text-xl">Loading satellite view...</div>
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
                <Card className="backdrop-blur-sm bg-white/20 border-white/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-200" />
                        <h2 className="text-2xl font-bold text-white">{location}</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-white">
                          {Math.round(weatherData.main.temp)}°C
                        </p>
                        <p className="text-blue-100 capitalize">
                          {weatherData.weather[0].description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-white">
                        <Thermometer className="w-4 h-4 text-blue-200" />
                        <span className="text-sm">Feels like {Math.round(weatherData.main.feels_like)}°C</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Droplets className="w-4 h-4 text-blue-200" />
                        <span className="text-sm">Humidity {weatherData.main.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Wind className="w-4 h-4 text-blue-200" />
                        <span className="text-sm">Wind {weatherData.wind.speed} m/s</span>
                      </div>
                      <div className="flex items-center gap-2 text-white">
                        <Eye className="w-4 h-4 text-blue-200" />
                        <span className="text-sm">Visibility {(weatherData.visibility / 1000).toFixed(1)} km</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Info */}
                <Card className="backdrop-blur-sm bg-white/20 border-white/30">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Weather Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-white">
                      <div>
                        <p className="text-sm text-blue-200">Pressure</p>
                        <p className="font-semibold">{weatherData.main.pressure} hPa</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-200">UV Index</p>
                        <p className="font-semibold">Moderate</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-200">Sunrise</p>
                        <p className="font-semibold">
                          {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-200">Sunset</p>
                        <p className="font-semibold">
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
              <Card className="backdrop-blur-sm bg-white/20 border-white/30">
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

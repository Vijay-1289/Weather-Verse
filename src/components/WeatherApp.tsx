
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getWeatherData, WeatherData } from '../services/weatherService';
import { getLocationData, LocationData } from '../data/locations';
import PlaceInfo from './PlaceInfo';
import WeatherEffects from './WeatherEffects';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet';

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

function MapFlyTo({ lat, lon, weather }: { lat: number; lon: number; weather: string }) {
  const map = useMap();
  useEffect(() => {
    if (!isNaN(lat) && !isNaN(lon)) {
      let zoom = 12;
      let duration = 1.5;
      // Animate differently for some weather types
      if (weather.toLowerCase() === 'thunderstorm') {
        zoom = 13;
        duration = 2.2;
      } else if (weather.toLowerCase() === 'snow') {
        zoom = 11;
        duration = 2.5;
      } else if (weather.toLowerCase() === 'rain') {
        zoom = 12;
        duration = 2.0;
      }
      map.flyTo([lat, lon], zoom, { animate: true, duration });
    }
  }, [lat, lon, weather, map]);
  return null;
}

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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map Section replaces PlaceInfo */}
          <div className="rounded-3xl overflow-hidden shadow-2xl ring-2 ring-blue-200/40 bg-white/20 backdrop-blur-lg min-h-[350px] flex items-center justify-center relative">
            {/* Weather animation overlay above the map only */}
            {weatherData && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                <WeatherEffects weatherCondition={weatherData.weather[0].main} isNight={isNight} />
              </div>
            )}
            {locationData?.coordinates ? (
              <MapContainer
                center={[locationData.coordinates.lat, locationData.coordinates.lon]}
                zoom={12}
                style={{ width: '100%', height: '350px', borderRadius: '1.5rem', zIndex: 1 }}
                scrollWheelZoom={false}
              >
                {/* Animate map flyTo on location/weather change */}
                <MapFlyTo lat={locationData.coordinates.lat} lon={locationData.coordinates.lon} weather={weatherData?.weather[0].main || ''} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[locationData.coordinates.lat, locationData.coordinates.lon]}>
                  <Popup>
                    {location}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="text-center w-full text-white/80 py-12">
                <p>Map unavailable for this location.</p>
              </div>
            )}
          </div>

          {/* Weather Info */}
          <div className="space-y-6">
            {weatherData && (
              <>
                {/* Current Weather */}
                <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl rounded-3xl ring-2 ring-pink-200/40 drop-shadow-cute">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-white/80" />
                        <h2 className="text-2xl font-bold text-white drop-shadow-lg">{location}</h2>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        {/* Cute Weather Emoji with bounce animation */}
                        <span
                          className="text-5xl md:text-6xl mb-1 animate-bounce-cute"
                          style={{ display: 'inline-block' }}
                          aria-label={weatherData.weather[0].main}
                        >
                          {weatherEmojis[weatherData.weather[0].main.toLowerCase()] || '🌈'}
                        </span>
                        <p className="text-4xl font-bold text-white drop-shadow-lg font-cute">
                          {Math.round(weatherData.main.temp)}°C
                        </p>
                        <p className="text-white/90 capitalize drop-shadow-sm font-cute">
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

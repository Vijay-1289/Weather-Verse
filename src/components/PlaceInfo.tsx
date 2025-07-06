import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PlaceInfoProps {
  location: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

interface PlaceData {
  name: string;
  description: string;
}

const PlaceInfo: React.FC<PlaceInfoProps> = ({ location, coordinates }) => {
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced fallback data for popular cities
  const fallbackData: Record<string, PlaceData> = {
    'mumbai': {
      name: 'Gateway of India',
      description: 'Iconic archway overlooking the Arabian Sea, built in Indo-Saracenic style architecture.'
    },
    'paris': {
      name: 'Eiffel Tower',
      description: 'Iron lattice tower on the Champ de Mars, standing 324 meters tall as Paris\' most iconic landmark.'
    },
    'new york': {
      name: 'Statue of Liberty',
      description: 'Neoclassical sculpture on Liberty Island, symbolizing freedom and democracy.'
    },
    'tokyo': {
      name: 'Tokyo Tower',
      description: 'Communications and observation tower, standing 333 meters tall in the heart of Tokyo.'
    },
    'london': {
      name: 'Big Ben',
      description: 'Great bell of the Great Clock of Westminster, located at the north end of the Houses of Parliament.'
    },
    'dubai': {
      name: 'Burj Khalifa',
      description: 'World\'s tallest building and structure, featuring stunning architecture and panoramic city views.'
    },
    'sydney': {
      name: 'Sydney Opera House',
      description: 'Multi-venue performing arts centre, famous for its distinctive sail-like roof design.'
    }
  };

  // Generate dynamic description based on location
  const generateDynamicDescription = (locationName: string, isIndianVillage: boolean = false): string => {
    if (isIndianVillage) {
      const descriptions = [
        `A traditional Indian village known for its agricultural heritage and close-knit community.`,
        `A peaceful rural settlement where traditional farming and cultural practices thrive.`,
        `A charming village that represents the authentic rural lifestyle of India.`,
        `A community where ancient traditions and modern aspirations coexist harmoniously.`,
        `A village that showcases the beauty and simplicity of rural Indian life.`
      ];
      return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    const descriptions = [
      `A vibrant community with rich cultural traditions and warm hospitality.`,
      `A place where history meets modernity, creating a unique cultural tapestry.`,
      `A location known for its distinctive character and local traditions.`,
      `A community that celebrates its heritage while embracing the future.`,
      `A place with its own unique charm and cultural significance.`
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  // Check if location is likely an Indian village
  const isIndianVillage = (locationName: string): boolean => {
    const indianStates = [
      'andhra pradesh', 'telangana', 'karnataka', 'tamil nadu', 'kerala',
      'maharashtra', 'gujarat', 'rajasthan', 'madhya pradesh', 'uttar pradesh',
      'bihar', 'west bengal', 'odisha', 'jharkhand', 'chhattisgarh',
      'himachal pradesh', 'uttarakhand', 'punjab', 'haryana', 'delhi',
      'jammu and kashmir', 'assam', 'manipur', 'meghalaya', 'nagaland',
      'tripura', 'arunachal pradesh', 'mizoram', 'sikkim', 'goa'
    ];

    const locationLower = locationName.toLowerCase();
    
    // Check if it contains Indian state names
    const hasIndianState = indianStates.some(state => locationLower.includes(state));
    
    // Check for common Indian village indicators
    const villageIndicators = ['village', 'gram', 'palli', 'pura', 'nagar', 'pur', 'abad', 'garh'];
    const hasVillageIndicator = villageIndicators.some(indicator => locationLower.includes(indicator));
    
    // Check for Telugu/Andhra Pradesh specific patterns
    const teluguPatterns = ['palli', 'gudem', 'pet', 'peta', 'nagar', 'colony'];
    const hasTeluguPattern = teluguPatterns.some(pattern => locationLower.includes(pattern));
    
    return hasIndianState || hasVillageIndicator || hasTeluguPattern;
  };

  useEffect(() => {
    const fetchPlaceData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const normalizedLocation = location.toLowerCase().trim();
        const data = fallbackData[normalizedLocation];
        
        if (data) {
          setPlaceData(data);
        } else {
          // Generate dynamic data for any location
          const isVillage = isIndianVillage(location);
          const generatedData: PlaceData = {
            name: location,
            description: generateDynamicDescription(location, isVillage)
          };
          
          setPlaceData(generatedData);
        }
      } catch (err) {
        setError('Failed to load place information');
        console.error('Error fetching place data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceData();
  }, [location]);

  if (loading) {
    return (
      <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-3" />
              <p className="text-white text-lg">Discovering {location}...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !placeData) {
    return (
      <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 bg-red-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <p className="text-white text-lg">Unable to load place information</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-3">
            <MapPin className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">{placeData.name}</h3>
            <p className="text-sm text-white/70">Location Information</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-300 mb-1">ABOUT THIS PLACE</p>
                <p className="text-white/90 leading-relaxed">
                  {placeData.description}
                </p>
              </div>
            </div>
          </div>
          
          {coordinates && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 rounded-full p-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-300 mb-1">COORDINATES</p>
                  <p className="text-white/90">
                    Latitude: {coordinates.lat.toFixed(4)}°N<br />
                    Longitude: {coordinates.lon.toFixed(4)}°E
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceInfo; 
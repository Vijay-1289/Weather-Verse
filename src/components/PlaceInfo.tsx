import React, { useState, useEffect } from 'react';
import { MapPin, Info, Camera, Globe } from 'lucide-react';
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
  image: string;
  fact: string;
  description: string;
}

const PlaceInfo: React.FC<PlaceInfoProps> = ({ location, coordinates }) => {
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback data for popular cities
  const fallbackData: Record<string, PlaceData> = {
    'mumbai': {
      name: 'Gateway of India',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
      fact: 'The Gateway of India was built to commemorate the visit of King George V and Queen Mary to Mumbai in 1911.',
      description: 'Iconic archway overlooking the Arabian Sea, built in Indo-Saracenic style architecture.'
    },
    'paris': {
      name: 'Eiffel Tower',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&h=600&fit=crop',
      fact: 'The Eiffel Tower was originally intended to be a temporary structure for the 1889 World\'s Fair.',
      description: 'Iron lattice tower on the Champ de Mars, standing 324 meters tall as Paris\' most iconic landmark.'
    },
    'new york': {
      name: 'Statue of Liberty',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop',
      fact: 'The Statue of Liberty was a gift from France to the United States, designed by Frédéric Auguste Bartholdi.',
      description: 'Neoclassical sculpture on Liberty Island, symbolizing freedom and democracy.'
    },
    'tokyo': {
      name: 'Tokyo Tower',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
      fact: 'Tokyo Tower was inspired by the Eiffel Tower but is painted orange and white for air safety regulations.',
      description: 'Communications and observation tower, standing 333 meters tall in the heart of Tokyo.'
    },
    'london': {
      name: 'Big Ben',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
      fact: 'Big Ben is actually the nickname for the Great Bell of the Great Clock of Westminster, not the tower itself.',
      description: 'Great bell of the Great Clock of Westminster, located at the north end of the Houses of Parliament.'
    },
    'dubai': {
      name: 'Burj Khalifa',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
      fact: 'Burj Khalifa is the world\'s tallest building at 828 meters, with 163 floors and the world\'s highest outdoor observation deck.',
      description: 'World\'s tallest building and structure, featuring stunning architecture and panoramic city views.'
    },
    'sydney': {
      name: 'Sydney Opera House',
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
      fact: 'The Sydney Opera House was designed by Danish architect Jørn Utzon and took 14 years to complete.',
      description: 'Multi-venue performing arts centre, famous for its distinctive sail-like roof design.'
    }
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
          // For unknown locations, create a generic entry
          setPlaceData({
            name: location,
            image: `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&q=${encodeURIComponent(location)}`,
            fact: `Discover the unique charm and culture of ${location}, a city with its own fascinating history and traditions.`,
            description: `Explore the local landmarks, cuisine, and cultural heritage that make ${location} special.`
          });
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
      <Card className="backdrop-blur-lg bg-white/20 border-white/30 overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="h-96 lg:h-[400px] relative">
            <div className="w-full h-full flex items-center justify-center bg-blue-200/50 backdrop-blur-sm">
              <div className="text-white text-xl drop-shadow-lg animate-pulse">
                Loading place information...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !placeData) {
    return (
      <Card className="backdrop-blur-lg bg-white/20 border-white/30 overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="h-96 lg:h-[400px] relative">
            <div className="w-full h-full flex items-center justify-center bg-red-200/50 backdrop-blur-sm">
              <div className="text-white text-xl drop-shadow-lg">
                Unable to load place information
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-lg bg-white/20 border-white/30 overflow-hidden shadow-2xl">
      <CardContent className="p-0">
        <div className="h-96 lg:h-[400px] relative group">
          {/* Background Image */}
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${placeData.image})` }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-yellow-400" />
              <h3 className="text-2xl font-bold drop-shadow-lg">{placeData.name}</h3>
            </div>
            
            <p className="text-sm text-white/90 mb-3 drop-shadow-md">
              {placeData.description}
            </p>
            
            {/* Interesting Fact */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-yellow-300 mb-1">DID YOU KNOW?</p>
                  <p className="text-sm text-white/95 leading-relaxed">
                    {placeData.fact}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Top-right corner icon */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceInfo; 
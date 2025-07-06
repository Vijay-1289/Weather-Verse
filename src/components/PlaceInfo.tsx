import React, { useState, useEffect } from 'react';
import { MapPin, Camera, Globe, Loader2 } from 'lucide-react';
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

  // Enhanced fallback data for popular cities
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

  // Generate dynamic facts based on location characteristics
  const generateDynamicFact = (locationName: string, isIndianVillage: boolean = false): string => {
    const facts = [
      `${locationName} has a rich cultural heritage that spans generations, with traditions passed down through families.`,
      `The local cuisine of ${locationName} features unique flavors and traditional cooking methods that reflect the region's agricultural bounty.`,
      `${locationName} is known for its warm hospitality and close-knit community where everyone knows their neighbors.`,
      `The landscape around ${locationName} showcases the natural beauty of the region, with scenic views that change with the seasons.`,
      `${locationName} has a fascinating history that includes stories of resilience, growth, and community spirit.`,
      `Local festivals and celebrations in ${locationName} bring the community together and showcase regional traditions.`,
      `The people of ${locationName} are known for their hard work and dedication to preserving their cultural identity.`,
      `${locationName} offers a peaceful escape from city life, with its serene environment and traditional way of living.`
    ];

    if (isIndianVillage) {
      const indianVillageFacts = [
        `${locationName} is a charming village that embodies the essence of rural India, with its traditional architecture and agricultural lifestyle.`,
        `The village of ${locationName} is known for its traditional farming practices and sustainable living methods passed down through generations.`,
        `${locationName} showcases the beauty of Indian village life, with its community wells, temple gatherings, and traditional festivals.`,
        `In ${locationName}, you'll find the heart of India's rural culture, where ancient traditions meet modern aspirations.`,
        `The village of ${locationName} is a testament to India's agricultural heritage and the strength of its rural communities.`
      ];
      return indianVillageFacts[Math.floor(Math.random() * indianVillageFacts.length)];
    }

    return facts[Math.floor(Math.random() * facts.length)];
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

  // Generate image URL based on location
  const generateImageUrl = (locationName: string, isIndianVillage: boolean = false): string => {
    const baseUrl = 'https://images.unsplash.com/photo-';
    
    if (isIndianVillage) {
      // Indian village themed images
      const indianVillageImages = [
        '1570168007204-dfb528c6958f', // Indian architecture
        '1548013146-72479768bada',    // Rural India
        '1511739001486-6bfe10ce785f', // Village life
        '1540959733332-eab4deabeeaf', // Rural landscape
        '1513635269975-59663e0ac1ad', // Traditional India
        '1512453979798-5ea266f8880c', // Village scene
        '1506973035872-a4ec16b8e8d9', // Rural beauty
        '1449824913935-59a10b8d2000'  // Countryside
      ];
      const randomImage = indianVillageImages[Math.floor(Math.random() * indianVillageImages.length)];
      return `${baseUrl}${randomImage}?w=800&h=600&fit=crop&q=${encodeURIComponent(locationName)}`;
    }

    // General location images
    const generalImages = [
      '1570168007204-dfb528c6958f', // Architecture
      '1548013146-72479768bada',    // Landmarks
      '1511739001486-6bfe10ce785f', // City views
      '1540959733332-eab4deabeeaf', // Urban landscape
      '1513635269975-59663e0ac1ad', // Buildings
      '1512453979798-5ea266f8880c', // Cityscape
      '1506973035872-a4ec16b8e8d9', // Urban beauty
      '1449824913935-59a10b8d2000'  // General
    ];
    const randomImage = generalImages[Math.floor(Math.random() * generalImages.length)];
    return `${baseUrl}${randomImage}?w=800&h=600&fit=crop&q=${encodeURIComponent(locationName)}`;
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
            image: generateImageUrl(location, isVillage),
            fact: generateDynamicFact(location, isVillage),
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
      <Card className="backdrop-blur-lg bg-white/20 border-white/30 overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="h-96 lg:h-[400px] relative">
            <div className="w-full h-full flex items-center justify-center bg-blue-200/50 backdrop-blur-sm">
              <div className="text-white text-xl drop-shadow-lg flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Discovering {location}...
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
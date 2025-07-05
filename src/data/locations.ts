
export interface LocationData {
  name: string;
  landmark: string;
  description: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

const locationData: Record<string, LocationData> = {
  'mumbai': {
    name: 'Gateway of India',
    landmark: 'gateway',
    description: 'Iconic archway overlooking the Arabian Sea',
    coordinates: { lat: 18.9220, lon: 72.8347 }
  },
  'paris': {
    name: 'Eiffel Tower',
    landmark: 'eiffel',
    description: 'Iron lattice tower on the Champ de Mars',
    coordinates: { lat: 48.8566, lon: 2.3522 }
  },
  'new york': {
    name: 'Statue of Liberty',
    landmark: 'liberty',
    description: 'Neoclassical sculpture on Liberty Island',
    coordinates: { lat: 40.6892, lon: -74.0445 }
  },
  'tokyo': {
    name: 'Tokyo Tower',
    landmark: 'tokyo',
    description: 'Communications and observation tower',
    coordinates: { lat: 35.6586, lon: 139.7454 }
  },
  'london': {
    name: 'Big Ben',
    landmark: 'bigben',
    description: 'Great bell of the Great Clock of Westminster',
    coordinates: { lat: 51.5007, lon: -0.1246 }
  },
  'dubai': {
    name: 'Burj Khalifa',
    landmark: 'burj',
    description: 'World\'s tallest building and structure',
    coordinates: { lat: 25.1972, lon: 55.2744 }
  },
  'sydney': {
    name: 'Sydney Opera House',
    landmark: 'opera',
    description: 'Multi-venue performing arts centre',
    coordinates: { lat: -33.8568, lon: 151.2153 }
  }
};

export const getLocationData = (city: string): LocationData | null => {
  const normalizedCity = city.toLowerCase().trim();
  return locationData[normalizedCity] || null;
};

export const getAllLocations = (): LocationData[] => {
  return Object.values(locationData);
};

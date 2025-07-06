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
  // Major Cities
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
  },
  
  // Indian Cities
  'hyderabad': {
    name: 'Charminar',
    landmark: 'charminar',
    description: 'Iconic monument and mosque in the heart of Hyderabad',
    coordinates: { lat: 17.3616, lon: 78.4747 }
  },
  'bangalore': {
    name: 'Vidhana Soudha',
    landmark: 'vidhana',
    description: 'Seat of the state legislature of Karnataka',
    coordinates: { lat: 12.9791, lon: 77.5913 }
  },
  'chennai': {
    name: 'Marina Beach',
    landmark: 'marina',
    description: 'Natural urban beach along the Bay of Bengal',
    coordinates: { lat: 13.0827, lon: 80.2707 }
  },
  'kolkata': {
    name: 'Howrah Bridge',
    landmark: 'howrah',
    description: 'Iconic cantilever bridge over the Hooghly River',
    coordinates: { lat: 22.5958, lon: 88.2636 }
  },
  'delhi': {
    name: 'India Gate',
    landmark: 'indiagate',
    description: 'War memorial arch in the heart of New Delhi',
    coordinates: { lat: 28.6129, lon: 77.2295 }
  },
  
  // Andhra Pradesh Cities and Towns
  'visakhapatnam': {
    name: 'Kailasagiri',
    landmark: 'kailasagiri',
    description: 'Hilltop park with panoramic views of the Bay of Bengal',
    coordinates: { lat: 17.6868, lon: 83.2185 }
  },
  'vijayawada': {
    name: 'Kanaka Durga Temple',
    landmark: 'kanaka',
    description: 'Sacred temple dedicated to Goddess Durga',
    coordinates: { lat: 16.5062, lon: 80.6480 }
  },
  'guntur': {
    name: 'Amaravati',
    landmark: 'amaravati',
    description: 'Ancient Buddhist site and proposed capital city',
    coordinates: { lat: 16.5744, lon: 80.3636 }
  },
  'nellore': {
    name: 'Sri Ranganathaswamy Temple',
    landmark: 'ranganatha',
    description: 'Ancient temple dedicated to Lord Ranganatha',
    coordinates: { lat: 14.4426, lon: 79.9865 }
  },
  'kurnool': {
    name: 'Kurnool Fort',
    landmark: 'kurnoolfort',
    description: 'Historic fort with rich cultural heritage',
    coordinates: { lat: 15.8281, lon: 78.0373 }
  },
  
  // Andhra Pradesh Villages and Small Towns
  'chittoor': {
    name: 'Chittoor District',
    landmark: 'chittoor',
    description: 'District known for its temples and agricultural heritage',
    coordinates: { lat: 13.2156, lon: 79.1004 }
  },
  'anantapur': {
    name: 'Anantapur District',
    landmark: 'anantapur',
    description: 'District famous for groundnut cultivation and temples',
    coordinates: { lat: 14.6819, lon: 77.6006 }
  },
  'kadapa': {
    name: 'Kadapa District',
    landmark: 'kadapa',
    description: 'District with rich history and cultural heritage',
    coordinates: { lat: 14.4753, lon: 78.8298 }
  },
  'prakasam': {
    name: 'Prakasam District',
    landmark: 'prakasam',
    description: 'District known for its coastal beauty and agriculture',
    coordinates: { lat: 15.9129, lon: 79.7400 }
  },
  'srikakulam': {
    name: 'Srikakulam District',
    landmark: 'srikakulam',
    description: 'Northernmost district with beautiful beaches',
    coordinates: { lat: 18.2941, lon: 83.8963 }
  },
  'vizianagaram': {
    name: 'Vizianagaram District',
    landmark: 'vizianagaram',
    description: 'District with rich cultural and historical heritage',
    coordinates: { lat: 18.1062, lon: 83.3955 }
  },
  'east godavari': {
    name: 'East Godavari District',
    landmark: 'eastgodavari',
    description: 'District known for its fertile lands and temples',
    coordinates: { lat: 17.3213, lon: 82.0409 }
  },
  'west godavari': {
    name: 'West Godavari District',
    landmark: 'westgodavari',
    description: 'District famous for agriculture and cultural heritage',
    coordinates: { lat: 16.1969, lon: 81.1384 }
  },
  'krishna': {
    name: 'Krishna District',
    landmark: 'krishna',
    description: 'District with rich agricultural and cultural heritage',
    coordinates: { lat: 16.1833, lon: 80.6333 }
  },
  'guntur district': {
    name: 'Guntur District',
    landmark: 'gunturdistrict',
    description: 'District known for its spicy cuisine and agriculture',
    coordinates: { lat: 16.5744, lon: 80.3636 }
  },
  
  // Popular Village Names (Telugu/Andhra Pradesh)
  'peddapalli': {
    name: 'Peddapalli Village',
    landmark: 'peddapalli',
    description: 'Traditional village with agricultural heritage',
    coordinates: { lat: 18.6167, lon: 79.3667 }
  },
  'gudem': {
    name: 'Gudem Village',
    landmark: 'gudem',
    description: 'Peaceful village with traditional farming practices',
    coordinates: { lat: 17.7833, lon: 83.2500 }
  },
  'peta': {
    name: 'Peta Village',
    landmark: 'peta',
    description: 'Charming village with close-knit community',
    coordinates: { lat: 16.5000, lon: 80.6500 }
  },
  'nagar': {
    name: 'Nagar Village',
    landmark: 'nagar',
    description: 'Village known for its traditional way of life',
    coordinates: { lat: 15.8333, lon: 78.0500 }
  },
  'colony': {
    name: 'Colony Village',
    landmark: 'colony',
    description: 'Modern village with traditional values',
    coordinates: { lat: 14.6833, lon: 77.6000 }
  },
  'pur': {
    name: 'Pur Village',
    landmark: 'pur',
    description: 'Ancient village with rich cultural heritage',
    coordinates: { lat: 13.2167, lon: 79.1000 }
  },
  'pura': {
    name: 'Pura Village',
    landmark: 'pura',
    description: 'Traditional village with agricultural roots',
    coordinates: { lat: 15.9167, lon: 79.7500 }
  },
  'gram': {
    name: 'Gram Village',
    landmark: 'gram',
    description: 'Village embodying the essence of rural India',
    coordinates: { lat: 18.3000, lon: 83.9000 }
  },
  'garh': {
    name: 'Garh Village',
    landmark: 'garh',
    description: 'Historic village with traditional architecture',
    coordinates: { lat: 18.1167, lon: 83.4000 }
  },
  'abad': {
    name: 'Abad Village',
    landmark: 'abad',
    description: 'Peaceful village with traditional farming',
    coordinates: { lat: 16.2000, lon: 81.1500 }
  }
};

export const getLocationData = (city: string): LocationData | null => {
  const normalizedCity = city.toLowerCase().trim();
  return locationData[normalizedCity] || null;
};

export const getAllLocations = (): LocationData[] => {
  return Object.values(locationData);
};

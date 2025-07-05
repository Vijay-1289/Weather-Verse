
import React, { useEffect, useRef } from 'react';

interface GoogleEarthViewProps {
  location: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleEarthView: React.FC<GoogleEarthViewProps> = ({ location, coordinates }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDUFIDF3WwnG96bDA_uLESoF-f9mu3hw6E&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const defaultCoords = coordinates || { lat: 18.9220, lon: 72.8347 }; // Mumbai as default

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: defaultCoords.lat, lng: defaultCoords.lon },
        zoom: 15,
        mapTypeId: 'satellite',
        tilt: 45,
        heading: 0,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      // Add a marker for the landmark
      new window.google.maps.Marker({
        position: { lat: defaultCoords.lat, lng: defaultCoords.lon },
        map: mapInstanceRef.current,
        title: location,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new window.google.maps.Size(40, 40)
        }
      });
    };

    loadGoogleMaps();

    return () => {
      // Cleanup if needed
    };
  }, [location, coordinates]);

  return (
    <div className="w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '300px' }}
      />
      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
        Real-time satellite view of {location}
      </div>
    </div>
  );
};

export default GoogleEarthView;

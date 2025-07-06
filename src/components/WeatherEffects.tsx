import React, { useEffect, useRef, useState } from 'react';

interface WeatherEffectsProps {
  weatherCondition: string;
  isNight: boolean;
}

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weatherCondition, isNight }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  useEffect(() => {
    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Only play audio if user has enabled it
    if (!audioEnabled) {
      return;
    }

    // Create and play appropriate ambient sound
    let audioSrc = '';
    switch (weatherCondition.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        audioSrc = 'https://www.soundjay.com/misc/sounds/rain-01.wav';
        break;
      case 'thunderstorm':
        audioSrc = 'https://www.soundjay.com/misc/sounds/thunder-01.wav';
        break;
      case 'clouds':
        audioSrc = 'https://www.soundjay.com/misc/sounds/wind-01.wav';
        break;
      case 'clear':
        audioSrc = 'https://www.soundjay.com/misc/sounds/birds-01.wav';
        break;
      default:
        audioSrc = '';
    }

    if (audioSrc) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      
      // Try to play audio with user interaction
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
        } catch (error) {
          console.log('Audio autoplay blocked. User interaction required.');
        }
      };
      
      playAudio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [weatherCondition, audioEnabled]);

  const enableAudio = () => {
    setAudioEnabled(true);
    setShowAudioPrompt(false);
  };

  const disableAudio = () => {
    setAudioEnabled(false);
    setShowAudioPrompt(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const renderRainEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Heavy rain droplets */}
      {Array.from({ length: 200 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-8 bg-blue-300 opacity-70 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.3 + Math.random() * 0.7}s`,
            transform: `rotate(${10 + Math.random() * 10}deg)`,
          }}
        />
      ))}
      
      {/* Water puddle reflections */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-900/20 to-transparent animate-pulse" />
      
      {/* Splash effects */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={`splash-${i}`}
          className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 20}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${0.5 + Math.random() * 1}s`,
          }}
        />
      ))}
    </div>
  );

  const renderCloudEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Large moving clouds */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white/20 rounded-full blur-xl animate-pulse"
          style={{
            width: `${200 + Math.random() * 300}px`,
            height: `${100 + Math.random() * 150}px`,
            left: `${Math.random() * 120 - 20}%`,
            top: `${Math.random() * 60}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 20}s`,
            transform: `translateX(-${Math.random() * 100}px)`,
          }}
        />
      ))}
      
      {/* Medium clouds */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`medium-${i}`}
          className="absolute bg-gray-300/30 rounded-full blur-lg"
          style={{
            width: `${100 + Math.random() * 200}px`,
            height: `${60 + Math.random() * 100}px`,
            left: `${Math.random() * 110 - 10}%`,
            top: `${Math.random() * 80}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${15 + Math.random() * 25}s`,
            animation: `float ${15 + Math.random() * 10}s ease-in-out infinite`,
          }}
        />
      ))}
      
      {/* Small wispy clouds */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`small-${i}`}
          className="absolute bg-gray-200/20 rounded-full blur-md"
          style={{
            width: `${50 + Math.random() * 100}px`,
            height: `${30 + Math.random() * 60}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${20 + Math.random() * 30}s`,
            animation: `drift ${20 + Math.random() * 15}s linear infinite`,
          }}
        />
      ))}
    </div>
  );

  const renderSunnyEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Sun rays */}
      <div className="absolute top-10 right-10 w-32 h-32">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-16 bg-yellow-300/40 origin-bottom"
            style={{
              left: '50%',
              bottom: '50%',
              transform: `rotate(${i * 30}deg) translateX(-50%)`,
              animation: `sunRay ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        {/* Sun itself */}
        <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-yellow-400/60 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      
      {/* Floating particles (dust in sunlight) */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-yellow-200/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
            animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
          }}
        />
      ))}
      
      {/* Warm light overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/10 via-transparent to-orange-200/10" />
    </div>
  );

  const renderSnowEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Heavy snowfall */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animation: `snowfall ${3 + Math.random() * 2}s linear infinite`,
          }}
        />
      ))}
      
      {/* Large snowflakes */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`large-${i}`}
          className="absolute w-3 h-3 bg-white rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
            animation: `snowfall ${4 + Math.random() * 3}s linear infinite`,
          }}
        />
      ))}
      
      {/* Snow accumulation */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-white/30" />
    </div>
  );

  const renderThunderstormEffect = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Lightning flashes */}
      <div className="absolute inset-0 bg-white/20 animate-pulse opacity-0 lightning-flash" />
      
      {/* Heavy rain */}
      {Array.from({ length: 300 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-12 bg-blue-400 opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${0.2 + Math.random() * 0.3}s`,
            transform: `rotate(${15 + Math.random() * 10}deg)`,
          }}
        />
      ))}
      
      {/* Lightning bolts */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`lightning-${i}`}
          className="absolute w-1 h-20 bg-white opacity-90 lightning-bolt"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${Math.random() * 40}%`,
            transform: `rotate(${-10 + Math.random() * 20}deg)`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: '0.1s',
          }}
        />
      ))}
    </div>
  );

  const renderWeatherEffect = () => {
    const weather = weatherCondition.toLowerCase();
    
    switch (weather) {
      case 'rain':
      case 'drizzle':
        return renderRainEffect();
      case 'thunderstorm':
        return renderThunderstormEffect();
      case 'snow':
        return renderSnowEffect();
      case 'clouds':
        return renderCloudEffect();
      case 'clear':
        return renderSunnyEffect();
      case 'mist':
      case 'fog':
        return (
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gray-400/40 animate-pulse" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderWeatherEffect()}
      
      {/* Audio Control Prompt */}
      {showAudioPrompt && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg border border-white/20 shadow-2xl">
          <p className="text-sm mb-3">Enable weather sounds for immersive experience?</p>
          <div className="flex gap-2">
            <button
              onClick={enableAudio}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
            >
              Enable
            </button>
            <button
              onClick={disableAudio}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs transition-colors"
            >
              No Thanks
            </button>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-10px) translateX(5px); }
            50% { transform: translateY(-5px) translateX(-5px); }
            75% { transform: translateY(-15px) translateX(3px); }
          }
          
          @keyframes drift {
            0% { transform: translateX(-100px); }
            100% { transform: translateX(calc(100vw + 100px)); }
          }
          
          @keyframes sunRay {
            0%, 100% { opacity: 0.3; transform: rotate(var(--rotation)) scale(1); }
            50% { opacity: 0.8; transform: rotate(var(--rotation)) scale(1.1); }
          }
          
          @keyframes snowfall {
            0% { transform: translateY(-100px) rotate(0deg); }
            100% { transform: translateY(calc(100vh + 100px)) rotate(360deg); }
          }
          
          @keyframes lightning-flash {
            0%, 90%, 100% { opacity: 0; }
            5%, 10% { opacity: 1; }
          }
          
          .lightning-flash {
            animation: lightning-flash 3s infinite;
          }
          
          .lightning-bolt {
            animation: lightning-flash 0.1s infinite;
          }
        `
      }} />
    </>
  );
};

export default WeatherEffects;

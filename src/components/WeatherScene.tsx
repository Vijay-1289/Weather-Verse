
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface WeatherSceneProps {
  weather: string;
  landmark: string;
  loading: boolean;
}

// Realistic 2D-style rain particles
const RainParticles = () => {
  const particles = useRef<THREE.Points>(null);
  const particleCount = 1200;
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 50;
      pos[i + 1] = Math.random() * 30 + 10;
      pos[i + 2] = (Math.random() - 0.5) * 40;
      vel[i / 3] = Math.random() * 0.15 + 0.2;
    }
    
    return { positions: pos, velocities: vel };
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  useFrame(() => {
    if (particles.current?.geometry?.attributes?.position) {
      const pos = particles.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        pos[idx + 1] -= velocities[i];
        pos[idx] += Math.sin(Date.now() * 0.001 + i) * 0.015;
        
        if (pos[idx + 1] < -5) {
          pos[idx + 1] = 25 + Math.random() * 10;
          pos[idx] = (Math.random() - 0.5) * 50;
        }
      }
      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particles} geometry={geometry}>
      <pointsMaterial 
        size={0.04} 
        color="#4A90E2" 
        transparent 
        opacity={0.8}
        sizeAttenuation={false}
      />
    </points>
  );
};

// Enhanced snow particles
const SnowParticles = () => {
  const particles = useRef<THREE.Points>(null);
  const particleCount = 600;
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 2);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 60;
      pos[i + 1] = Math.random() * 30 + 10;
      pos[i + 2] = (Math.random() - 0.5) * 50;
      vel[(i / 3) * 2] = Math.random() * 0.03 + 0.02;
      vel[(i / 3) * 2 + 1] = Math.random() * 0.8;
    }
    
    return { positions: pos, velocities: vel };
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  useFrame((state) => {
    if (particles.current?.geometry?.attributes?.position) {
      const pos = particles.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const velIdx = i * 2;
        
        pos[idx + 1] -= velocities[velIdx];
        pos[idx] += Math.sin(state.clock.elapsedTime + velocities[velIdx + 1]) * 0.02;
        pos[idx + 2] += Math.cos(state.clock.elapsedTime * 0.5 + velocities[velIdx + 1]) * 0.015;
        
        if (pos[idx + 1] < -5) {
          pos[idx + 1] = 25 + Math.random() * 10;
          pos[idx] = (Math.random() - 0.5) * 60;
          pos[idx + 2] = (Math.random() - 0.5) * 50;
        }
      }
      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particles} geometry={geometry}>
      <pointsMaterial 
        size={0.1} 
        color="#FFFFFF" 
        transparent 
        opacity={0.9}
        sizeAttenuation={false}
      />
    </points>
  );
};

// Realistic 3D clouds with natural movement
const AnimatedCloud = ({ position }: { position: [number, number, number] }) => {
  const cloudRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.15) * 2;
      cloudRef.current.position.z = position[2] + Math.cos(state.clock.elapsedTime * 0.1) * 1.5;
      cloudRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
      cloudRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshStandardMaterial color="#F8F8FF" transparent opacity={0.8} />
      </mesh>
      <mesh position={[1.5, 0.4, 0.3]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#F5F5F5" transparent opacity={0.75} />
      </mesh>
      <mesh position={[-1.2, 0.3, -0.2]}>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.7, 0.8, 0.2]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshStandardMaterial color="#FFFAFA" transparent opacity={0.65} />
      </mesh>
      <mesh position={[-0.4, 0.7, 0.4]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#F0F8FF" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

// Fog effect for misty weather
const FogEffect = () => {
  const fogRef = useRef<THREE.Points>(null);
  const particleCount = 200;
  
  const { positions } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 80;
      pos[i + 1] = Math.random() * 15;
      pos[i + 2] = (Math.random() - 0.5) * 60;
    }
    
    return { positions: pos };
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  useFrame((state) => {
    if (fogRef.current) {
      fogRef.current.rotation.y += 0.0005;
      fogRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2;
    }
  });

  return (
    <points ref={fogRef} geometry={geometry}>
      <pointsMaterial 
        size={2} 
        color="#E0E0E0" 
        transparent 
        opacity={0.15}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Lightning effect for thunderstorms
const LightningEffect = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      // Random lightning flashes
      const flash = Math.random() < 0.02;
      lightRef.current.intensity = flash ? 5 : 0;
      if (flash) {
        lightRef.current.position.set(
          (Math.random() - 0.5) * 40,
          15 + Math.random() * 10,
          (Math.random() - 0.5) * 40
        );
      }
    }
  });

  return (
    <pointLight 
      ref={lightRef}
      color="#FFFFFF"
      intensity={0}
      distance={100}
    />
  );
};

const WeatherScene: React.FC<WeatherSceneProps> = ({ weather, landmark, loading }) => {
  const getBackgroundGradient = () => {
    switch (weather.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return ['#2C3E50', '#34495E', '#4A5568']; // Dark stormy sky
      case 'thunderstorm':
        return ['#1A1A2E', '#16213E', '#0F4C75']; // Very dark storm
      case 'snow':
        return ['#E8F4F8', '#D6EAF8', '#AED6F1']; // Light winter sky
      case 'clouds':
        return ['#85A3C4', '#A8C8EC', '#D1E7FF']; // Overcast sky
      case 'clear':
        return ['#87CEEB', '#98D8E8', '#B8E6F2']; // Clear blue sky
      case 'mist':
      case 'fog':
        return ['#B0BEC5', '#CFD8DC', '#ECEFF1']; // Foggy grey
      default:
        return ['#87CEEB', '#98D8E8', '#B8E6F2'];
    }
  };

  const getLighting = () => {
    switch (weather.toLowerCase()) {
      case 'rain':
      case 'drizzle': return { intensity: 0.3, color: '#708090' };
      case 'thunderstorm': return { intensity: 0.2, color: '#4B0082' };
      case 'snow': return { intensity: 0.9, color: '#F0F8FF' };
      case 'clouds': return { intensity: 0.5, color: '#D3D3D3' };
      case 'clear': return { intensity: 1.2, color: '#FFD700' };
      case 'mist':
      case 'fog': return { intensity: 0.4, color: '#C0C0C0' };
      default: return { intensity: 1, color: '#FFFFFF' };
    }
  };

  const getFogSettings = () => {
    switch (weather.toLowerCase()) {
      case 'rain':
      case 'drizzle': return { near: 10, far: 40, density: 0.02 };
      case 'thunderstorm': return { near: 5, far: 30, density: 0.05 };
      case 'snow': return { near: 15, far: 50, density: 0.01 };
      case 'mist':
      case 'fog': return { near: 5, far: 25, density: 0.08 };
      default: return { near: 50, far: 100, density: 0.005 };
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500">
        <div className="text-white text-xl">Loading Weather Scene...</div>
      </div>
    );
  }

  const gradient = getBackgroundGradient();
  const lighting = getLighting();
  const fog = getFogSettings();

  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 5, 15], fov: 70 }}
        onCreated={({ gl, scene }) => {
          // Set gradient background
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const context = canvas.getContext('2d')!;
          const gradientFill = context.createLinearGradient(0, 0, 0, 512);
          gradientFill.addColorStop(0, gradient[0]);
          gradientFill.addColorStop(0.5, gradient[1]);
          gradientFill.addColorStop(1, gradient[2]);
          context.fillStyle = gradientFill;
          context.fillRect(0, 0, 512, 512);
          
          const texture = new THREE.CanvasTexture(canvas);
          scene.background = texture;
          
          // Add fog
          scene.fog = new THREE.FogExp2(gradient[1], fog.density);
          
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        {/* Dynamic lighting based on weather */}
        <ambientLight intensity={0.4} color={lighting.color} />
        <directionalLight 
          position={[20, 20, 10]} 
          intensity={lighting.intensity} 
          color={lighting.color}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />
        
        {/* Additional atmospheric lighting */}
        <pointLight position={[-10, 15, 8]} intensity={0.3} color={lighting.color} />
        <pointLight position={[10, 12, -5]} intensity={0.2} color={lighting.color} />
        
        {/* Ground plane with weather-appropriate texture */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color={weather.toLowerCase() === 'snow' ? '#F0F8FF' : weather.toLowerCase().includes('rain') ? '#2F4F4F' : '#228B22'} 
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Weather-specific effects */}
        {(weather.toLowerCase() === 'rain' || weather.toLowerCase() === 'drizzle') && <RainParticles />}
        {weather.toLowerCase() === 'snow' && <SnowParticles />}
        {weather.toLowerCase() === 'thunderstorm' && (
          <>
            <RainParticles />
            <LightningEffect />
          </>
        )}
        {weather.toLowerCase() === 'clouds' && (
          <>
            <AnimatedCloud position={[-8, 12, -10]} />
            <AnimatedCloud position={[10, 15, -12]} />
            <AnimatedCloud position={[3, 18, -15]} />
            <AnimatedCloud position={[-5, 14, -8]} />
            <AnimatedCloud position={[12, 16, -18]} />
          </>
        )}
        {(weather.toLowerCase() === 'mist' || weather.toLowerCase() === 'fog') && <FogEffect />}
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          enableRotate={true}
          maxDistance={30}
          minDistance={8}
          maxPolarAngle={Math.PI / 2.2}
          dampingFactor={0.05}
          enableDamping={true}
        />
      </Canvas>
    </div>
  );
};

export default WeatherScene;

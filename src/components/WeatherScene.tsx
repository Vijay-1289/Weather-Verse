
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Plane } from '@react-three/drei';
import * as THREE from 'three';

interface WeatherSceneProps {
  weather: string;
  landmark: string;
  loading: boolean;
}

// Rain particles component
const RainParticles = () => {
  const particles = useRef<THREE.Points>(null);
  const particleCount = 1000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20;     // x
      pos[i + 1] = Math.random() * 20;         // y
      pos[i + 2] = (Math.random() - 0.5) * 20; // z
    }
    return pos;
  }, []);

  useFrame(() => {
    if (particles.current && particles.current.geometry.attributes.position) {
      const pos = particles.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= 0.1; // Fall speed
        if (pos[i] < -10) pos[i] = 10; // Reset position
      }
      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#87CEEB" transparent opacity={0.6} />
    </points>
  );
};

// Cloud component
const AnimatedCloud = ({ position }: { position: [number, number, number] }) => {
  const cloudRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      cloudRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      <Sphere args={[0.8, 16, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
      </Sphere>
      <Sphere args={[0.6, 16, 16]} position={[0.7, 0.2, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
      </Sphere>
      <Sphere args={[0.5, 16, 16]} position={[-0.6, 0.1, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
      </Sphere>
      <Sphere args={[0.4, 16, 16]} position={[0.3, 0.4, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
      </Sphere>
    </group>
  );
};

// Landmark components
const GatewayOfIndia = () => {
  return (
    <group position={[0, -2, 0]}>
      <Box args={[4, 0.5, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>
      <Box args={[3, 4, 2]} position={[0, 2.25, 0]}>
        <meshStandardMaterial color="#D2B48C" />
      </Box>
      <Box args={[2, 3, 0.5]} position={[0, 1.5, 1]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>
      <Sphere args={[0.8, 16, 16]} position={[0, 4.5, 0]}>
        <meshStandardMaterial color="#CD853F" />
      </Sphere>
      <Text
        position={[0, -0.8, 1.6]}
        fontSize={0.3}
        color="#8B4513"
        anchorX="center"
        anchorY="middle"
      >
        Gateway of India
      </Text>
    </group>
  );
};

const EiffelTower = () => {
  return (
    <group position={[0, -2, 0]}>
      <Box args={[0.2, 2, 0.2]} position={[-1, 1, -1]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      <Box args={[0.2, 2, 0.2]} position={[1, 1, -1]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      <Box args={[0.2, 2, 0.2]} position={[-1, 1, 1]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      <Box args={[0.2, 2, 0.2]} position={[1, 1, 1]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      <Box args={[0.3, 3, 0.3]} position={[0, 3.5, 0]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      <Box args={[0.1, 1, 0.1]} position={[0, 5.5, 0]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      <Text
        position={[0, -0.8, 2]}
        fontSize={0.3}
        color="#4A4A4A"
        anchorX="center"
        anchorY="middle"
      >
        Eiffel Tower
      </Text>
    </group>
  );
};

const StatueOfLiberty = () => {
  return (
    <group position={[0, -2, 0]}>
      <Box args={[2, 1, 2]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>
      <Box args={[0.8, 3, 0.8]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#40E0D0" />
      </Box>
      <Sphere args={[0.4, 16, 16]} position={[0, 4.2, 0]}>
        <meshStandardMaterial color="#40E0D0" />
      </Sphere>
      <Box args={[0.1, 1, 0.1]} position={[0.6, 4.8, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Box>
      <Sphere args={[0.2, 16, 16]} position={[0.6, 5.3, 0]}>
        <meshStandardMaterial color="#FFA500" />
      </Sphere>
      <Text
        position={[0, -0.3, 1.5]}
        fontSize={0.25}
        color="#40E0D0"
        anchorX="center"
        anchorY="middle"
      >
        Statue of Liberty
      </Text>
    </group>
  );
};

const TokyoTower = () => {
  return (
    <group position={[0, -2, 0]}>
      <Box args={[0.3, 4, 0.3]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#FF4500" />
      </Box>
      <Box args={[2, 0.2, 0.2]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
      <Box args={[1.5, 0.2, 0.2]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
      <Box args={[1, 0.2, 0.2]} position={[0, 3.5, 0]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Box>
      <Box args={[0.1, 1.5, 0.1]} position={[0, 4.75, 0]}>
        <meshStandardMaterial color="#FF4500" />
      </Box>
      <Text
        position={[0, -0.8, 1.8]}
        fontSize={0.3}
        color="#FF4500"
        anchorX="center"
        anchorY="middle"
      >
        Tokyo Tower
      </Text>
    </group>
  );
};

const BigBen = () => {
  return (
    <group position={[0, -2, 0]}>
      <Box args={[1.5, 5, 1.5]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#D2B48C" />
      </Box>
      <Sphere args={[0.6, 16, 16]} position={[0, 4, 0.8]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Sphere>
      <Box args={[0.3, 1.5, 0.3]} position={[0, 5.75, 0]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>
      <Text
        position={[0, -0.8, 1.8]}
        fontSize={0.3}
        color="#8B7355"
        anchorX="center"
        anchorY="middle"
      >
        Big Ben
      </Text>
    </group>
  );
};

const BurjKhalifa = () => {
  return (
    <group position={[0, -2, 0]}>
      <Box args={[1.5, 1, 1.5]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#C0C0C0" />
      </Box>
      <Box args={[1, 6, 1]} position={[0, 3.5, 0]}>
        <meshStandardMaterial color="#E6E6FA" />
      </Box>
      <Box args={[0.6, 2, 0.6]} position={[0, 7, 0]}>
        <meshStandardMaterial color="#E6E6FA" />
      </Box>
      <Box args={[0.1, 1.5, 0.1]} position={[0, 8.75, 0]}>
        <meshStandardMaterial color="#FFD700" />
      </Box>
      <Text
        position={[0, -0.8, 1.8]}
        fontSize={0.3}
        color="#C0C0C0"
        anchorX="center"
        anchorY="middle"
      >
        Burj Khalifa
      </Text>
    </group>
  );
};

const SydneyOperaHouse = () => {
  return (
    <group position={[0, -2, 0]}>
      <Box args={[4, 0.3, 3]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>
      <Sphere args={[1.2, 16, 8]} position={[-0.8, 1.5, 0]} scale={[1, 1.5, 0.8]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Sphere>
      <Sphere args={[1, 16, 8]} position={[0.8, 1.3, 0]} scale={[1, 1.3, 0.8]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Sphere>
      <Sphere args={[0.8, 16, 8]} position={[0, 1.8, -0.5]} scale={[1, 1.2, 0.6]}>
        <meshStandardMaterial color="#FFFFFF" />
      </Sphere>
      <Text
        position={[0, -0.6, 2]}
        fontSize={0.25}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        Sydney Opera House
      </Text>
    </group>
  );
};

const landmarks = {
  gateway: GatewayOfIndia,
  eiffel: EiffelTower,
  liberty: StatueOfLiberty,
  tokyo: TokyoTower,
  bigben: BigBen,
  burj: BurjKhalifa,
  opera: SydneyOperaHouse,
};

const WeatherScene: React.FC<WeatherSceneProps> = ({ weather, landmark, loading }) => {
  const LandmarkComponent = landmarks[landmark as keyof typeof landmarks] || GatewayOfIndia;
  
  const getBackgroundColor = () => {
    switch (weather) {
      case 'rain': return '#4A5568';
      case 'clouds': return '#718096';
      case 'snow': return '#E2E8F0';
      case 'clear': return '#87CEEB';
      default: return '#87CEEB';
    }
  };

  const getLighting = () => {
    switch (weather) {
      case 'rain': return 0.3;
      case 'clouds': return 0.5;
      case 'snow': return 0.7;
      case 'clear': return 1;
      default: return 1;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-blue-200">
        <div className="text-white text-xl">Loading 3D Scene...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <color attach="background" args={[getBackgroundColor()]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={getLighting()} 
          castShadow
        />
        
        <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <meshStandardMaterial color="#90EE90" />
        </Plane>
        
        <LandmarkComponent />
        
        {weather === 'rain' && <RainParticles />}
        {weather === 'clouds' && (
          <>
            <AnimatedCloud position={[-3, 3, -2]} />
            <AnimatedCloud position={[4, 4, -3]} />
            <AnimatedCloud position={[1, 5, -4]} />
          </>
        )}
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          enableRotate={true}
          maxDistance={15}
          minDistance={3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default WeatherScene;

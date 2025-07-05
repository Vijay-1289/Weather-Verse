
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface WeatherSceneProps {
  weather: string;
  landmark: string;
  loading: boolean;
}

// Rain particles component
const RainParticles = () => {
  const particles = useRef<THREE.Points>(null);
  const particleCount = 500;
  
  const { positions, geometry } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 20;     // x
      pos[i + 1] = Math.random() * 20;         // y
      pos[i + 2] = (Math.random() - 0.5) * 20; // z
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    
    return { positions: pos, geometry: geom };
  }, []);

  useFrame(() => {
    if (particles.current?.geometry?.attributes?.position) {
      const pos = particles.current.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= 0.1; // Fall speed
        if (pos[i] < -10) pos[i] = 10; // Reset position
      }
      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particles} geometry={geometry}>
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
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.7, 0.2, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.6, 0.1, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.3, 0.4, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

// Landmark components
const GatewayOfIndia = () => {
  return (
    <group position={[0, -2, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.5, 3]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh position={[0, 2.25, 0]}>
        <boxGeometry args={[3, 4, 2]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>
      <mesh position={[0, 1.5, 1]}>
        <boxGeometry args={[2, 3, 0.5]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#CD853F" />
      </mesh>
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
      <mesh position={[-1, 1, -1]}>
        <boxGeometry args={[0.2, 2, 0.2]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      <mesh position={[1, 1, -1]}>
        <boxGeometry args={[0.2, 2, 0.2]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      <mesh position={[-1, 1, 1]}>
        <boxGeometry args={[0.2, 2, 0.2]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      <mesh position={[1, 1, 1]}>
        <boxGeometry args={[0.2, 2, 0.2]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[0.3, 3, 0.3]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
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
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[0.8, 3, 0.8]} />
        <meshStandardMaterial color="#40E0D0" />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#40E0D0" />
      </mesh>
      <mesh position={[0.6, 4.8, 0]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.6, 5.3, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
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
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.3, 4, 0.3]} />
        <meshStandardMaterial color="#FF4500" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 0.2, 0.2]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1.5, 0.2, 0.2]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[1, 0.2, 0.2]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 4.75, 0]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#FF4500" />
      </mesh>
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
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1.5, 5, 1.5]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>
      <mesh position={[0, 4, 0.8]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 5.75, 0]}>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
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
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#C0C0C0" />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[1, 6, 1]} />
        <meshStandardMaterial color="#E6E6FA" />
      </mesh>
      <mesh position={[0, 7, 0]}>
        <boxGeometry args={[0.6, 2, 0.6]} />
        <meshStandardMaterial color="#E6E6FA" />
      </mesh>
      <mesh position={[0, 8.75, 0]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
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
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[4, 0.3, 3]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh position={[-0.8, 1.5, 0]} scale={[1, 1.5, 0.8]}>
        <sphereGeometry args={[1.2, 16, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.8, 1.3, 0]} scale={[1, 1.3, 0.8]}>
        <sphereGeometry args={[1, 16, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 1.8, -0.5]} scale={[1, 1.2, 0.6]}>
        <sphereGeometry args={[0.8, 16, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
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
      <Canvas 
        camera={{ position: [0, 2, 8], fov: 60 }}
        onCreated={({ gl }) => {
          gl.setClearColor(getBackgroundColor());
        }}
      >
        <color attach="background" args={[getBackgroundColor()]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={getLighting()} 
          castShadow
        />
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#90EE90" />
        </mesh>
        
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

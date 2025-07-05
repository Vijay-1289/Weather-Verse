
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface WeatherSceneProps {
  weather: string;
  landmark: string;
  loading: boolean;
}

// Realistic 2D-style rain particles
const RainParticles = () => {
  const particles = useRef<THREE.Points>(null);
  const particleCount = 800;
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 30;     // x - wider spread
      pos[i + 1] = Math.random() * 25 + 5;     // y - start above scene
      pos[i + 2] = (Math.random() - 0.5) * 25; // z
      vel[i / 3] = Math.random() * 0.1 + 0.15; // individual fall speeds
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
        pos[idx + 1] -= velocities[i]; // Fall with individual speed
        
        // Add slight wind effect
        pos[idx] += Math.sin(Date.now() * 0.001 + i) * 0.01;
        
        // Reset particle when it hits ground
        if (pos[idx + 1] < -5) {
          pos[idx + 1] = 20 + Math.random() * 5;
          pos[idx] = (Math.random() - 0.5) * 30;
        }
      }
      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particles} geometry={geometry}>
      <pointsMaterial 
        size={0.03} 
        color="#4A90E2" 
        transparent 
        opacity={0.7}
        sizeAttenuation={false}
      />
    </points>
  );
};

// Realistic 2D-style snow particles
const SnowParticles = () => {
  const particles = useRef<THREE.Points>(null);
  const particleCount = 400;
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 2);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 35;
      pos[i + 1] = Math.random() * 25 + 5;
      pos[i + 2] = (Math.random() - 0.5) * 30;
      vel[(i / 3) * 2] = Math.random() * 0.02 + 0.02; // fall speed
      vel[(i / 3) * 2 + 1] = Math.random() * 0.5; // drift phase
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
        
        // Gentle falling
        pos[idx + 1] -= velocities[velIdx];
        
        // Realistic drifting motion
        pos[idx] += Math.sin(state.clock.elapsedTime + velocities[velIdx + 1]) * 0.015;
        pos[idx + 2] += Math.cos(state.clock.elapsedTime * 0.5 + velocities[velIdx + 1]) * 0.01;
        
        // Reset when hitting ground
        if (pos[idx + 1] < -5) {
          pos[idx + 1] = 20 + Math.random() * 5;
          pos[idx] = (Math.random() - 0.5) * 35;
          pos[idx + 2] = (Math.random() - 0.5) * 30;
        }
      }
      particles.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particles} geometry={geometry}>
      <pointsMaterial 
        size={0.08} 
        color="#FFFFFF" 
        transparent 
        opacity={0.8}
        sizeAttenuation={false}
      />
    </points>
  );
};

// More realistic 3D clouds with natural movement
const AnimatedCloud = ({ position }: { position: [number, number, number] }) => {
  const cloudRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cloudRef.current) {
      // Gentle horizontal drift
      cloudRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.2) * 1.5;
      cloudRef.current.position.z = position[2] + Math.cos(state.clock.elapsedTime * 0.15) * 0.8;
      
      // Subtle vertical bobbing
      cloudRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      
      // Very slow rotation
      cloudRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={cloudRef} position={position}>
      {/* Main cloud body with realistic proportions */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshStandardMaterial color="#F0F8FF" transparent opacity={0.9} />
      </mesh>
      <mesh position={[1.2, 0.3, 0.2]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#F5F5F5" transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.9, 0.2, -0.1]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#F8F8FF" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.5, 0.6, 0.1]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#FFFAFA" transparent opacity={0.75} />
      </mesh>
      <mesh position={[-0.3, 0.5, 0.3]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#F0F0F0" transparent opacity={0.7} />
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
      case 'clouds': return '#87CEEB';
      case 'snow': return '#F0F8FF';
      case 'clear': return '#87CEEB';
      default: return '#87CEEB';
    }
  };

  const getLighting = () => {
    switch (weather) {
      case 'rain': return 0.4;
      case 'clouds': return 0.6;
      case 'snow': return 0.8;
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
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={getLighting()} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#90EE90" />
        </mesh>
        
        <LandmarkComponent />
        
        {/* Weather effects */}
        {weather === 'rain' && <RainParticles />}
        {weather === 'snow' && <SnowParticles />}
        {weather === 'clouds' && (
          <>
            <AnimatedCloud position={[-4, 6, -3]} />
            <AnimatedCloud position={[5, 7, -4]} />
            <AnimatedCloud position={[2, 8, -5]} />
            <AnimatedCloud position={[-2, 6.5, -2]} />
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


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
      pos[i] = (Math.random() - 0.5) * 30;
      pos[i + 1] = Math.random() * 25 + 5;
      pos[i + 2] = (Math.random() - 0.5) * 25;
      vel[i / 3] = Math.random() * 0.1 + 0.15;
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
        pos[idx] += Math.sin(Date.now() * 0.001 + i) * 0.01;
        
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
      vel[(i / 3) * 2] = Math.random() * 0.02 + 0.02;
      vel[(i / 3) * 2 + 1] = Math.random() * 0.5;
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
        pos[idx] += Math.sin(state.clock.elapsedTime + velocities[velIdx + 1]) * 0.015;
        pos[idx + 2] += Math.cos(state.clock.elapsedTime * 0.5 + velocities[velIdx + 1]) * 0.01;
        
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
      cloudRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.2) * 1.5;
      cloudRef.current.position.z = position[2] + Math.cos(state.clock.elapsedTime * 0.15) * 0.8;
      cloudRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      cloudRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={cloudRef} position={position}>
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

// Hyper-realistic Gateway of India - Actual dimensions: 26m height, Indo-Saracenic architecture
const GatewayOfIndia = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Base platform - scaled to real proportions */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.4, 6]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Main structure with detailed Indo-Saracenic design */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[6, 5, 3]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.6} metalness={0.2} />
      </mesh>
      
      {/* Central arch - realistic proportions */}
      <mesh position={[0, 2.5, 1.6]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 4, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#8B7355" roughness={0.7} />
      </mesh>
      
      {/* Side pillars with capitals */}
      <mesh position={[-2.5, 2.8, 1.6]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 4.5, 16]} />
        <meshStandardMaterial color="#CD853F" roughness={0.5} />
      </mesh>
      <mesh position={[2.5, 2.8, 1.6]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 4.5, 16]} />
        <meshStandardMaterial color="#CD853F" roughness={0.5} />
      </mesh>
      
      {/* Ornate capitals */}
      <mesh position={[-2.5, 5, 1.6]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#DEB887" roughness={0.4} />
      </mesh>
      <mesh position={[2.5, 5, 1.6]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#DEB887" roughness={0.4} />
      </mesh>
      
      {/* Central dome with realistic proportions */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 32, 16]} />
        <meshStandardMaterial color="#CD853F" roughness={0.3} metalness={0.4} />
      </mesh>
      
      {/* Detailed minarets */}
      <mesh position={[-2.8, 6.2, -1]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 2.5, 16]} />
        <meshStandardMaterial color="#DEB887" roughness={0.5} />
      </mesh>
      <mesh position={[2.8, 6.2, -1]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 2.5, 16]} />
        <meshStandardMaterial color="#DEB887" roughness={0.5} />
      </mesh>
      
      {/* Finial on dome */}
      <mesh position={[0, 7.8, 0]} castShadow>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshStandardMaterial color="#B8860B" roughness={0.2} metalness={0.8} />
      </mesh>
      
      <Text
        position={[0, -0.8, 3.5]}
        fontSize={0.4}
        color="#8B4513"
        anchorX="center"
        anchorY="middle"
        font="/fonts/arial.woff"
      >
        Gateway of India
      </Text>
    </group>
  );
};

// Hyper-realistic Eiffel Tower - Actual dimensions: 330m height, iron lattice structure
const EiffelTower = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Base level supports - accurate structural design */}
      <mesh position={[-1.5, 1.5, -1.5]} castShadow>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      <mesh position={[1.5, 1.5, -1.5]} castShadow>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      <mesh position={[-1.5, 1.5, 1.5]} castShadow>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      <mesh position={[1.5, 1.5, 1.5]} castShadow>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      
      {/* Cross bracing at first level */}
      <mesh position={[0, 1.5, -1.5]} rotation={[0, 0, Math.PI/4]} castShadow>
        <boxGeometry args={[0.08, 2.12, 0.08]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, 1.5]} rotation={[0, 0, -Math.PI/4]} castShadow>
        <boxGeometry args={[0.08, 2.12, 0.08]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      
      {/* Second level structure */}
      <mesh position={[-0.8, 4.5, -0.8]} castShadow>
        <boxGeometry args={[0.12, 3, 0.12]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      <mesh position={[0.8, 4.5, -0.8]} castShadow>
        <boxGeometry args={[0.12, 3, 0.12]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      <mesh position={[-0.8, 4.5, 0.8]} castShadow>
        <boxGeometry args={[0.12, 3, 0.12]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      <mesh position={[0.8, 4.5, 0.8]} castShadow>
        <boxGeometry args={[0.12, 3, 0.12]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      
      {/* Top section - tapered design */}
      <mesh position={[0, 7.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.25, 4, 8]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.8} metalness={0.7} />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[0, 10, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.6} metalness={0.9} />
      </mesh>
      
      {/* Platform details */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[2.5, 0.1, 2.5]} />
        <meshStandardMaterial color="#5A5A5A" roughness={0.7} metalness={0.5} />
      </mesh>
      <mesh position={[0, 6, 0]} castShadow>
        <boxGeometry args={[1.2, 0.08, 1.2]} />
        <meshStandardMaterial color="#5A5A5A" roughness={0.7} metalness={0.5} />
      </mesh>
      
      <Text
        position={[0, -0.8, 2.5]}
        fontSize={0.35}
        color="#4A4A4A"
        anchorX="center"
        anchorY="middle"
      >
        Tour Eiffel
      </Text>
    </group>
  );
};

// Hyper-realistic Statue of Liberty - Actual dimensions: 93m total height including pedestal
const StatueOfLiberty = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Detailed pedestal base */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 3, 1.6, 16]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      
      {/* Pedestal middle section */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[2, 2.5, 2.4, 16]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>
      
      {/* Upper pedestal */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <cylinderGeometry args={[1.5, 2, 1.4, 16]} />
        <meshStandardMaterial color="#8B7355" roughness={0.9} />
      </mesh>
      
      {/* Statue body with realistic proportions */}
      <mesh position={[0, 6.5, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 3.5, 16]} />
        <meshStandardMaterial color="#40E0D0" roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Head with crown details */}
      <mesh position={[0, 8.8, 0]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#40E0D0" roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Crown with spikes */}
      <mesh position={[0, 9.4, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#40E0D0" roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Crown spikes */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh 
          key={i}
          position={[
            Math.cos((i / 7) * Math.PI * 2) * 0.45,
            9.8,
            Math.sin((i / 7) * Math.PI * 2) * 0.45
          ]} 
          castShadow
        >
          <coneGeometry args={[0.05, 0.6, 8]} />
          <meshStandardMaterial color="#40E0D0" roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      
      {/* Right arm with torch */}
      <mesh position={[0.8, 7.8, 0]} rotation={[0, 0, -Math.PI/6]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1.5, 16]} />
        <meshStandardMaterial color="#40E0D0" roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Torch */}
      <mesh position={[1.3, 8.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
        <meshStandardMaterial color="#B8860B" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Torch flame */}
      <mesh position={[1.3, 9.2, 0]} castShadow>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FF4500" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Left arm with tablet */}
      <mesh position={[-0.6, 7.3, 0.2]} rotation={[0, 0, Math.PI/8]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 1.2, 16]} />
        <meshStandardMaterial color="#40E0D0" roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Tablet */}
      <mesh position={[-0.9, 6.8, 0.3]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.08]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
      
      <Text
        position={[0, -0.3, 2.5]}
        fontSize={0.3}
        color="#40E0D0"
        anchorX="center"
        anchorY="middle"
      >
        Statue of Liberty
      </Text>
    </group>
  );
};

// Hyper-realistic Tokyo Tower - Actual dimensions: 333m height, red and white structure
const TokyoTower = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Base structure with accurate proportions */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.4, 6, 8]} />
        <meshStandardMaterial color="#FF4500" roughness={0.6} metalness={0.3} />
      </mesh>
      
      {/* White bands - characteristic feature */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.25, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
      
      {/* Observation decks */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.15, 16]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Support beams - characteristic X-pattern */}
      <mesh position={[0.25, 2, 0]} rotation={[0, 0, Math.PI/4]} castShadow>
        <boxGeometry args={[0.05, 1.4, 0.05]} />
        <meshStandardMaterial color="#FF4500" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[-0.25, 2, 0]} rotation={[0, 0, -Math.PI/4]} castShadow>
        <boxGeometry args={[0.05, 1.4, 0.05]} />
        <meshStandardMaterial color="#FF4500" roughness={0.6} metalness={0.3} />
      </mesh>
      
      {/* Top antenna section */}
      <mesh position={[0, 7, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.1, 2.5, 8]} />
        <meshStandardMaterial color="#FF4500" roughness={0.6} metalness={0.3} />
      </mesh>
      
      {/* Antenna tip */}
      <mesh position={[0, 8.5, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Lighting arrays */}
      <mesh position={[0, 6.2, 0]} castShadow>
        <torusGeometry args={[0.12, 0.02, 8, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.2} />
      </mesh>
      
      <Text
        position={[0, -0.8, 2.2]}
        fontSize={0.35}
        color="#FF4500"
        anchorX="center"
        anchorY="middle"
      >
        東京タワー
      </Text>
    </group>
  );
};

// Hyper-realistic Big Ben - Actual dimensions: 96m height, Gothic Revival architecture
const BigBen = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Base structure with Gothic details */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[2, 7, 2]} />
        <meshStandardMaterial color="#D2B48C" roughness={0.7} />
      </mesh>
      
      {/* Gothic windows */}
      <mesh position={[0, 2.5, 1.05]} castShadow>
        <boxGeometry args={[0.8, 1.5, 0.1]} />
        <meshStandardMaterial color="#2F4F4F" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.5, 1.05]} castShadow>
        <boxGeometry args={[0.8, 1.5, 0.1]} />
        <meshStandardMaterial color="#2F4F4F" roughness={0.9} />
      </mesh>
      
      {/* Clock faces on four sides */}
      <mesh position={[0, 5.5, 1.05]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      <mesh position={[1.05, 5.5, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      <mesh position={[0, 5.5, -1.05]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      <mesh position={[-1.05, 5.5, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      
      {/* Clock hands */}
      <mesh position={[0, 5.5, 1.1]} rotation={[0, 0, Math.PI/6]} castShadow>
        <boxGeometry args={[0.03, 0.5, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, 5.5, 1.1]} rotation={[0, 0, -Math.PI/3]} castShadow>
        <boxGeometry args={[0.03, 0.3, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Spire with detailed Gothic architecture */}
      <mesh position={[0, 8, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1.2, 2.5, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
      
      {/* Ornate corners */}
      <mesh position={[0.8, 8, 0.8]} castShadow>
        <coneGeometry args={[0.15, 1, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
      <mesh position={[-0.8, 8, 0.8]} castShadow>
        <coneGeometry args={[0.15, 1, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 8, -0.8]} castShadow>
        <coneGeometry args={[0.15, 1, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
      <mesh position={[-0.8, 8, -0.8]} castShadow>
        <coneGeometry args={[0.15, 1, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
      
      {/* Final spire point */}
      <mesh position={[0, 9.8, 0]} castShadow>
        <coneGeometry args={[0.3, 1.5, 8]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
      
      <Text
        position={[0, -0.8, 2.5]}
        fontSize={0.35}
        color="#8B7355"
        anchorX="center"
        anchorY="middle"
      >
        Big Ben
      </Text>
    </group>
  );
};

// Hyper-realistic Burj Khalifa - Actual dimensions: 828m height, modern Islamic architecture
const BurjKhalifa = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Base podium */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.5, 1.6, 6]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Lower section with Y-shaped plan */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.8, 5, 6]} />
        <meshStandardMaterial color="#E6E6FA" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Middle section - setbacks */}
      <mesh position={[0, 7, 0]} castShadow>
        <cylinderGeometry args={[0.9, 1.2, 4, 6]} />
        <meshStandardMaterial color="#E6E6FA" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Upper section */}
      <mesh position={[0, 10, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.9, 3, 6]} />
        <meshStandardMaterial color="#E6E6FA" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Top section - needle */}
      <mesh position={[0, 12.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.6, 2, 6]} />
        <meshStandardMaterial color="#E6E6FA" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Spire */}
      <mesh position={[0, 14.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.3, 2.5, 8]} />
        <meshStandardMaterial color="#C0C0C0" roughness={0.1} metalness={0.9} />
      </mesh>
      
      {/* Final spire tip */}
      <mesh position={[0, 16.2, 0]} castShadow>
        <coneGeometry args={[0.08, 0.8, 8]} />
        <meshStandardMaterial color="#FFD700" roughness={0.1} metalness={0.9} />
      </mesh>
      
      {/* Glass facade details - horizontal bands */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh 
          key={i}
          position={[0, 1.5 + i * 0.7, 0]} 
          castShadow
        >
          <torusGeometry args={[1.8 - (i * 0.05), 0.02, 8, 32]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} roughness={0.1} metalness={0.9} />
        </mesh>
      ))}
      
      {/* LED lighting system */}
      <mesh position={[0, 8, 0]} castShadow>
        <torusGeometry args={[1.1, 0.03, 8, 32]} />
        <meshStandardMaterial color="#00FFFF" emissive="#00BFFF" emissiveIntensity={0.3} />
      </mesh>
      
      <Text
        position={[0, -0.8, 3]}
        fontSize={0.35}
        color="#C0C0C0"
        anchorX="center"
        anchorY="middle"
      >
        برج خليفة
      </Text>
    </group>
  );
};

// Hyper-realistic Sydney Opera House - Actual dimensions: unique shell architecture
const SydneyOperaHouse = () => {
  return (
    <group position={[0, -2, 0]}>
      {/* Detailed platform base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4, 4.5, 0.4, 32]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
      
      {/* Concrete steps */}
      <mesh position={[0, 0.5, 2]} castShadow>
        <boxGeometry args={[8, 0.2, 1]} />
        <meshStandardMaterial color="#A0A0A0" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.7, 1.5]} castShadow>
        <boxGeometry args={[7, 0.2, 1]} />
        <meshStandardMaterial color="#A0A0A0" roughness={0.7} />
      </mesh>
      
      {/* Main shell structures - highly detailed */}
      <mesh position={[-1.5, 2.8, 0]} scale={[1.2, 2, 1]} rotation={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[1.5, 16, 8, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1} 
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      <mesh position={[0.2, 2.5, 0]} scale={[1, 1.8, 1]} rotation={[0, -0.2, 0]} castShadow>
        <sphereGeometry args={[1.3, 16, 8, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1} 
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      <mesh position={[1.8, 2.2, 0]} scale={[0.9, 1.5, 0.9]} rotation={[0, -0.5, 0]} castShadow>
        <sphereGeometry args={[1.1, 16, 8, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1} 
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Secondary smaller shells */}
      <mesh position={[-0.5, 2.1, -1.2]} scale={[0.8, 1.3, 0.8]} rotation={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[1, 16, 8, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1} 
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      <mesh position={[1.2, 1.8, -1]} scale={[0.7, 1.1, 0.7]} rotation={[0, -0.6, 0]} castShadow>
        <sphereGeometry args={[0.9, 16, 8, 0, Math.PI]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.1} 
          metalness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Detailed ribbing on shells */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh 
          key={i}
          position={[-1.5 + (i * 0.15), 2.8, 0]} 
          rotation={[0, (i * 0.1) - 0.6, Math.PI/2]}
          castShadow
        >
          <cylinderGeometry args={[0.02, 0.02, 2.5, 8]} />
          <meshStandardMaterial color="#F5F5F5" roughness={0.3} />
        </mesh>
      ))}
      
      {/* Glass walls */}
      <mesh position={[-1.5, 1.5, 0.5]} castShadow>
        <boxGeometry args={[2, 2, 0.05]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.3} 
          roughness={0.1} 
          metalness={0.1} 
        />
      </mesh>
      
      <mesh position={[0.5, 1.3, 0.5]} castShadow>
        <boxGeometry args={[1.5, 1.8, 0.05]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.3} 
          roughness={0.1} 
          metalness={0.1} 
        />
      </mesh>
      
      <Text
        position={[0, -0.6, 3.5]}
        fontSize={0.3}
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
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <color attach="background" args={[getBackgroundColor()]} />
        
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[10, 15, 5]} 
          intensity={getLighting()} 
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        
        {/* Additional lighting for realism */}
        <pointLight position={[-5, 10, 5]} intensity={0.3} color="#FFA500" />
        <pointLight position={[5, 8, -3]} intensity={0.2} color="#87CEEB" />
        
        {/* Enhanced ground plane with texture-like appearance */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial 
            color="#228B22" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Ground details - pathways */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.98, 0]} receiveShadow>
          <planeGeometry args={[8, 20]} />
          <meshStandardMaterial 
            color="#696969" 
            roughness={0.9}
          />
        </mesh>
        
        <LandmarkComponent />
        
        {/* Enhanced weather effects */}
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
          maxDistance={20}
          minDistance={4}
          maxPolarAngle={Math.PI / 2}
          dampingFactor={0.05}
          enableDamping={true}
        />
      </Canvas>
    </div>
  );
};

export default WeatherScene;

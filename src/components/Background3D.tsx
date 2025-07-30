import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Plane, shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

const GradientMaterial = shaderMaterial(
  {
    time: 0,
    colorA: new THREE.Color('#87CEEB'), // Sky Blue
    colorB: new THREE.Color('#FFC0CB'), // Pink
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 colorA;
    uniform vec3 colorB;
    varying vec2 vUv;
    
    // Simplex noise function (2D)
    float noise(vec2 p) {
      return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Create animated gradient effect
      float wave1 = sin(uv.x * 3.0 + time * 0.5) * 0.1;
      float wave2 = cos(uv.y * 2.0 + time * 0.3) * 0.1;
      float gradient = uv.y + wave1 + wave2;
      
      // Mix colors based on gradient
      vec3 color = mix(colorA, colorB, gradient);
      
      // Add subtle moving cloud effect using noise
      float cloud = noise(uv * 10.0 + vec2(time * 0.1, time * 0.1));
      color += cloud * 0.1;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ GradientMaterial });

function AnimatedBackground() {
  const materialRef = useRef<any>();
  const gradientMaterial = React.useMemo(() => new GradientMaterial(), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
  });

  return (
    <Plane args={[20, 20]} position={[0, 0, -5]}>
      <primitive object={gradientMaterial} ref={materialRef} attach="material" />
    </Plane>
  );
}

const Background3D: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 z-0 w-full h-full" 
      style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #FFC0CB 100%)' }}
    >
      <Canvas 
        style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }} 
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Plane args={[200, 200]} position={[0, 0, -5]}>
          <AnimatedBackground />
        </Plane>
      </Canvas>
    </div>
  );
};

export default Background3D;
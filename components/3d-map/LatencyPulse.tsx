'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LatencyPulseProps {
  position: [number, number, number];
  color: string;
  speed?: number;
}

const LatencyPulse = ({ position, color, speed = 1 }: LatencyPulseProps) => {
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const time = state.clock.getElapsedTime() * speed;
      const scale = 1 + Math.sin(time) * 0.5;
      pulseRef.current.scale.setScalar(scale);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + 0.5 * Math.sin(time);
    }
  });

  return (
    <mesh ref={pulseRef} position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default LatencyPulse;
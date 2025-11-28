'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
      console.log(earthRef.current.rotation.y);
     
    }
     console.log(state);
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0015;
    }
  });

  // Create a more realistic Earth material without textures
  const earthMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: '#1e40af', // Blue oceans
      specular: '#ffffff',
      shininess: 5,
      transparent: true,
      opacity: 0.95,
    });
  }, []);

  const landMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: '#22c55e', // Green land
      transparent: true,
      opacity: 0.4,
    });
  }, []);

  const cloudsMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.3,
    });
  }, []);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#3b82f6',
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
  }, []);

  return (
    <group>
      {/* Main Earth Sphere - Oceans */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <primitive object={earthMaterial} attach="material" />
      </mesh>

      {/* Land Masses - Simplified continents */}
      <mesh rotation={[0, 0, 0]}>
        <sphereGeometry args={[5.02, 48, 48]} />
        <primitive object={landMaterial} attach="material" />
      </mesh>

      {/* Clouds Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[5.1, 32, 32]} />
        <primitive object={cloudsMaterial} attach="material" />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh>
        <sphereGeometry args={[5.3, 32, 32]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>

      {/* Grid Lines for Countries */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[5.01, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.1}
          wireframe={true}
        />
      </mesh>
    </group>
  );
};

export default Earth;
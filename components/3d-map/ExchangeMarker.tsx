'use client';

import { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Exchange } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedExchange, setHoveredEntity, flyToEntity } from '@/lib/redux/slice/mapSlice';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { latLngToVector3, getProviderColor } from '@/lib/utils/geoUtils';

interface ExchangeMarkerProps {
  exchange: Exchange;
}

const ExchangeMarker = ({ exchange }: ExchangeMarkerProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedExchange, hoveredEntity } = useSelector((state: RootState) => state.map);
  
  const position = latLngToVector3(exchange.location.lat, exchange.location.lng, 5.1);
  const color = getProviderColor(exchange.cloudProvider);
  const isSelected = selectedExchange === exchange.id;
  const isHovered = hoveredEntity === exchange.id;

  useFrame((state) => {
    if (meshRef.current) {
      const scale = isSelected || isHovered ? 
        1.2 + Math.sin(state.clock.getElapsedTime() * 5) * 0.2 : 1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    dispatch(setSelectedExchange(exchange.id));
    dispatch(flyToEntity({
      type: 'exchange',
      id: exchange.id,
      position: position as [number, number, number]
    }));
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dispatch(setHoveredEntity(exchange.id));
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dispatch(setHoveredEntity(null));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'offline': return '#EF4444';
      case 'degraded': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0.12, 0.12, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={getStatusColor(exchange.status)} />
      </mesh>

      {(isSelected || isHovered) && (
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {exchange.name}
        </Text>
      )}

      {(isSelected || isHovered) && (
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
};

export default ExchangeMarker;
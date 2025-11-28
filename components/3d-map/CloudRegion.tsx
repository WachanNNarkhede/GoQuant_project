'use client';

import { useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { CloudRegion } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRegion, setHoveredEntity, flyToEntity } from '@/lib/redux/slice/mapSlice';
import { RootState } from '@/lib/redux/store';
import { latLngToVector3 } from '@/lib/utils/geoUtils';
import { ThreeEvent } from '@react-three/fiber';

interface CloudRegionProps {
  region: CloudRegion;
}

const CloudRegionComponent = ({ region }: CloudRegionProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const dispatch = useDispatch();
  const { selectedRegion, hoveredEntity } = useSelector((state: RootState) => state.map);
  
  const position = latLngToVector3(region.location.lat, region.location.lng, 5.15);
  const isSelected = selectedRegion === region.id;
  const isHovered = hoveredEntity === region.id;

  const boundaryGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    if (region.boundaries.length > 0) {
      const firstPoint = latLngToVector3(region.boundaries[0].lat, region.boundaries[0].lng, 5.05);
      shape.moveTo(firstPoint[0], firstPoint[1]);
      
      for (let i = 1; i < region.boundaries.length; i++) {
        const point = latLngToVector3(region.boundaries[i].lat, region.boundaries[i].lng, 5.05);
        shape.lineTo(point[0], point[1]);
      }
      
      shape.lineTo(firstPoint[0], firstPoint[1]);
    }
    
    const geometry = new THREE.ShapeGeometry(shape);
    return geometry;
  }, [region.boundaries]);

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dispatch(setSelectedRegion(region.id));
    dispatch(flyToEntity({
      type: 'region',
      id: region.id,
      position: position as [number, number, number]
    }));
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dispatch(setHoveredEntity(region.id));
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dispatch(setHoveredEntity(null));
  };

  return (
    <group position={position}>
      <mesh
        geometry={boundaryGeometry}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshBasicMaterial
          color={region.color}
          transparent
          opacity={isSelected ? 0.4 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial 
          color={region.color}
          emissive={region.color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {(isSelected || isHovered) && (
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {region.name}
        </Text>
      )}

      {(isSelected || isHovered) && (
        <Text
          position={[0, 0.15, 0]}
          fontSize={0.1}
          color="#D1D5DB"
          anchorX="center"
          anchorY="middle"
        >
          {region.serverCount} servers
        </Text>
      )}
    </group>
  );
};

export default CloudRegionComponent;
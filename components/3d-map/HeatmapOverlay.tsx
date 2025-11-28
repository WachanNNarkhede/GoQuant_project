'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { LatencyData } from '@/types';
import { latLngToVector3, getLatencyColor } from '@/lib/utils/geoUtils';

interface HeatmapOverlayProps {
  data: LatencyData[];
}

// Pure function to generate deterministic heatmap points
const generateHeatmapPoints = (data: LatencyData[]) => {
  const points: { position: [number, number, number]; intensity: number }[] = [];
  
  if (data.length === 0) return points;

  // Use a deterministic algorithm based on data properties
  data.forEach((item, itemIndex) => {
    const intensity = Math.min(item.latency / 200, 1);
    
    // Create multiple points along imaginary connection paths
    for (let i = 0; i < 3; i++) {
      // Use item properties for deterministic positioning
      const hash1 = item.from.charCodeAt(0) + item.to.charCodeAt(0);
      const hash2 = item.id.charCodeAt(0) + itemIndex;
      
      // Deterministic pseudo-random coordinates based on item properties
      const pseudoRandom1 = Math.sin(hash1 + i * 100) * 0.5 + 0.5;
      const pseudoRandom2 = Math.cos(hash2 + i * 50) * 0.5 + 0.5;
      
      const lat = (pseudoRandom1 - 0.5) * 60; // -30 to 30
      const lng = (pseudoRandom2 - 0.5) * 120; // -60 to 60
      
      const position = latLngToVector3(lat, lng, 5.02);
      
      points.push({
        position: position as [number, number, number],
        intensity,
      });
    }
  });

  return points;
};

const HeatmapOverlay = ({ data }: HeatmapOverlayProps) => {
  const heatmapPoints = useMemo(() => generateHeatmapPoints(data), [data]);

  return (
    <group>
      {heatmapPoints.map((point, index) => (
        <mesh key={`heatmap-${index}`} position={point.position}>
          <circleGeometry args={[0.08, 6]} />
          <meshBasicMaterial
            color={getLatencyColor(point.intensity * 200)}
            transparent
            opacity={point.intensity * 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default HeatmapOverlay;
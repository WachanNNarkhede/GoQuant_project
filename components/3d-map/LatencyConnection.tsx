"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { LatencyData } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { latLngToVector3, getLatencyColor } from "@/lib/utils/geoUtils";

interface LatencyConnectionProps {
  data: LatencyData;
}

type Entity = {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
};

const LatencyConnection = ({ data }: LatencyConnectionProps) => {
  const lineRef = useRef<THREE.Line<
    THREE.BufferGeometry,
    THREE.Material
  > | null>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [pulseProgress, setPulseProgress] = useState(0);

  const { exchanges, cloudRegions } = useSelector(
    (state: RootState) => state.latency
  );
  const { filters } = useSelector((state: RootState) => state.map);

  const fromEntity =
    exchanges.find((e) => e.id === data.from) ||
    cloudRegions.find((r) => r.id === data.from);
  const toEntity =
    exchanges.find((e) => e.id === data.to) ||
    cloudRegions.find((r) => r.id === data.to);

  const getEntityPosition = (entity: Entity | undefined) => {
    if (!entity) return [0, 0, 0];

    const { lat, lng } = entity.location;
    const result = latLngToVector3(lat, lng, 5.1) as THREE.Vector3 | number[];
    // Ensure consistent array format
    if (Array.isArray(result)) return result;
    return [
      (result as THREE.Vector3).x,
      (result as THREE.Vector3).y,
      (result as THREE.Vector3).z,
    ];
  };

  const points = useMemo(() => {
    if (!fromEntity || !toEntity) return [];

    const fromPos = getEntityPosition(fromEntity);
    const toPos = getEntityPosition(toEntity);

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(fromPos[0], fromPos[1], fromPos[2]),
      new THREE.Vector3(
        (fromPos[0] + toPos[0]) / 2,
        (fromPos[1] + toPos[1]) / 2 + 1,
        (fromPos[2] + toPos[2]) / 2
      ),
      new THREE.Vector3(toPos[0], toPos[1], toPos[2])
    );

    return curve.getPoints(20);
  }, [fromEntity, toEntity]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  const color = getLatencyColor(data.latency);
  const lineWidth = data.connectionStrength * 0.03 + 0.01;

  useFrame((state) => {
    if (
      lineRef.current &&
      lineRef.current.material &&
      !Array.isArray(lineRef.current.material)
    ) {
      const time = state.clock.getElapsedTime();
      (lineRef.current.material as THREE.LineBasicMaterial).opacity =
        0.6 + 0.4 * Math.sin(time * 2);
    }

    if (pulseRef.current && points.length > 0) {
      setPulseProgress((prev) => (prev + 0.01) % 1);
      const pulseIndex = Math.floor(pulseProgress * points.length);
      if (pulseIndex < points.length) {
        pulseRef.current.position.copy(points[pulseIndex]);
      }
    }
  });

  if (!fromEntity || !toEntity || !filters.showRealTime) return null;

  if (
    data.latency < filters.latencyRange[0] ||
    data.latency > filters.latencyRange[1]
  ) {
    return null;
  }

  return (
    <group>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>

      <primitive
        object={
          new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({
              color,
              transparent: true,
              opacity: 0.7,
              linewidth: lineWidth,
            })
          )
        }
        ref={lineRef}
      />

      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>

      {points.length > 0 && (
        <Text
          position={points[Math.floor(points.length / 2)]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {Math.round(data.latency)}ms
        </Text>
      )}
    </group>
  );
};
export default LatencyConnection;
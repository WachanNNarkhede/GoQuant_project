'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setCameraPosition } from '@/lib/redux/slice/mapSlice';
import Earth from './Earth';
import ExchangeMarker from './ExchangeMarker';
import CloudRegion from './CloudRegion';
import LatencyConnection from './LatencyConnection';
import HeatmapOverlay from './HeatmapOverlay';
import * as THREE from 'three';

// Simple fallback component
const MapFallback = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading 3D Visualization...</p>
      </div>
    </div>
  );
};

// Fixed Camera Controller
const CameraController = () => {
  const { camera } = useThree();
  const dispatch = useDispatch();
  const { camera: cameraState } = useSelector((state: RootState) => state.map);
  const cameraRef = useRef(camera);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useEffect(() => {
    const currentCamera = cameraRef.current;
    
    // Set initial camera position
    currentCamera.position.set(...cameraState.position);
    currentCamera.lookAt(new THREE.Vector3(...cameraState.target));
    currentCamera.updateProjectionMatrix();

    // Update camera position periodically
    const interval = setInterval(() => {
      const position = currentCamera.position;
      dispatch(setCameraPosition([position.x, position.y, position.z]));
    }, 1000);

    return () => clearInterval(interval);
  }, [cameraState, dispatch]);

  return null;
};

const WorldMap = () => {
  const { exchanges, cloudRegions, realTimeData, isInitialized } = useSelector((state: RootState) => state.latency);
  const { filters, searchQuery } = useSelector((state: RootState) => state.map);

  // Show fallback until data is initialized
  if (!isInitialized) {
    return <MapFallback />;
  }

  const filteredExchanges = exchanges.filter(exchange => {
    const matchesSearch = searchQuery === '' || 
      exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exchange.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exchange.location.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProvider = filters.cloudProviders.includes(exchange.cloudProvider);
    
    return matchesSearch && matchesProvider;
  });

  const filteredRegions = cloudRegions.filter(region => {
    const matchesSearch = searchQuery === '' || 
      region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProvider = filters.cloudProviders.includes(region.provider);
    
    return matchesSearch && matchesProvider;
  });

  const filteredConnections = realTimeData.filter(connection => {
    const fromEntity = exchanges.find(e => e.id === connection.from) || cloudRegions.find(r => r.id === connection.from);
    const toEntity = exchanges.find(e => e.id === connection.to) || cloudRegions.find(r => r.id === connection.to);
    
    if (!fromEntity || !toEntity) return false;
    
    const matchesLatencyRange = 
      connection.latency >= filters.latencyRange[0] && 
      connection.latency <= filters.latencyRange[1];
    
    return matchesLatencyRange;
  });

  return (
    <div className="w-full h-full bg-gray-900">
      <Canvas
        camera={{ 
          position: [0, 0, 15], 
          fov: 50,
          near: 0.1,
          far: 1000 
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "default" // Change to default for better compatibility
        }}
        dpr={1} // Simpler pixel ratio
      >
        <color attach="background" args={['#111827']} />
        
        <CameraController />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={6}
          maxDistance={30}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.5}
        />
        
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} />
        
        <Earth />
        <Stars radius={100} depth={50} count={500} factor={4} />
        
        {filteredExchanges.map((exchange) => (
          <ExchangeMarker key={exchange.id} exchange={exchange} />
        ))}
        
        {filters.showRegions && filteredRegions.map((region) => (
          <CloudRegion key={region.id} region={region} />
        ))}
        
        {filters.showRealTime && filteredConnections.map((data) => (
          <LatencyConnection key={data.id} data={data} />
        ))}
        
        {filters.showHeatmap && <HeatmapOverlay data={realTimeData} />}
      </Canvas>
    </div>
  );
};

export default WorldMap;
'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Header from '@/components/layout/Header';
import ControlPanel from '@/components/ui/ControlPanel';
import HistoricalLatencyChart from '@/components/charts/HistoricalLatencyChart';
import PerformanceMetrics from '@/components/charts/PerformanceMetrics';
import LatencyStats from '@/components/charts/LatencyStats'; // Make sure this is the component
import Legend from '@/components/ui/Legend';
import Tooltip from '@/components/ui/Tooltip';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import WorldMap from '@/components/3d-map/WorldMap';

export default function Home() {
  const { loading, exchanges, cloudRegions, isInitialized } = useSelector((state: RootState) => state.latency);
  const { sidebarOpen, theme } = useSelector((state: RootState) => state.ui);

  // Client-side only check
  if (typeof window === 'undefined') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner size="lg" text="Loading application..." />
      </div>
    );
  }

  return (
    <main className={`h-screen flex flex-col ${
      theme === 'dark' 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-gray-100'
    }`}>
      <Header />
      <Tooltip />

      <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <div className="w-96 bg-transparent p-4 space-y-4 overflow-y-auto">
            
            <ControlPanel />
            <PerformanceMetrics />
            <LatencyStats />
            <HistoricalLatencyChart />
            <Legend />
          </div>
        )}

        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 z-10">
              <LoadingSpinner size="lg" text="Loading real-time data..." />
            </div>
          )}
          
          {!isInitialized && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="text-white text-center">
                <LoadingSpinner size="lg" text="Initializing 3D visualization..." />
              </div>
            </div>
          )}
          
          <WorldMap />
        </div>
      </div>
    </main>
  );
}
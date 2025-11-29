'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Header from '@/components/layout/Header';
import ControlPanel from '@/components/ui/ControlPanel';
import HistoricalLatencyChart from '@/components/charts/HistoricalLatencyChart';
import PerformanceMetrics from '@/components/charts/PerformanceMetrics';
import LatencyStats from '@/components/charts/LatencyStats';
import Legend from '@/components/ui/Legend';
import Tooltip from '@/components/ui/Tooltip';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import WorldMap from '@/components/3d-map/WorldMap';

export default function Home() {
  const { loading, exchanges, cloudRegions, isInitialized } = useSelector((state: RootState) => state.latency);
  const { sidebarOpen, theme } = useSelector((state: RootState) => state.ui);

  return (
    <main className={`h-screen flex flex-col ${
      theme === 'dark' 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-gray-100'
    }`}>
      <Header />
      <Tooltip />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Responsive Behavior */}
        {sidebarOpen && (
          <div className="fixed lg:relative inset-y-0 left-0 z-40 w-80 lg:w-96 bg-white dark:bg-gray-900 lg:bg-transparent shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:transform-none">
            <div className="h-full overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm lg:bg-transparent p-4 space-y-4">
              <ControlPanel />
              <PerformanceMetrics />
              <LatencyStats />
              <HistoricalLatencyChart />
              <Legend />
            </div>
          </div>
        )}

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => {/* Add close sidebar dispatch if needed */}}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 relative min-w-0">
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
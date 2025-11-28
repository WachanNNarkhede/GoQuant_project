'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import LoadingSpinner from '../ui/LoadingSpinner';

const Header = () => {
  const { loading } = useSelector((state: RootState) => state.latency);

  return (
    <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Latency Topology Visualizer
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Real-time 3D visualization of exchange server latency across cloud providers
            </p>
          </div>
          <div className="flex items-center gap-4">
            {loading && (
              <div className="flex items-center gap-2 text-white/80">
                <LoadingSpinner size="sm" />
                <span className="text-sm">Updating data...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { toggleSidebar, toggleTheme } from '@/lib/redux/slice/uiSlice';
import { simulateRealTimeUpdate, fetchRealTimeLatency } from '@/lib/redux/slice/latencySlice';
import { 
  Globe, 
  Server, 
  Activity, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  RefreshCw, 
  Zap,
  Cloud,
  Network
} from 'lucide-react';

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, performanceMetrics, lastUpdated } = useSelector((state: RootState) => state.latency);
  const { theme, sidebarOpen } = useSelector((state: RootState) => state.ui);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Client-side only effect
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(fetchRealTimeLatency());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleSimulateUpdate = () => {
    dispatch(simulateRealTimeUpdate());
  };

  const formatLastUpdated = (timestamp: number) => {
    if (!isClient) return 'Loading...';
    
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  // Don't render anything during SSR
  if (!isClient) {
    return (
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm relative z-50">
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo & Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Latency Topology Visualizer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Network className="w-3 h-3" />
                  Real-time 3D visualization of exchange server latency across cloud providers
                </p>
              </div>
            </div>
          </div>

          {/* Center Section - Live Metrics */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {/* Live Status */}
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">LIVE</span>
              </div>

              {/* Performance Metrics */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {performanceMetrics.averageLatency.toFixed(1)}ms
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">Avg</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {performanceMetrics.totalConnections}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">Connections</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Cloud className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {performanceMetrics.packetLoss.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">Loss</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="flex items-center space-x-2">
            {/* Last Updated */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mr-4">
              <RefreshCw className="w-3 h-3" />
              <span>Updated {formatLastUpdated(lastUpdated)}</span>
            </div>

            {/* Manual Update Button */}
            <button
              onClick={handleSimulateUpdate}
              disabled={loading}
              className="hidden md:flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Simulate Update</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium hidden sm:block">Refresh</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Metrics Bar */}
      <div className="lg:hidden border-t border-gray-200 dark:border-gray-700">
        <div className="px-6 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Activity className="w-3 h-3 text-blue-500" />
                <span className="font-medium">{performanceMetrics.averageLatency.toFixed(1)}ms</span>
              </div>
              <div className="flex items-center space-x-1">
                <Server className="w-3 h-3 text-green-500" />
                <span className="font-medium">{performanceMetrics.totalConnections}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <RefreshCw className="w-3 h-3" />
              <span>{formatLastUpdated(lastUpdated)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Bar */}
      {loading && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="h-full bg-blue-400 animate-[loading_2s_ease-in-out_infinite]" 
               style={{ animation: 'loading 2s ease-in-out infinite' }}></div>
        </div>
      )}
    </header>
  );
};

export default Header;
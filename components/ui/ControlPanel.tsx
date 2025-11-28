'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { updateFilters, resetCamera } from '@/lib/redux/slice/mapSlice';
import { setTimeRange, setSelectedPair, fetchHistoricalLatency } from '@/lib/redux/slice/latencySlice';
import { toggleTheme, toggleSidebar } from '@/lib/redux/slice/uiSlice';
import { Filter, ZoomOut, Sun, Moon, Menu, Download } from 'lucide-react';
import SearchBar from './SearchBar';

const ControlPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filters } = useSelector((state: RootState) => state.map);
  const { timeRange, exchanges, cloudRegions, selectedPair } = useSelector((state: RootState) => state.latency);
  const { theme } = useSelector((state: RootState) => state.ui);

  const availablePairs = exchanges.flatMap(exchange =>
    cloudRegions.map(region => ({
      value: `${exchange.id}-${region.id}`,
      label: `${exchange.name} → ${region.name}`,
    }))
  );

  const handlePairSelect = (pair: string) => {
    dispatch(setSelectedPair(pair));
    if (pair) {
      dispatch(fetchHistoricalLatency({ pair, range: timeRange }));
    }
  };

  const exportData = () => {
    const data = {
      filters,
      timeRange,
      selectedPair,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `latency-data-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200">

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Controls
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
            title="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch(resetCamera())}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset Camera"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={exportData}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export Data"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <SearchBar />
        </div>

        {/* Connection Pair Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monitor Connection
          </label>
          <select
            value={selectedPair || ''}
            onChange={(e) => handlePairSelect(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a connection pair</option>
            {availablePairs.map(pair => (
              <option key={pair.value} value={pair.value}>
                {pair.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cloud Provider Filters */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Cloud Providers</h4>
          <div className="space-y-2">
            {[
              { id: 'aws', name: 'AWS', color: '#FF9900' },
              { id: 'gcp', name: 'GCP', color: '#4285F4' },
              { id: 'azure', name: 'Azure', color: '#0078D4' },
            ].map((provider) => (
              <label key={provider.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.cloudProviders.includes(provider.id)}
                  onChange={(e) => {
                    const newProviders = e.target.checked
                      ? [...filters.cloudProviders, provider.id]
                      : filters.cloudProviders.filter(p => p !== provider.id);
                    dispatch(updateFilters({ cloudProviders: newProviders }));
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: provider.color }}
                ></div>
                <span className="text-sm text-gray-700">{provider.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Latency Range Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Latency Range</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{filters.latencyRange[0]}ms</span>
              <span>{filters.latencyRange[1]}ms</span>
            </div>
            <div className="flex gap-2">
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={filters.latencyRange[0]}
                onChange={(e) => dispatch(updateFilters({ 
                  latencyRange: [parseInt(e.target.value), filters.latencyRange[1]] as [number, number] 
                }))}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={filters.latencyRange[1]}
                onChange={(e) => dispatch(updateFilters({ 
                  latencyRange: [filters.latencyRange[0], parseInt(e.target.value)] as [number, number] 
                }))}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Visualization Layers */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Visualization Layers</h4>
          <div className="space-y-2">
            {[
              { id: 'showRealTime', label: 'Real-time Data' },
              { id: 'showRegions', label: 'Cloud Regions' },
              { id: 'showHeatmap', label: 'Latency Heatmap' },
            ].map((layer) => (
              <label key={layer.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters[layer.id as keyof typeof filters] as boolean}
                  onChange={(e) => dispatch(updateFilters({ [layer.id]: e.target.checked }))}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{layer.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Time Range</h4>
          <select
            value={timeRange}
            onChange={(e) => dispatch(setTimeRange(e.target.value as '1h' | '24h' | '7d' | '30d'))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
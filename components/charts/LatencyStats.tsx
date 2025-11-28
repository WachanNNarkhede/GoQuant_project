'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Minus, Plus, TrendingUp, Clock, Activity, RefreshCw } from 'lucide-react';
import { getLatencyStatus } from '@/lib/utils/geoUtils';
import { format } from 'date-fns';

const LatencyStats = () => {
  const { historicalData, selectedPair, timeRange, updateCount, lastUpdated } = useSelector((state: RootState) => state.latency);

  const currentData = selectedPair 
    ? historicalData.find(data => data.pair === selectedPair && data.timeRange === timeRange)
    : null;

  if (!currentData || currentData.data.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Latency Statistics</h3>
        <div className="text-center text-gray-500 py-8">
          <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Select a connection pair to view statistics</p>
        </div>
      </div>
    );
  }

  const latestData = currentData.data[currentData.data.length - 1];
  const allLatencies = currentData.data.map(d => d.latency);
  const minLatency = Math.min(...allLatencies);
  const maxLatency = Math.max(...allLatencies);
  const avgLatency = allLatencies.reduce((a, b) => a + b, 0) / allLatencies.length;

  const currentStatus = getLatencyStatus(latestData.latency);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Latency Statistics</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <RefreshCw className="w-3 h-3" />
          <span>#{updateCount}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Current Latency</p>
              <p className={`text-2xl font-bold ${currentStatus.color} mt-1`}>
                {latestData.latency.toFixed(1)} ms
              </p>
              <p className="text-xs text-blue-700 mt-1">{currentStatus.label}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center border border-green-200">
            <Minus className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-green-800 font-medium">Minimum</p>
            <p className="text-lg font-bold text-gray-900">{minLatency.toFixed(1)} ms</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center border border-blue-200">
            <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-blue-800 font-medium">Average</p>
            <p className="text-lg font-bold text-gray-900">{avgLatency.toFixed(1)} ms</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 text-center border border-red-200">
            <Plus className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <p className="text-xs text-red-800 font-medium">Maximum</p>
            <p className="text-lg font-bold text-gray-900">{maxLatency.toFixed(1)} ms</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Time Range</span>
          </div>
          <span className="font-medium capitalize">{timeRange}</span>
        </div>

        <div className="text-xs text-gray-500 text-center">
          {currentData.data.length} data points • Updated {format(lastUpdated, 'HH:mm:ss')}
        </div>
      </div>
    </div>
  );
};

export default LatencyStats;
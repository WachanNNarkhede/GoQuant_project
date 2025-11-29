'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Activity, Server, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { getLatencyStatus } from '@/lib/utils/geoUtils';

const PerformanceMetrics = () => {
  const { performanceMetrics, lastUpdated, updateCount } = useSelector((state: RootState) => state.latency);

  const latencyStatus = getLatencyStatus(performanceMetrics.averageLatency);

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 lg:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="hidden sm:inline">Updated: {format(lastUpdated, 'HH:mm:ss')}</span>
          <span className="sm:hidden">{format(lastUpdated, 'HH:mm')}</span>
        </div>
      </div>
      
      {/* Grid Layout - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Average Latency */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 lg:p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Avg Latency</span>
          </div>
          <div className={`text-xl lg:text-2xl font-bold ${latencyStatus.color}`}>
            {performanceMetrics.averageLatency.toFixed(1)}ms
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">{latencyStatus.label}</div>
        </div>

        {/* Connections */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 lg:p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">Connections</span>
          </div>
          <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            {performanceMetrics.totalConnections}
          </div>
          <div className="text-xs text-green-700 dark:text-green-400 mt-1">Active</div>
        </div>

        {/* Packet Loss */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 lg:p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Packet Loss</span>
          </div>
          <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            {performanceMetrics.packetLoss.toFixed(1)}%
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-400 mt-1">Average</div>
        </div>

        {/* Uptime */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-3 lg:p-4 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-900 dark:text-emerald-300">Uptime</span>
          </div>
          <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            {performanceMetrics.uptime}%
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">30 days</div>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
        Update #{updateCount} • Real-time monitoring
      </div>
    </div>
  );
};

export default PerformanceMetrics;
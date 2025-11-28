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
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Updated: {format(lastUpdated, 'HH:mm:ss')}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Avg Latency</span>
          </div>
          <div className={`text-2xl font-bold ${latencyStatus.color}`}>
            {performanceMetrics.averageLatency.toFixed(1)}ms
          </div>
          <div className="text-xs text-blue-700 mt-1">{latencyStatus.label}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Connections</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {performanceMetrics.totalConnections}
          </div>
          <div className="text-xs text-green-700 mt-1">Active</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Packet Loss</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {performanceMetrics.packetLoss.toFixed(1)}%
          </div>
          <div className="text-xs text-purple-700 mt-1">Average</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">Uptime</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {performanceMetrics.uptime}%
          </div>
          <div className="text-xs text-emerald-700 mt-1">30 days</div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Update #{updateCount} • Real-time monitoring active
      </div>
    </div>
  );
};

export default PerformanceMetrics;
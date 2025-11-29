'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const Legend = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 lg:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Legend</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Header */}
      <h3 className="hidden lg:block text-lg font-semibold text-gray-900 dark:text-white mb-4">Legend</h3>
      
      {/* Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="space-y-3">
          {/* Cloud Providers */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Cloud Providers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-3 h-3 rounded-full bg-[#FF9900] flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">AWS</span>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-3 h-3 rounded-full bg-[#4285F4] flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">GCP</span>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-3 h-3 rounded-full bg-[#0078D4] flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Azure</span>
              </div>
            </div>
          </div>

          {/* Latency Ranges */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Latency Ranges</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-6 h-1.5 bg-[#10B981] rounded flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Low (&lt;100ms)</span>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-6 h-1.5 bg-[#F59E0B] rounded flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Medium (100-200ms)</span>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-6 h-1.5 bg-[#EF4444] rounded flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">High (&gt;200ms)</span>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Online</span>
              </div>
              
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Degraded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend;
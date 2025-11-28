'use client';

const Legend = () => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-[#FF9900]"></div>
          <span>AWS Servers</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-[#4285F4]"></div>
          <span>GCP Servers</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-[#0078D4]"></div>
          <span>Azure Servers</span>
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-1 bg-[#10B981]"></div>
            <span>Low Latency (&lt;100ms)</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-1 bg-[#F59E0B]"></div>
            <span>Medium Latency (100-200ms)</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-1 bg-[#EF4444]"></div>
            <span>High Latency (&gt;200ms)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend;
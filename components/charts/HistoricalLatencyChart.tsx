'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchHistoricalLatency, updateHistoricalData } from '@/lib/redux/slice/latencySlice';
import { useEffect } from 'react';
import { format } from 'date-fns';

const HistoricalLatencyChart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { historicalData, timeRange, selectedPair, lastUpdated } = useSelector((state: RootState) => state.latency);

  const currentData = selectedPair 
    ? historicalData.find(data => data.pair === selectedPair && data.timeRange === timeRange)
    : null;

  const formatXAxis = (timestamp: number) => {
    if (timeRange === '1h') {
      return format(timestamp, 'HH:mm');
    } else if (timeRange === '24h') {
      return format(timestamp, 'HH:mm');
    } else {
      return format(timestamp, 'MMM dd');
    }
  };

  useEffect(() => {
    if (selectedPair) {
      dispatch(fetchHistoricalLatency({ pair: selectedPair, range: timeRange }));
    }
  }, [selectedPair, timeRange, dispatch]);

  useEffect(() => {
    if (!currentData || !selectedPair) return;

    const interval = setInterval(() => {
      const newDataPoint = {
        timestamp: Date.now(),
        latency: Math.max(10, (currentData.data[currentData.data.length - 1]?.latency || 50) + (Math.random() - 0.5) * 20),
        from: selectedPair.split('-')[0],
        to: selectedPair.split('-')[1],
        min: 30,
        max: 200,
        avg: 80,
      };

      const updatedData = [...currentData.data.slice(1), newDataPoint];
      
      dispatch(updateHistoricalData({
        pair: selectedPair,
        data: updatedData
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [currentData, selectedPair, dispatch]);

  const chartData = currentData?.data.map(item => ({
    ...item,
    formattedTime: formatXAxis(item.timestamp),
  })) || [];

  if (!selectedPair) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200 h-80 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Select a connection pair to view historical trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-gray-200 h-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Historical Latency - {selectedPair}
        </h3>
        <div className="text-xs text-gray-500">
          Updated: {format(lastUpdated, 'HH:mm:ss')}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="formattedTime" 
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 11 }}
            domain={[0, 250]}
          />
          <Tooltip 
            labelFormatter={(value) => `Time: ${value}`}
            formatter={(value: number) => [`${value.toFixed(1)} ms`, 'Latency']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="latency" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={false}
            name="Current Latency"
            isAnimationActive={true}
          />
          <Line 
            type="monotone" 
            dataKey="avg" 
            stroke="#10B981" 
            strokeWidth={1}
            strokeDasharray="3 3"
            dot={false}
            name="Average"
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalLatencyChart;
import { LatencyData } from '@/types';

export const calculateAverageLatency = (data: LatencyData[]): number => {
  if (data.length === 0) return 0;
  return data.reduce((sum, item) => sum + item.latency, 0) / data.length;
};

export const calculatePacketLoss = (data: LatencyData[]): number => {
  if (data.length === 0) return 0;
  return data.reduce((sum, item) => sum + (item.packetLoss || 0), 0) / data.length;
};

export const filterLatencyData = (
  data: LatencyData[], 
  filters: { minLatency: number; maxLatency: number; providers: string[] }
): LatencyData[] => {
  return data.filter(item => 
    item.latency >= filters.minLatency && 
    item.latency <= filters.maxLatency
  );
};

export const generateHeatmapData = (data: LatencyData[]): Array<{ lat: number; lng: number; intensity: number }> => {
  const heatmap: { [key: string]: { lat: number; lng: number; intensity: number; count: number } } = {};
  
  data.forEach(item => {
    const key = `${item.from}-${item.to}`;
    if (!heatmap[key]) {
      heatmap[key] = { lat: 0, lng: 0, intensity: 0, count: 0 };
    }
    heatmap[key].intensity += item.latency;
    heatmap[key].count += 1;
  });
  
  return Object.values(heatmap).map(point => ({
    lat: point.lat,
    lng: point.lng,
    intensity: point.intensity / point.count
  }));
};
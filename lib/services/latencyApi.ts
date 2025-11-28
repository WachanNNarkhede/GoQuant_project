import { LatencyData, Exchange, CloudRegion, HistoricalData } from '@/types';
import { FreeLatencyAPIs } from './freeLatencyApis';
import { mockExchanges, mockCloudRegions } from './mockData';

// Simple mock data generator that always works
export const generateMockLatencyData = (): LatencyData[] => {
  const connections = [
    { from: 'binance', to: 'aws-us-east-1', baseLatency: 120 },
    { from: 'coinbase', to: 'aws-us-east-1', baseLatency: 25 },
    { from: 'kraken', to: 'gcp-us-central1', baseLatency: 30 },
    { from: 'bitfinex', to: 'aws-eu-west-1', baseLatency: 75 },
    { from: 'okx', to: 'gcp-europe-west4', baseLatency: 110 },
    { from: 'bybit', to: 'aws-us-east-1', baseLatency: 180 },
  ];

  return connections.map((conn, index) => {
    const variation = Math.random() * 40 - 20;
    const latency = Math.max(10, conn.baseLatency + variation);
    
    return {
      id: `conn-${index}-${Date.now()}`,
      from: conn.from,
      to: conn.to,
      latency,
      timestamp: Date.now(),
      connectionStrength: 0.7 + Math.random() * 0.3,
      packetLoss: Math.random() * 1.5,
    };
  });
};

// Cache for real-time data
let cachedLatencyData: LatencyData[] = generateMockLatencyData();
let lastFetchTime = Date.now();
const CACHE_DURATION = 5000;

export const fetchLatencyData = async (): Promise<LatencyData[]> => {
  const now = Date.now();
  
  // Return cached data if it's fresh
  if (now - lastFetchTime < CACHE_DURATION && cachedLatencyData.length > 0) {
    return cachedLatencyData;
  }

  try {
    // Try to get real latency data
    const [googleLatency, cloudflareLatency] = await Promise.allSettled([
      FreeLatencyAPIs.pingGoogleDNS(),
      FreeLatencyAPIs.testCloudflareLatency(),
      
    ]);
console.log(googleLatency, cloudflareLatency)
    // Update mock data with slight variations
    const updatedData = generateMockLatencyData().map((data) => ({
      ...data,
      latency: data.latency + (Math.random() - 0.5) * 10, // Small variation
      timestamp: now,
    }));

    cachedLatencyData = updatedData;
    lastFetchTime = now;
    
    return updatedData;
  } catch (error) {
    console.warn('Using mock latency data');
    console.log(error)
    const mockData = generateMockLatencyData();
    cachedLatencyData = mockData;
    lastFetchTime = now;
    return mockData;
  }
};

export const fetchHistoricalData = async (
  pair: string,
  range: '1h' | '24h' | '7d' | '30d'
): Promise<HistoricalData> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const now = Date.now();
  let dataPoints: number;
  let interval: number;
  
  switch (range) {
    case '1h':
      dataPoints = 12; // 5-minute intervals
      interval = 5 * 60 * 1000;
      break;
    case '24h':
      dataPoints = 24; // 1-hour intervals
      interval = 60 * 60 * 1000;
      break;
    case '7d':
      dataPoints = 28; // 6-hour intervals
      interval = 6 * 60 * 60 * 1000;
      break;
    case '30d':
      dataPoints = 30; // 1-day intervals
      interval = 24 * 60 * 60 * 1000;
      break;
    default:
      dataPoints = 12;
      interval = 5 * 60 * 1000;
  }
  
  const baseLatency = 50 + Math.random() * 100;
  const data: HistoricalData['data'] = Array.from({ length: dataPoints }, (_, i) => {
    const timestamp = now - (dataPoints - i) * interval;
    const hour = new Date(timestamp).getHours();
    const peakMultiplier = (hour >= 14 && hour <= 22) ? 1.3 : 1.0;
    const variation = Math.sin(i * 0.5) * 20 * peakMultiplier;
    
    return {
      timestamp,
      latency: Math.max(10, baseLatency * peakMultiplier + variation),
      from: pair.split('-')[0],
      to: pair.split('-')[1],
      min: baseLatency * peakMultiplier - 15,
      max: baseLatency * peakMultiplier + 35,
      avg: baseLatency * peakMultiplier + 10,
    };
  });

  return {
    pair,
    data,
    timeRange: range,
  };
};

export const fetchExchanges = async (): Promise<Exchange[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockExchanges;
};

export const fetchCloudRegions = async (): Promise<CloudRegion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockCloudRegions;
};
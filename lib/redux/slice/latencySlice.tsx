import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LatencyData, Exchange, CloudRegion, HistoricalData, PerformanceMetrics, HistoricalDataPoint } from '@/types';
import { fetchLatencyData, fetchHistoricalData, fetchExchanges, fetchCloudRegions } from '@/lib/services/latencyApi';

// Define fallback functions INSIDE the file
const generateFallbackData = (): LatencyData[] => {
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
      id: `fallback-conn-${index}-${Date.now()}`,
      from: conn.from,
      to: conn.to,
      latency,
      timestamp: Date.now(),
      connectionStrength: 0.7 + Math.random() * 0.3,
      packetLoss: Math.random() * 1.5,
    };
  });
};

const getFallbackExchanges = (): Exchange[] => [
  {
    id: 'binance',
    name: 'Binance',
    location: { lat: 1.3521, lng: 103.8198, city: 'Singapore', country: 'Singapore' },
    cloudProvider: 'aws',
    region: 'ap-southeast-1',
    servers: 45,
    status: 'online',
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco', country: 'USA' },
    cloudProvider: 'aws',
    region: 'us-west-1',
    servers: 52,
    status: 'online',
  },
  {
    id: 'kraken',
    name: 'Kraken',
    location: { lat: 47.6062, lng: -122.3321, city: 'Seattle', country: 'USA' },
    cloudProvider: 'gcp',
    region: 'us-west2',
    servers: 41,
    status: 'online',
  }
];

const getFallbackRegions = (): CloudRegion[] => [
  {
    id: 'aws-us-east-1',
    provider: 'aws',
    name: 'US East (N. Virginia)',
    code: 'us-east-1',
    location: { lat: 39.0437, lng: -77.4875 },
    serverCount: 156,
    boundaries: [
      { lat: 35, lng: -85 }, { lat: 35, lng: -75 },
      { lat: 45, lng: -75 }, { lat: 45, lng: -85 }
    ],
    color: '#FF9900',
  },
  {
    id: 'gcp-us-central1',
    provider: 'gcp',
    name: 'US Central (Iowa)',
    code: 'us-central1',
    location: { lat: 41.8780, lng: -93.0977 },
    serverCount: 89,
    boundaries: [
      { lat: 38, lng: -98 }, { lat: 38, lng: -88 },
      { lat: 45, lng: -88 }, { lat: 45, lng: -98 }
    ],
    color: '#4285F4',
  }
];

interface LatencyState {
  realTimeData: LatencyData[];
  historicalData: HistoricalData[];
  exchanges: Exchange[];
  cloudRegions: CloudRegion[];
  performanceMetrics: PerformanceMetrics;
  loading: boolean;
  error: string | null;
  selectedPair: string | null;
  timeRange: '1h' | '24h' | '7d' | '30d';
  lastUpdated: number;
  isInitialized: boolean;
  updateCount: number;
}

const initialState: LatencyState = {
  realTimeData: [],
  historicalData: [],
  exchanges: [],
  cloudRegions: [],
  performanceMetrics: {
    totalConnections: 0,
    averageLatency: 0,
    packetLoss: 0,
    uptime: 99.9,
    lastUpdated: Date.now(),
  },
  loading: false,
  error: null,
  selectedPair: null,
  timeRange: '1h',
  lastUpdated: Date.now(),
  isInitialized: false,
  updateCount: 0,
};

export const fetchRealTimeLatency = createAsyncThunk(
  'latency/fetchRealTime',
  async (): Promise<LatencyData[]> => {
    const response = await fetchLatencyData();
    return response;
  }
);

export const fetchHistoricalLatency = createAsyncThunk(
  'latency/fetchHistorical',
  async ({ pair, range }: { pair: string; range: '1h' | '24h' | '7d' | '30d' }): Promise<HistoricalData> => {
    const response = await fetchHistoricalData(pair, range);
    return response;
  }
);

export const initializeData = createAsyncThunk(
  'latency/initialize',
  async (): Promise<{ exchanges: Exchange[]; regions: CloudRegion[] }> => {
    const [exchanges, regions] = await Promise.all([
      fetchExchanges(),
      fetchCloudRegions(),
    ]);
    return { exchanges, regions };
  }
);

const latencySlice = createSlice({
  name: 'latency',
  initialState,
  reducers: {
    setSelectedPair: (state, action: PayloadAction<string | null>) => {
      state.selectedPair = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<'1h' | '24h' | '7d' | '30d'>) => {
      state.timeRange = action.payload;
    },
    updateRealTimeData: (state, action: PayloadAction<LatencyData[]>) => {
      state.realTimeData = action.payload;
      state.lastUpdated = Date.now();
      state.updateCount += 1;
      
      const totalConnections = action.payload.length;
      const averageLatency = totalConnections > 0 
        ? action.payload.reduce((sum, data) => sum + data.latency, 0) / totalConnections 
        : 0;
      const packetLoss = totalConnections > 0
        ? action.payload.reduce((sum, data) => sum + (data.packetLoss || 0), 0) / totalConnections
        : 0;
      
      state.performanceMetrics = {
        totalConnections,
        averageLatency: Math.round(averageLatency * 10) / 10,
        packetLoss: Math.round(packetLoss * 10) / 10,
        uptime: 99.9,
        lastUpdated: Date.now(),
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    simulateRealTimeUpdate: (state) => {
      if (state.realTimeData.length > 0) {
        const updatedData = state.realTimeData.map(data => {
          const variation = (Math.random() - 0.5) * 40;
          const newLatency = Math.max(10, data.latency + variation);
          
          return {
            ...data,
            latency: newLatency,
            timestamp: Date.now(),
            packetLoss: Math.max(0, Math.min(5, (data.packetLoss ?? 0) + (Math.random() - 0.5) * 1)),
          };
        });
        
        state.realTimeData = updatedData;
        state.lastUpdated = Date.now();
        state.updateCount += 1;
        
        const totalConnections = updatedData.length;
        const averageLatency = totalConnections > 0 
          ? updatedData.reduce((sum, data) => sum + data.latency, 0) / totalConnections 
          : 0;
        const packetLoss = totalConnections > 0
          ? updatedData.reduce((sum, data) => sum + (data.packetLoss || 0), 0) / totalConnections
          : 0;
        
        state.performanceMetrics = {
          totalConnections,
          averageLatency: Math.round(averageLatency * 10) / 10,
          packetLoss: Math.round(packetLoss * 10) / 10,
          uptime: 99.9,
          lastUpdated: Date.now(),
        };
      }
    },
    updateHistoricalData: (state, action: PayloadAction<{ pair: string; data: HistoricalDataPoint[] }>) => {
      const { pair, data } = action.payload;
      const existingIndex = state.historicalData.findIndex(h => h.pair === pair && h.timeRange === state.timeRange);
      
      if (existingIndex >= 0) {
        state.historicalData[existingIndex].data = data;
      } else {
        state.historicalData.push({
          pair,
          data,
          timeRange: state.timeRange,
        });
      }
      state.updateCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealTimeLatency.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRealTimeLatency.fulfilled, (state, action) => {
        state.loading = false;
        state.realTimeData = action.payload;
        state.lastUpdated = Date.now();
        state.updateCount += 1;
        state.error = null;
        
        const totalConnections = action.payload.length;
        const averageLatency = totalConnections > 0 
          ? action.payload.reduce((sum, data) => sum + data.latency, 0) / totalConnections 
          : 0;
        const packetLoss = totalConnections > 0
          ? action.payload.reduce((sum, data) => sum + (data.packetLoss || 0), 0) / totalConnections
          : 0;
        
        state.performanceMetrics = {
          totalConnections,
          averageLatency: Math.round(averageLatency * 10) / 10,
          packetLoss: Math.round(packetLoss * 10) / 10,
          uptime: 99.9,
          lastUpdated: Date.now(),
        };
      })
      .addCase(fetchRealTimeLatency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch latency data';
        if (state.realTimeData.length === 0) {
          state.realTimeData = generateFallbackData();
          state.updateCount += 1;
        }
      })
      .addCase(fetchHistoricalLatency.fulfilled, (state, action) => {
        const existingIndex = state.historicalData.findIndex(
          data => data.pair === action.payload.pair && data.timeRange === action.payload.timeRange
        );
        
        if (existingIndex >= 0) {
          state.historicalData[existingIndex] = action.payload;
        } else {
          state.historicalData.push(action.payload);
        }
        state.updateCount += 1;
      })
      .addCase(initializeData.fulfilled, (state, action) => {
        state.exchanges = action.payload.exchanges;
        state.cloudRegions = action.payload.regions;
        state.isInitialized = true;
        state.updateCount += 1;
      })
      .addCase(initializeData.rejected, (state) => {
        state.exchanges = getFallbackExchanges();
        state.cloudRegions = getFallbackRegions();
        state.isInitialized = true;
        state.updateCount += 1;
      });
  },
});

export const { 
  setSelectedPair, 
  setTimeRange, 
  updateRealTimeData, 
  clearError,
  simulateRealTimeUpdate,
  updateHistoricalData
} = latencySlice.actions;
export default latencySlice.reducer;
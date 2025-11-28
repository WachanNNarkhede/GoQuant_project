export interface Exchange {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    country: string;
  };
  cloudProvider: 'aws' | 'gcp' | 'azure';
  region: string;
  servers: number;
  status: 'online' | 'offline' | 'degraded';
}

export interface CloudRegion {
  id: string;
  provider: 'aws' | 'gcp' | 'azure';
  name: string;
  code: string;
  location: {
    lat: number;
    lng: number;
  };
  serverCount: number;
  boundaries: Array<{ lat: number; lng: number }>;
  color: string;
}

export interface LatencyData {
  id: string;
  from: string;
  to: string;
  latency: number;
  timestamp: number;
  connectionStrength: number;
  packetLoss?: number;
}

export interface HistoricalDataPoint {
  timestamp: number;
  latency: number;
  from: string;
  to: string;
  min: number;
  max: number;
  avg: number;
}

export interface HistoricalData {
  pair: string;
  data: HistoricalDataPoint[];
  timeRange: '1h' | '24h' | '7d' | '30d';
}

export interface PerformanceMetrics {
  totalConnections: number;
  averageLatency: number;
  packetLoss: number;
  uptime: number;
  lastUpdated: number;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface FilterState {
  cloudProviders: string[];
  latencyRange: [number, number];
  showRealTime: boolean;
  showHistorical: boolean;
  showRegions: boolean;
  showHeatmap: boolean;
  selectedExchanges: string[];
}

export interface UIState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  selectedView: 'map' | 'analytics';
  sidebarOpen: boolean;
  tooltip: {
    visible: boolean;
    content: string;
    position: { x: number; y: number };
  };
}
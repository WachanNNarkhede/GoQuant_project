import { Exchange, CloudRegion, LatencyData } from '@/types';

export const mockExchanges: Exchange[] = [
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
  },
  {
    id: 'bitfinex',
    name: 'Bitfinex',
    location: { lat: 50.1109, lng: 8.6821, city: 'Frankfurt', country: 'Germany' },
    cloudProvider: 'azure',
    region: 'germany-west-central',
    servers: 29,
    status: 'online',
  },
  {
    id: 'okx',
    name: 'OKX',
    location: { lat: 22.3193, lng: 114.1694, city: 'Hong Kong', country: 'China' },
    cloudProvider: 'gcp',
    region: 'asia-east2',
    servers: 32,
    status: 'online',
  },
  {
    id: 'bybit',
    name: 'Bybit',
    location: { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'Japan' },
    cloudProvider: 'aws',
    region: 'ap-northeast-1',
    servers: 38,
    status: 'degraded',
  }
];

export const mockCloudRegions: CloudRegion[] = [
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
  },
  {
    id: 'azure-east-us',
    provider: 'azure',
    name: 'East US',
    code: 'east-us',
    location: { lat: 37.3719, lng: -79.8164 },
    serverCount: 102,
    boundaries: [
      { lat: 34, lng: -84 }, { lat: 34, lng: -74 },
      { lat: 42, lng: -74 }, { lat: 42, lng: -84 }
    ],
    color: '#0078D4',
  },
  {
    id: 'aws-eu-west-1',
    provider: 'aws',
    name: 'EU West (Ireland)',
    code: 'eu-west-1',
    location: { lat: 53.3498, lng: -6.2603 },
    serverCount: 112,
    boundaries: [
      { lat: 50, lng: -12 }, { lat: 50, lng: 2 },
      { lat: 58, lng: 2 }, { lat: 58, lng: -12 }
    ],
    color: '#FF9900',
  },
  {
    id: 'gcp-europe-west4',
    provider: 'gcp',
    name: 'Europe West (Netherlands)',
    code: 'europe-west4',
    location: { lat: 52.1326, lng: 5.2913 },
    serverCount: 78,
    boundaries: [
      { lat: 48, lng: 0 }, { lat: 48, lng: 10 },
      { lat: 56, lng: 10 }, { lat: 56, lng: 0 }
    ],
    color: '#4285F4',
  }
];

export const generateMockLatencyData = (): LatencyData[] => {
  const connections = [
    { from: 'coinbase', to: 'aws-us-east-1', baseLatency: 25 },
    { from: 'kraken', to: 'gcp-us-central1', baseLatency: 30 },
    { from: 'bitfinex', to: 'aws-eu-west-1', baseLatency: 75 },
    { from: 'binance', to: 'aws-eu-west-1', baseLatency: 120 },
    { from: 'okx', to: 'gcp-europe-west4', baseLatency: 110 },
    { from: 'bybit', to: 'aws-us-east-1', baseLatency: 180 },
    { from: 'binance', to: 'aws-us-east-1', baseLatency: 200 },
    { from: 'okx', to: 'azure-east-us', baseLatency: 190 },
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

// Add this function to the existing mockData.ts file
export const getFallbackRegions = (): CloudRegion[] => [
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
  },
  {
    id: 'azure-east-us',
    provider: 'azure',
    name: 'East US',
    code: 'east-us',
    location: { lat: 37.3719, lng: -79.8164 },
    serverCount: 102,
    boundaries: [
      { lat: 34, lng: -84 }, { lat: 34, lng: -74 },
      { lat: 42, lng: -74 }, { lat: 42, lng: -84 }
    ],
    color: '#0078D4',
  }
];
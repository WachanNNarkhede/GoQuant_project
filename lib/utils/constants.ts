export const CLOUD_PROVIDERS = {
  aws: { name: 'Amazon Web Services', color: '#FF9900' },
  gcp: { name: 'Google Cloud Platform', color: '#4285F4' },
  azure: { name: 'Microsoft Azure', color: '#0078D4' },
} as const;

export const LATENCY_THRESHOLDS = {
  excellent: 50,
  good: 100,
  fair: 150,
  poor: 200,
} as const;

export const TIME_RANGES = {
  '1h': '1 Hour',
  '24h': '24 Hours',
  '7d': '7 Days',
  '30d': '30 Days',
} as const;

export const MAP_CONFIG = {
  earthRadius: 5,
  markerSize: 0.1,
  connectionWidth: 0.02,
  animationSpeed: 1,
} as const;
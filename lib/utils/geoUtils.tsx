export const latLngToVector3 = (lat: number, lng: number, radius: number = 5): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return [x, y, z];
};

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getLatencyColor = (latency: number): string => {
  if (latency < 50) return '#10B981'; 
  if (latency < 100) return '#34D399'; 
  if (latency < 150) return '#F59E0B'; // yellow
  if (latency < 200) return '#F97316'; // orange
  return '#EF4444'; // red
};

export const getProviderColor = (provider: string): string => {
  switch (provider) {
    case 'aws': return '#FF9900';
    case 'gcp': return '#4285F4';
    case 'azure': return '#0078D4';
    default: return '#6B7280';
  }
};

export const getLatencyStatus = (latency: number): { color: string; label: string } => {
  if (latency < 50) return { color: 'text-green-600', label: 'Excellent' };
  if (latency < 100) return { color: 'text-green-500', label: 'Good' };
  if (latency < 150) return { color: 'text-yellow-500', label: 'Fair' };
  if (latency < 200) return { color: 'text-orange-500', label: 'Poor' };
  return { color: 'text-red-600', label: 'Critical' };
};
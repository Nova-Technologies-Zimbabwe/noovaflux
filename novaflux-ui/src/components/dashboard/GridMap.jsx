import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Zap, AlertTriangle, TrendingUp, Sun, Wind } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { grid, alerts } from '../../services/api';
import clsx from 'clsx';

const mockGridData = {
  regions: [
    { id: '1', name: 'Harare', lat: -17.825, lng: 31.033, load: 450, status: 'normal', substations: 12 },
    { id: '2', name: 'Bulawayo', lat: -20.17, lng: 28.58, load: 320, status: 'warning', substations: 8 },
    { id: '3', name: 'Mutare', lat: -18.97, lng: 32.67, load: 180, status: 'normal', substations: 5 },
    { id: '4', name: 'Gweru', lat: -19.45, lng: 29.82, load: 210, status: 'normal', substations: 4 },
    { id: '5', name: 'Masvingo', lat: -20.07, lng: 30.97, load: 150, status: 'fault', substations: 3 },
    { id: '6', name: 'Kwekwe', lat: -18.93, lng: 29.82, load: 95, status: 'normal', substations: 2 },
  ],
  substations: [
    { id: 's1', name: 'Harare North', lat: -17.79, lng: 31.05, load: 85, status: 'active' },
    { id: 's2', name: 'Harare South', lat: -17.86, lng: 31.02, load: 72, status: 'active' },
    { id: 's3', name: 'Bulawayo Central', lat: -20.15, lng: 28.58, load: 91, status: 'warning' },
  ],
};

const statusColors = {
  normal: '#10b981',
  warning: '#f59e0b',
  fault: '#ef4444',
  offline: '#6b7280',
  renewable: '#3b82f6',
};

export default function GridMap() {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const { data: gridStatus } = useQuery({
    queryKey: ['gridStatus'],
    queryFn: grid.status,
    refetchInterval: 5000,
  });

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden">
      <MapContainer
        center={[-19.015, 29.15]}
        zoom={7}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {mockGridData.regions.map((region) => (
          <Circle
            key={region.id}
            center={[region.lat, region.lng]}
            radius={25000}
            pathOptions={{
              color: statusColors[region.status],
              fillColor: statusColors[region.status],
              fillOpacity: 0.3,
            }}
            eventHandlers={{
              click: () => setSelectedRegion(region),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{region.name}</h3>
                <p>Load: {region.load} MW</p>
                <p>Status: {region.status}</p>
                <p>Substations: {region.substations}</p>
              </div>
            </Popup>
          </Circle>
        ))}

        {mockGridData.substations.map((sub) => (
          <Marker key={sub.id} position={[sub.lat, sub.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{sub.name}</h3>
                <p>Load: {sub.load}%</p>
                <p>Status: {sub.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 left-4 z-[1000] bg-slate-900/90 backdrop-blur-sm rounded-lg p-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Zap size={14} />
          <span>Grid Status</span>
        </div>
        <div className="flex flex-col gap-2">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
              <span className="capitalize text-slate-300">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
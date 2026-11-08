import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { CITY } from '@/data/constants';
import { fillColor } from '@/data/constants';
import { Trash2, Truck } from 'lucide-react';

// Create a colored bin marker
function binIcon(pct) {
  const c = fillColor(pct);
  return L.divIcon({
    className: '',
    html: `<div class="bin-marker" style="background:${c.bg}">${pct}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
}

const truckIcon = L.divIcon({
  className: '',
  html: `<div class="truck-marker"><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M14 9h4l4 4v4a1 1 0 0 1-1 1h-2"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></span></div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -16],
});

function BinPopup({ bin, onSelect }) {
  return (
    <Popup>
      <div className="min-w-[180px]">
        <p className="font-semibold text-navy-900">{bin.id}</p>
        <p className="text-slate-500 text-xs mb-1.5">{bin.location}</p>
        <div className="space-y-0.5 text-xs">
          <p><span className="text-slate-500">Fill:</span> <span className="font-semibold">{bin.fill}%</span></p>
          <p><span className="text-slate-500">Predicted:</span> <span className="font-semibold">{bin.predicted}%</span></p>
          <p><span className="text-slate-500">Priority:</span> <span className="font-semibold">{bin.priority}</span></p>
          <p><span className="text-slate-500">Sensor:</span> <span className="font-semibold">{bin.sensor}</span></p>
        </div>
        {onSelect && (
          <button
            onClick={() => onSelect(bin)}
            className="mt-2 w-full bg-navy-900 text-white text-xs py-1.5 rounded-md hover:bg-navy-800"
          >
            View details
          </button>
        )}
      </div>
    </Popup>
  );
}

export default function MapView({
  bins = [],
  vehicles = [],
  route = null,
  selectedBins = [],
  highlightBinIds = [],
  onSelectBin,
  height = '100%',
  showTrucks = true,
  zoom,
  className = '',
}) {
  const highlightSet = new Set(highlightBinIds);
  const selectedSet = new Set(selectedBins.map((b) => b.id));

  return (
    <MapContainer
      center={CITY.center}
      zoom={zoom || CITY.zoom}
      scrollWheelZoom
      style={{ height }}
      className={className}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors — Demo data'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {bins.map((b) => {
        const isSelected = selectedSet.has(b.id);
        const isHighlight = highlightSet.has(b.id);
        return (
          <Marker
            key={b.id}
            position={[b.lat, b.lng]}
            icon={binIcon(b.fill)}
            zIndexOffset={isHighlight ? 1000 : 0}
          >
            <BinPopup bin={b} onSelect={onSelectBin} />
            {isSelected && (
              <CircleMarker
                center={[b.lat, b.lng]}
                radius={16}
                pathOptions={{ color: '#213a66', weight: 2, fillOpacity: 0.05 }}
              />
            )}
          </Marker>
        );
      })}

      {showTrucks &&
        vehicles.map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={truckIcon}>
            <Popup>
              <div className="min-w-[170px]">
                <p className="font-semibold text-navy-900">{v.id}</p>
                <p className="text-slate-500 text-xs mb-1.5">{v.driver}</p>
                <div className="space-y-0.5 text-xs">
                  <p><span className="text-slate-500">Status:</span> <span className="font-semibold">{v.status}</span></p>
                  <p><span className="text-slate-500">Route:</span> <span className="font-semibold">{v.route}</span></p>
                  <p><span className="text-slate-500">Speed:</span> <span className="font-semibold">{v.speedKmph} km/h</span></p>
                  <p><span className="text-slate-500">Completed:</span> <span className="font-semibold">{v.completed}/{v.total}</span></p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {route && route.sequence && (
        <Polyline
          positions={[
            [route.start.lat, route.start.lng],
            ...route.sequence.map((s) => {
              const b = bins.find((x) => x.id === s.bin);
              return [b.lat, b.lng];
            }),
            [route.end.lat, route.end.lng],
          ]}
          pathOptions={{ color: '#10b981', weight: 4, opacity: 0.8, dashArray: '8 6' }}
        />
      )}
    </MapContainer>
  );
}

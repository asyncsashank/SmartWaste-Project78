import { useMemo, useState } from 'react';
import { Trash2, Truck, MapPin, Layers } from 'lucide-react';
import DemoBanner from '@/components/DemoBanner';
import MapView from '@/components/MapView';
import { bins } from '@/data/bins';
import { vehicles } from '@/data/vehicles';

export default function LiveMap({ onSelectBin }) {
  const [showTrucks, setShowTrucks] = useState(true);
  const [filter, setFilter] = useState('all'); // all | high | critical

  const filteredBins = useMemo(() => {
    if (filter === 'high') return bins.filter((b) => b.fill >= 80);
    if (filter === 'critical') return bins.filter((b) => b.priority === 'Critical');
    return bins;
  }, [filter]);

  const highCount = bins.filter((b) => b.fill >= 80).length;
  const criticalCount = bins.filter((b) => b.priority === 'Critical').length;

  return (
    <div className="space-y-4">
      <DemoBanner>
        Map shows demo coordinates around Visakhapatnam, Andhra Pradesh, India. Not live GPS.
      </DemoBanner>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="h-[60vh] lg:h-[70vh]">
            <MapView
              bins={filteredBins}
              vehicles={showTrucks ? vehicles : []}
              onSelectBin={onSelectBin}
              showTrucks={showTrucks}
            />
          </div>
        </div>

        {/* Legend / controls */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="section-title flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 muted" /> Map Layers
            </h3>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm text-navy-700 flex items-center gap-2">
                <Truck className="w-4 h-4 muted" /> Garbage Trucks
              </span>
              <input
                type="checkbox"
                checked={showTrucks}
                onChange={(e) => setShowTrucks(e.target.checked)}
                className="w-4 h-4 accent-brand-600"
              />
            </label>
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs muted mb-2">Show bins by priority</p>
              <div className="grid grid-cols-3 gap-1.5">
                <FilterPill active={filter === 'all'} onClick={() => setFilter('all')} label="All" count={bins.length} />
                <FilterPill active={filter === 'high'} onClick={() => setFilter('high')} label="High" count={highCount} color="#ef4444" />
                <FilterPill active={filter === 'critical'} onClick={() => setFilter('critical')} label="Critical" count={criticalCount} color="#dc2626" />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="section-title mb-3">Legend</h3>
            <div className="space-y-2 text-sm">
              <LegendRow color="#10b981" label="Normal (below 50%)" />
              <LegendRow color="#f97316" label="Medium (50–79%)" />
              <LegendRow color="#ef4444" label="High (80–99%)" />
              <LegendRow color="#dc2626" label="Critical / Overflow" />
              <div className="pt-2 border-t border-slate-100 mt-2">
                <LegendRow color="#213a66" label="Garbage Truck" shape="diamond" />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="section-title mb-3">Summary</h3>
            <div className="space-y-2 text-sm">
              <Row icon={Trash2} label="Visible bins" value={filteredBins.length} />
              <Row icon={MapPin} label="High-priority points" value={highCount} />
              <Row icon={Truck} label="Trucks on map" value={showTrucks ? vehicles.length : 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, label, count, color = '#213a66' }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition ${
        active ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-700 border-slate-200 hover:bg-slate-50'
      }`}
    >
      <span className="block">{label}</span>
      <span className={`block text-[10px] ${active ? 'text-navy-200' : 'muted'}`}>{count}</span>
    </button>
  );
}

function LegendRow({ color, label, shape }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="w-4 h-4 border-2 border-white shadow-sm"
        style={{ background: color, borderRadius: shape === 'diamond' ? '2px' : '50%' }}
      />
      <span className="text-navy-700">{label}</span>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="muted flex items-center gap-2"><Icon className="w-4 h-4" /> {label}</span>
      <span className="font-semibold text-navy-900">{value}</span>
    </div>
  );
}

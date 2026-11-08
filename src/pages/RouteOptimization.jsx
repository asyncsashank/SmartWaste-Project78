import { useMemo, useState } from 'react';
import { Route as RouteIcon, Truck, MapPin, Navigation, Clock, GitBranch, CheckCircle2, Plus } from 'lucide-react';
import Card from '@/components/Card';
import DemoBanner from '@/components/DemoBanner';
import MapView from '@/components/MapView';
import { FillBadge, PriorityBadge, StatusBadge } from '@/components/Badges';
import { bins } from '@/data/bins';
import { vehicles } from '@/data/vehicles';
import { apiService } from '@/services/api';
import { VEHICLE_STATUS } from '@/data/constants';

export default function RouteOptimization() {
  const requiringCollection = useMemo(
    () => bins.filter((b) => b.fill >= 50 || b.status === 'Overdue' || b.status === 'Pending'),
    [],
  );
  const availableVehicles = vehicles.filter(
    (v) => v.status === VEHICLE_STATUS.ACTIVE || v.status === VEHICLE_STATUS.IDLE,
  );

  const [selectedVehicle, setSelectedVehicle] = useState(availableVehicles[0]);
  const [selectedBinIds, setSelectedBinIds] = useState([]);
  const [route, setRoute] = useState(null);
  const [generating, setGenerating] = useState(false);

  const selectedBins = useMemo(
    () => bins.filter((b) => selectedBinIds.includes(b.id)),
    [selectedBinIds],
  );

  function toggleBin(id) {
    setSelectedBinIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function selectAll() {
    setSelectedBinIds(requiringCollection.map((b) => b.id));
  }
  function clearAll() {
    setSelectedBinIds([]);
    setRoute(null);
  }

  async function generateRoute() {
    if (!selectedVehicle || selectedBins.length === 0) return;
    setGenerating(true);
    setRoute(null);
    const res = await apiService.optimizeRoute(selectedBins, selectedVehicle);
    setRoute(res.data);
    setGenerating(false);
  }

  return (
    <div className="space-y-4">
      <DemoBanner>
        Route optimization is a demo nearest-neighbor simulation. The intended backend engine is Google OR-Tools
        (VRP solver) — not yet connected.
      </DemoBanner>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: controls */}
        <div className="space-y-4">
          {/* Vehicle selection */}
          <Card title="1. Select Collection Vehicle" subtitle="Available trucks">
            <div className="space-y-2">
              {availableVehicles.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                    selectedVehicle?.id === v.id
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-navy-900 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy-900">{v.id}</p>
                    <p className="text-xs muted truncate">{v.driver} · {v.route}</p>
                  </div>
                  <StatusBadge status={v.status} />
                </button>
              ))}
            </div>
          </Card>

          {/* Generate */}
          <Card title="3. Generate Optimized Route">
            <button
              className="btn-primary w-full"
              onClick={generateRoute}
              disabled={generating || !selectedVehicle || selectedBins.length === 0}
            >
              <Navigation className="w-4 h-4" />
              {generating ? 'Generating…' : 'Generate Route'}
            </button>
            {selectedBins.length === 0 && (
              <p className="mt-2 text-xs muted">Select at least one bin to generate a route.</p>
            )}
            <button className="btn-ghost w-full mt-2" onClick={clearAll}>
              Clear Selection
            </button>
          </Card>
        </div>

        {/* Middle: bins list */}
        <Card
          title="2. Bins Requiring Collection"
          subtitle={`${selectedBinIds.length} selected of ${requiringCollection.length} eligible`}
          bodyClass="p-0"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100">
            <button className="text-xs font-medium text-brand-700 hover:underline" onClick={selectAll}>Select all</button>
            <span className="text-slate-300">·</span>
            <button className="text-xs font-medium muted hover:underline" onClick={clearAll}>Clear</button>
          </div>
          <div className="max-h-[480px] overflow-y-auto divide-y divide-slate-100">
            {requiringCollection.map((b) => {
              const checked = selectedBinIds.includes(b.id);
              return (
                <label
                  key={b.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBin(b.id)}
                    className="w-4 h-4 accent-brand-600 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy-900 truncate">{b.id} · {b.location}</p>
                    <p className="text-xs muted">Fill {b.fill}% · Predicted {b.predicted}%</p>
                  </div>
                  <PriorityBadge priority={b.priority} />
                </label>
              );
            })}
          </div>
        </Card>

        {/* Right: route result */}
        <div className="space-y-4">
          <Card title="Optimized Route" subtitle={route ? route.engine : 'No route generated yet'}>
            {route ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Stat icon={GitBranch} label="Distance" value={`${route.totalDistance} km`} />
                  <Stat icon={Clock} label="Travel Time" value={`${route.travelTimeMin} min`} />
                  <Stat icon={MapPin} label="Stops" value={route.stops} />
                  <Stat icon={Truck} label="Vehicle" value={route.vehicleId} />
                </div>
                <div className="rounded-lg bg-slate-50 p-3 max-h-[280px] overflow-y-auto">
                  <p className="text-xs font-semibold muted uppercase tracking-wide mb-2">Route Sequence</p>
                  <ol className="space-y-1.5">
                    <li className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-navy-900 text-white text-[10px] font-bold flex items-center justify-center">S</span>
                      <span className="text-navy-700">{route.start.label}</span>
                    </li>
                    {route.sequence.map((s) => (
                      <li key={s.stop} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">{s.stop}</span>
                        <span className="text-navy-900 font-medium">{s.bin}</span>
                        <span className="muted text-xs truncate">· {s.location}</span>
                        <span className="ml-auto text-xs muted">{s.legKm} km</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center">E</span>
                      <span className="text-navy-700">{route.end.label}</span>
                    </li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <RouteIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm muted">Select a vehicle and bins, then generate a route.</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Route map */}
      <Card title="Route Map" subtitle="Optimized collection path — demo">
        <div className="h-[50vh]">
          <MapView
            bins={bins}
            vehicles={[selectedVehicle].filter(Boolean)}
            route={route}
            selectedBins={selectedBins}
            highlightBinIds={selectedBinIds}
            zoom={12}
            showTrucks
          />
        </div>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50">
      <Icon className="w-4 h-4 text-navy-700 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] muted">{label}</p>
        <p className="text-sm font-semibold text-navy-900 truncate">{value}</p>
      </div>
    </div>
  );
}

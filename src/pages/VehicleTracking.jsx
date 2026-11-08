import { Truck, Fuel, Gauge, MapPin, Phone, Clock } from 'lucide-react';
import Card from '@/components/Card';
import DemoBanner from '@/components/DemoBanner';
import MapView from '@/components/MapView';
import { StatusBadge } from '@/components/Badges';
import { vehicles } from '@/data/vehicles';

export default function VehicleTracking() {
  return (
    <div className="space-y-4">
      <DemoBanner>
        Vehicle locations are simulated coordinates around Visakhapatnam. Not live GPS tracking.
      </DemoBanner>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Map */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="h-[55vh]">
            <MapView bins={[]} vehicles={vehicles} showTrucks zoom={12} />
          </div>
        </div>

        {/* Fleet summary */}
        <Card title="Fleet Status" subtitle={`${vehicles.length} vehicles`}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <SummaryStat label="Active" value={vehicles.filter((v) => v.status === 'Active').length} color="text-brand-700" />
            <SummaryStat label="Idle" value={vehicles.filter((v) => v.status === 'Idle').length} color="text-slate-600" />
            <SummaryStat label="Maint." value={vehicles.filter((v) => v.status === 'Maintenance').length} color="text-accent-700" />
          </div>
        </Card>
      </div>

      {/* Vehicle cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {vehicles.map((v) => (
          <Card key={v.id} bodyClass="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-navy-900 text-white flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-navy-900">{v.id}</p>
                  <p className="text-xs muted">{v.driver}</p>
                </div>
              </div>
              <StatusBadge status={v.status} />
            </div>

            <div className="space-y-2 text-sm">
              <Row icon={MapPin} label="Location" value={`${v.lat.toFixed(4)}, ${v.lng.toFixed(4)}`} />
              <Row icon={Truck} label="Assigned Route" value={v.route} />
              <Row icon={Phone} label="Driver Phone" value={v.phone} />
              <Row icon={Clock} label="Last Update" value={v.lastUpdate} />
              <Row icon={Gauge} label="Speed" value={`${v.speedKmph} km/h`} />
            </div>

            {/* Progress */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="muted">Collection progress</span>
                <span className="font-semibold text-navy-900">{v.completed}/{v.total} stops</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all duration-500"
                  style={{ width: `${v.total ? (v.completed / v.total) * 100 : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="flex items-center gap-1 muted">
                  <Fuel className="w-3.5 h-3.5" /> Fuel {v.fuelPct}%
                </span>
                <span className="muted">Load {v.loadKg}/{v.capacityKg} kg</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="muted flex items-center gap-2 shrink-0">
        <Icon className="w-4 h-4" /> {label}
      </span>
      <span className="text-navy-900 font-medium text-right truncate">{value}</span>
    </div>
  );
}

function SummaryStat({ label, value, color }) {
  return (
    <div className="p-2.5 rounded-lg bg-slate-50">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[11px] muted">{label}</p>
    </div>
  );
}

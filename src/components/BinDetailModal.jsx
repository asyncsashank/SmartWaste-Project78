import { useEffect, useState } from 'react';
import { X, MapPin, Battery, Wifi, Clock, Trash2, History, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { apiService } from '@/services/api';
import { fillHistory, collectionHistory } from '@/data/bins';
import { FillBadge, FillBar, PriorityBadge, StatusBadge } from './Badges';
import ChartTooltip from './ChartTooltip';

export default function BinDetailModal({ bin, onClose }) {
  const [history, setHistory] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bin) return;
    let alive = true;
    setLoading(true);
    Promise.all([
      apiService.getBinHistory(bin.id),
      apiService.getBinCollectionHistory(bin.id),
    ]).then(([h, c]) => {
      if (!alive) return;
      setHistory(h.data);
      setCollections(c.data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [bin]);

  if (!bin) return null;

  const overflowGap = 100 - bin.fill;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-5 py-4 flex items-start justify-between gap-3 z-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-navy-900 text-white flex items-center justify-center">
                <Trash2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-navy-900">{bin.id}</h2>
                <p className="text-xs muted flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {bin.location}, Visakhapatnam
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-navy-700"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Live reading */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Current Fill" value={`${bin.fill}%`} icon={Activity} accent="text-navy-900" />
            <Stat label="Predicted Fill" value={`${bin.predicted}%`} icon={Activity} accent="text-accent-700" />
            <Stat label="Capacity" value={`${bin.capacityL} L`} icon={Trash2} accent="text-navy-900" />
            <Stat label="Overflow Gap" value={`${overflowGap}%`} icon={Activity} accent={overflowGap < 10 ? 'text-danger-600' : 'text-brand-700'} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FillBadge pct={bin.fill} size="lg" />
            <PriorityBadge priority={bin.priority} />
            <StatusBadge status={bin.status} />
            <StatusBadge status={bin.sensor} />
          </div>

          {/* Current fill bar */}
          <div className="card p-4">
            <p className="text-xs muted mb-2">Current Fill Level</p>
            <FillBar pct={bin.fill} />
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 muted" /> Battery: <span className="font-semibold text-navy-900">{bin.battery}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 muted" /> Sensor: <span className="font-semibold text-navy-900">{bin.sensor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 muted" /> Updated: <span className="font-semibold text-navy-900">{timeAgo(bin.lastUpdated)}</span>
              </div>
            </div>
          </div>

          {/* History chart */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="section-title flex items-center gap-2">
                <History className="w-4 h-4 muted" /> 24-Hour Fill Level History
              </h3>
              <span className="text-[11px] muted">Demo data</span>
            </div>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-sm muted">Loading…</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="actualG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#213a66" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#213a66" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="predG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} interval={3} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip unit="%" />} />
                  <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'High', fontSize: 10, fill: '#ef4444' }} />
                  <Area type="monotone" dataKey="actual" name="Actual" stroke="#213a66" strokeWidth={2} fill="url(#actualG)" />
                  <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#f97316" strokeWidth={2} strokeDasharray="5 3" fill="url(#predG)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Collection history */}
          <div className="card p-4">
            <h3 className="section-title flex items-center gap-2 mb-3">
              <Trash2 className="w-4 h-4 muted" /> Collection History
            </h3>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs muted border-b border-slate-100">
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Vehicle</th>
                    <th className="py-2 pr-4 font-medium">Collected</th>
                    <th className="py-2 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {(collections.length ? collections : collectionHistory(bin)).map((c, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0">
                      <td className="py-2.5 pr-4 text-navy-700">{c.date}</td>
                      <td className="py-2.5 pr-4 text-navy-700">{c.vehicle}</td>
                      <td className="py-2.5 pr-4 text-navy-900 font-medium">{c.collectedKg} kg</td>
                      <td className="py-2.5 text-navy-700">{c.durationMin} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[11px] muted text-center">
            All readings are illustrative demo data, not from real IoT devices.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, accent }) {
  return (
    <div className="card p-3">
      <p className="text-[11px] muted uppercase tracking-wide flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className={`mt-1 text-lg font-bold ${accent}`}>{value}</p>
    </div>
  );
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

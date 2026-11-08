import { useMemo, useState } from 'react';
import { Search, ArrowUpDown, Trash2, RefreshCw } from 'lucide-react';
import Card from '@/components/Card';
import DemoBanner from '@/components/DemoBanner';
import { FillBar, PriorityBadge, StatusBadge } from '@/components/Badges';
import { bins as allBins } from '@/data/bins';
import { SENSOR_STATUS, COLLECTION_STATUS, PRIORITY } from '@/data/constants';

const STATUS_OPTS = ['All', ...Object.values(COLLECTION_STATUS)];
const SENSOR_OPTS = ['All', ...Object.values(SENSOR_STATUS)];
const PRIORITY_OPTS = ['All', ...Object.values(PRIORITY)];

const COLUMNS = [
  { key: 'id', label: 'Bin ID' },
  { key: 'location', label: 'Location' },
  { key: 'fill', label: 'Fill %' },
  { key: 'predicted', label: 'Predicted %' },
  { key: 'sensor', label: 'Sensor' },
  { key: 'lastUpdated', label: 'Last Updated' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ago`;
}

export default function BinMonitoring({ onSelectBin }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sensorFilter, setSensorFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortKey, setSortKey] = useState('fill');
  const [sortDir, setSortDir] = useState('desc');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    let out = allBins.filter((b) => {
      const q = query.toLowerCase();
      const matchQ = !q || b.id.toLowerCase().includes(q) || b.location.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchSensor = sensorFilter === 'All' || b.sensor === sensorFilter;
      const matchPriority = priorityFilter === 'All' || b.priority === priorityFilter;
      return matchQ && matchStatus && matchSensor && matchPriority;
    });
    out = out.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === 'lastUpdated') {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      }
      if (typeof av === 'string') {
        return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return out;
  }, [query, statusFilter, sensorFilter, priorityFilter, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }

  return (
    <div className="space-y-4">
      <DemoBanner>
        Bin readings are illustrative demo data. Simulated sensor refresh only — not live IoT.
      </DemoBanner>

      <Card bodyClass="p-4">
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search by Bin ID or location…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 lg:flex lg:gap-2">
            <select className="input lg:w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {STATUS_OPTS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
            </select>
            <select className="input lg:w-40" value={sensorFilter} onChange={(e) => setSensorFilter(e.target.value)}>
              {SENSOR_OPTS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Sensors' : s}</option>)}
            </select>
            <select className="input lg:w-40" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              {PRIORITY_OPTS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Priority' : s}</option>)}
            </select>
          </div>
          <button className="btn-ghost" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
        <p className="mt-3 text-xs muted">{filtered.length} of {allBins.length} bins shown</p>
      </Card>

      <Card bodyClass="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs muted uppercase tracking-wide">
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 font-medium">
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-navy-900 transition"
                    >
                      {col.label}
                      <ArrowUpDown className={`w-3 h-3 ${sortKey === col.key ? 'text-brand-600' : 'text-slate-300'}`} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => onSelectBin?.(b)}
                  className="cursor-pointer hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-navy-900 whitespace-nowrap">{b.id}</td>
                  <td className="px-4 py-3 text-navy-700 whitespace-nowrap">{b.location}</td>
                  <td className="px-4 py-3"><FillBar pct={b.fill} /></td>
                  <td className="px-4 py-3 text-navy-900 font-medium">{b.predicted}%</td>
                  <td className="px-4 py-3"><StatusBadge status={b.sensor} /></td>
                  <td className="px-4 py-3 muted whitespace-nowrap">{timeAgo(b.lastUpdated)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3"><PriorityBadge priority={b.priority} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-12 text-center muted">
                    <Trash2 className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    No bins match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-[11px] muted text-center">
        Click any row to view fill-level history, current reading, predicted fill level and collection history.
      </p>
    </div>
  );
}

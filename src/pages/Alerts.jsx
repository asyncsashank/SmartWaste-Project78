import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  BatteryLow,
  WifiOff,
  SignalLow,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
} from 'lucide-react';
import Card from '@/components/Card';
import DemoBanner from '@/components/DemoBanner';
import { generateAlerts } from '@/data/analytics';

const TYPE_ICONS = {
  'Overflow Risk': AlertTriangle,
  'High Fill Level': AlertTriangle,
  'Sensor Offline': WifiOff,
  'Weak Signal': SignalLow,
  'Low Battery': BatteryLow,
  'Collection Overdue': Clock,
  'Collection Completed': CheckCircle2,
  'Collection Pending': Trash2,
};

const SEVERITY_OPTS = ['All', 'Critical', 'High', 'Medium', 'Low'];
const TYPE_OPTS = ['All', 'Overflow Risk', 'High Fill Level', 'Sensor Offline', 'Weak Signal', 'Low Battery', 'Collection Overdue', 'Collection Completed', 'Collection Pending'];

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Alerts({ onSelectBin }) {
  const [severity, setSeverity] = useState('All');
  const [type, setType] = useState('All');
  const [readFilter, setReadFilter] = useState('all');

  const allAlerts = useMemo(() => generateAlerts(), []);

  const filtered = useMemo(() => {
    return allAlerts.filter((a) => {
      if (severity !== 'All' && a.severity !== severity) return false;
      if (type !== 'All' && a.type !== type) return false;
      if (readFilter === 'unread' && a.read) return false;
      if (readFilter === 'read' && !a.read) return false;
      return true;
    });
  }, [allAlerts, severity, type, readFilter]);

  const counts = useMemo(() => {
    const c = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    allAlerts.forEach((a) => (c[a.severity] = (c[a.severity] || 0) + 1));
    return c;
  }, [allAlerts]);

  const unread = allAlerts.filter((a) => !a.read).length;

  return (
    <div className="space-y-4">
      <DemoBanner>
        Alerts are generated from demo bin data, not live sensor events.
      </DemoBanner>

      {/* Severity summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Critical" value={counts.Critical} color="bg-danger-50 text-danger-700" icon={AlertTriangle} />
        <SummaryCard label="High" value={counts.High} color="bg-accent-50 text-accent-700" icon={AlertTriangle} />
        <SummaryCard label="Medium" value={counts.Medium} color="bg-warning-50 text-warning-600" icon={Bell} />
        <SummaryCard label="Low" value={counts.Low} color="bg-brand-50 text-brand-700" icon={CheckCircle2} />
      </div>

      {/* Filters */}
      <Card bodyClass="p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex items-center gap-2 text-sm muted shrink-0">
            <Filter className="w-4 h-4" /> Filters:
          </div>
          <select className="input lg:w-44" value={severity} onChange={(e) => setSeverity(e.target.value)}>
            {SEVERITY_OPTS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Severities' : s}</option>)}
          </select>
          <select className="input lg:w-52" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPE_OPTS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Types' : s}</option>)}
          </select>
          <div className="flex gap-1.5">
            {['all', 'unread', 'read'].map((r) => (
              <button
                key={r}
                onClick={() => setReadFilter(r)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${
                  readFilter === r ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {r === 'all' ? 'All' : r === 'unread' ? `Unread (${unread})` : 'Read'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Alert list */}
      <Card title="Notifications" subtitle={`${filtered.length} alerts`} bodyClass="p-0">
        <div className="divide-y divide-slate-100">
          {filtered.map((a) => {
            const Icon = TYPE_ICONS[a.type] || Bell;
            const sevConfig = {
              Critical: { ring: 'border-l-danger-500', bg: 'bg-danger-50/50', icon: 'text-danger-600' },
              High: { ring: 'border-l-danger-400', bg: 'bg-danger-50/30', icon: 'text-danger-600' },
              Medium: { ring: 'border-l-warning-400', bg: 'bg-warning-50/40', icon: 'text-warning-600' },
              Low: { ring: 'border-l-brand-500', bg: 'bg-brand-50/30', icon: 'text-brand-700' },
            }[a.severity] || { ring: 'border-l-slate-300', bg: '', icon: 'text-slate-500' };
            return (
              <button
                key={a.id}
                onClick={() => onSelectBin?.(null)}
                className={`w-full flex items-start gap-3 px-5 py-3.5 text-left border-l-4 ${sevConfig.ring} ${sevConfig.bg} hover:bg-slate-50 transition ${!a.read ? 'font-medium' : ''}`}
              >
                <div className={`w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 ${sevConfig.icon} border border-slate-200`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-navy-900">{a.type}</p>
                    <span className={`badge ${
                      a.severity === 'Critical' ? 'bg-danger-100 text-danger-700' :
                      a.severity === 'High' ? 'bg-danger-50 text-danger-600' :
                      a.severity === 'Medium' ? 'bg-warning-50 text-warning-600' :
                      'bg-brand-50 text-brand-700'
                    }`}>{a.severity}</span>
                    {!a.read && <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulseSoft" />}
                  </div>
                  <p className="text-sm text-navy-700 mt-0.5 leading-snug">{a.message}</p>
                  <p className="text-xs muted mt-1">{a.bin} · {a.location} · {timeAgo(a.time)}</p>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto text-brand-500 mb-2" />
              <p className="text-sm muted">No alerts match your filters.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, color, icon: Icon }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-navy-900 leading-tight">{value}</p>
        <p className="text-xs muted">{label}</p>
      </div>
    </div>
  );
}

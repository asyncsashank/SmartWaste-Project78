import { fillBucket, fillColor, priorityColor, PRIORITY } from '@/data/constants';

export function FillBadge({ pct, size = 'sm' }) {
  const c = fillColor(pct);
  const bucket = fillBucket(pct);
  const label = bucket === 'high' ? 'High' : bucket === 'medium' ? 'Medium' : 'Normal';
  const sizes = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`badge ${c.soft} ${c.text} ${sizes}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.bg }} />
      {label} · {pct}%
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const c = priorityColor(priority);
  return (
    <span className={`badge ${c.soft} ${c.text}`}>
      {priority === PRIORITY.CRITICAL && <span className="w-1.5 h-1.5 rounded-full bg-danger-500 animate-pulseSoft" />}
      {priority}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Pending: 'bg-warning-50 text-warning-600',
    Scheduled: 'bg-navy-50 text-navy-700',
    'In Progress': 'bg-brand-50 text-brand-700',
    Completed: 'bg-brand-50 text-brand-700',
    Overdue: 'bg-danger-50 text-danger-700',
    Active: 'bg-brand-50 text-brand-700',
    Idle: 'bg-slate-100 text-slate-600',
    Maintenance: 'bg-accent-50 text-accent-700',
    Offline: 'bg-danger-50 text-danger-700',
    Online: 'bg-brand-50 text-brand-700',
    'Weak Signal': 'bg-warning-50 text-warning-600',
  };
  return <span className={`badge ${map[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}

export function FillBar({ pct }) {
  const c = fillColor(pct);
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: c.bg }}
        />
      </div>
      <span className={`text-xs font-semibold ${c.text} w-9 text-right`}>{pct}%</span>
    </div>
  );
}

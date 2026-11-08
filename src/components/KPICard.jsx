import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({ icon: Icon, label, value, accent = 'brand', sub, trend, suffix }) {
  const accentMap = {
    brand: 'bg-brand-50 text-brand-700',
    danger: 'bg-danger-50 text-danger-700',
    accent: 'bg-accent-50 text-accent-700',
    navy: 'bg-navy-50 text-navy-700',
    warning: 'bg-warning-50 text-warning-600',
  };

  return (
    <div className="card card-hover p-4 sm:p-5 animate-fadeIn">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium muted uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl sm:text-[28px] font-bold text-navy-900 leading-tight">
            {value}
            {suffix && <span className="text-base font-medium muted ml-1">{suffix}</span>}
          </p>
          {sub && <p className="mt-1 text-xs muted">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      {trend != null && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend >= 0 ? (
            <span className="inline-flex items-center gap-1 text-brand-700 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +{trend}%
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-danger-600 font-medium">
              <TrendingDown className="w-3.5 h-3.5" /> {trend}%
            </span>
          )}
          <span className="muted">vs last week</span>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import {
  BrainCircuit,
  TrendingUp,
  Gauge,
  Target,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import Card from '@/components/Card';
import DemoBanner from '@/components/DemoBanner';
import ChartTooltip from '@/components/ChartTooltip';
import { FillBadge, PriorityBadge } from '@/components/Badges';
import { apiService } from '@/services/api';
import { bins, fillHistory } from '@/data/bins';

export default function Predictions({ onSelectBin }) {
  const [predictions, setPredictions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([apiService.getPredictions(), apiService.getModelMetrics()]).then(
      ([p, m]) => {
        if (!alive) return;
        setPredictions(p.data);
        setMetrics(m.data);
        setLoading(false);
      },
    );
    return () => {
      alive = false;
    };
  }, []);

  const overflowBins = useMemo(
    () => predictions.filter((p) => p.predicted6h >= 90).sort((a, b) => b.predicted6h - a.predicted6h),
    [predictions],
  );

  const highPriority = predictions.filter((p) => p.priority === 'High' || p.priority === 'Critical');
  const mediumPriority = predictions.filter((p) => p.priority === 'Medium');
  const lowPriority = predictions.filter((p) => p.priority === 'Low');

  const sampleHistory = useMemo(() => fillHistory(bins[0]), []);

  return (
    <div className="space-y-4">
      <DemoBanner>
        Predictions are illustrative demo values generated in the browser, not from a trained ML model.
        Replace with real model API output when available.
      </DemoBanner>

      {/* Model performance */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card
          title="Model Performance"
          subtitle="Illustrative until model evaluation completes"
          className="lg:col-span-1"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-xs muted">Demo metrics</span>
          </div>
          {loading ? (
            <p className="text-sm muted">Loading…</p>
          ) : (
            <div className="space-y-3">
              <Metric icon={Gauge} label="MAE" value={metrics?.mae?.toFixed(2)} hint="Mean Absolute Error" />
              <Metric icon={Target} label="RMSE" value={metrics?.rmse?.toFixed(2)} hint="Root Mean Sq. Error" />
              <Metric icon={TrendingUp} label="R²" value={metrics?.r2?.toFixed(3)} hint="Coefficient of determination" accent />
            </div>
          )}
        </Card>

        {/* Actual vs predicted */}
        <Card
          title="Actual vs Predicted Fill Level"
          subtitle="24h trend — sample bin — demo data"
          className="lg:col-span-3"
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={sampleHistory}>
              <defs>
                <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#213a66" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#213a66" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pG2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} interval={3} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
              <Tooltip content={<ChartTooltip unit="%" />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#213a66" strokeWidth={2.5} fill="url(#aG)" />
              <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 3" fill="url(#pG2)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Prediction horizon cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HorizonCard title="Predicted Fill After 2 Hours" predictions={predictions} field="predicted2h" />
        <HorizonCard title="Predicted Fill After 4 Hours" predictions={predictions} field="predicted4h" />
        <HorizonCard title="Predicted Fill After 6 Hours" predictions={predictions} field="predicted6h" highlight />
      </div>

      {/* Overflow bins */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card
          title="Bins Likely to Overflow"
          subtitle="Predicted ≥ 90% within 6h — demo"
          className="xl:col-span-2"
          bodyClass="p-0"
        >
          <div className="divide-y divide-slate-100">
            {overflowBins.map((p) => (
              <button
                key={p.binId}
                onClick={() => onSelectBin?.(bins.find((b) => b.id === p.binId))}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 text-left transition"
              >
                <div className="w-9 h-9 rounded-lg bg-danger-50 text-danger-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy-900 truncate">{p.binId} · {p.location}</p>
                  <p className="text-xs muted">Now {p.current}% → 6h {p.predicted6h}%</p>
                </div>
                <PriorityBadge priority={p.priority} />
              </button>
            ))}
            {overflowBins.length === 0 && <p className="px-5 py-8 text-sm muted text-center">No overflow predicted.</p>}
          </div>
        </Card>

        {/* Priority distribution */}
        <Card title="Collection Priority" subtitle="ML-derived — demo">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { name: 'High', value: highPriority.length, color: '#ef4444' },
                { name: 'Medium', value: mediumPriority.length, color: '#f97316' },
                { name: 'Low', value: lowPriority.length, color: '#10b981' },
              ]}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#64748b' }} width={70} />
              <Tooltip content={<ChartTooltip unit=" bins" />} />
              <Bar dataKey="value" name="Bins" radius={[0, 4, 4, 0]}>
                {[
                  { color: '#ef4444' },
                  { color: '#f97316' },
                  { color: '#10b981' },
                ].map((c, i) => (
                  <Cell key={i} fill={c.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs muted mt-2 flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5" /> {highPriority.length} High · {mediumPriority.length} Medium · {lowPriority.length} Low
          </p>
        </Card>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, hint, accent }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-navy-700" />
        <div>
          <p className="text-sm font-semibold text-navy-900">{label}</p>
          <p className="text-[11px] muted">{hint}</p>
        </div>
      </div>
      <span className={`text-lg font-bold ${accent ? 'text-brand-700' : 'text-navy-900'}`}>{value}</span>
    </div>
  );
}

function HorizonCard({ title, predictions, field, highlight }) {
  const data = predictions.slice(0, 8).map((p) => ({
    name: p.binId,
    value: p[field],
  }));
  return (
    <Card title={title} subtitle="Top 8 bins — demo">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-30} textAnchor="end" height={50} interval={0} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
          <Tooltip content={<ChartTooltip unit="%" />} />
          <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" />
          <Bar dataKey="value" name="Predicted %" radius={[3, 3, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.value >= 90 ? '#dc2626' : d.value >= 80 ? '#ef4444' : d.value >= 50 ? '#f97316' : '#10b981'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

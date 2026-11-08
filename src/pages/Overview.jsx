import { useMemo } from 'react';
import {
  Trash2,
  AlertTriangle,
  CircleAlert,
  CheckCircle2,
  Truck,
  CalendarClock,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import KPICard from '@/components/KPICard';
import Card from '@/components/Card';
import ChartTooltip from '@/components/ChartTooltip';
import { FillBadge, PriorityBadge } from '@/components/Badges';
import { bins, fillHistory } from '@/data/bins';
import { vehicles } from '@/data/vehicles';
import {
  kpis,
  weeklyAccumulation,
  wasteCollectedToday,
  binUtilization,
  recentCollections,
  generateAlerts,
} from '@/data/analytics';

export default function Overview({ onSelectBin }) {
  const k = useMemo(() => kpis(), []);
  const alerts = useMemo(() => generateAlerts(), []);
  const topBins = useMemo(
    () => [...bins].sort((a, b) => b.fill - a.fill).slice(0, 6),
    [],
  );
  const criticalAlerts = useMemo(() => alerts.filter((a) => a.severity === 'Critical' || a.severity === 'High').slice(0, 5), [alerts]);
  const historySample = useMemo(() => fillHistory(bins[0]), []);

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <KPICard icon={Trash2} label="Total Smart Bins" value={k.total} accent="navy" trend={0} />
        <KPICard icon={AlertTriangle} label="Full Bins" value={k.full} accent="danger" sub="≥ 80% fill" trend={12} />
        <KPICard icon={CircleAlert} label="Medium-Level Bins" value={k.medium} accent="accent" sub="50–79% fill" trend={-4} />
        <KPICard icon={CheckCircle2} label="Normal Bins" value={k.normal} accent="brand" sub="below 50%" trend={3} />
        <KPICard icon={Truck} label="Active Vehicles" value={k.activeVehicles} accent="navy" sub="of 5 fleet" />
        <KPICard icon={CalendarClock} label="Bins Requiring Collection" value={k.requiringCollection} accent="warning" sub="pending / overdue" trend={8} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card
          title="Weekly Waste Accumulation"
          subtitle="Collected vs predicted (kg) — demo data"
          className="xl:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyAccumulation}>
              <defs>
                <linearGradient id="colG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip content={<ChartTooltip unit=" kg" />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="collected" name="Collected" stroke="#10b981" strokeWidth={2.5} fill="url(#colG)" />
              <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#f97316" strokeWidth={2} strokeDasharray="5 3" fill="url(#predG)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Bin Status Distribution" subtitle="By fill level — demo data">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={binUtilization}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
              >
                {binUtilization.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip unit=" bins" />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card
          title="Actual vs Predicted Fill Level"
          subtitle="24h trend for a sample bin — demo data"
          className="xl:col-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={historySample}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} interval={3} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
              <Tooltip content={<ChartTooltip unit="%" />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#213a66" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#f97316" strokeWidth={2} strokeDasharray="5 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Waste Collected Today" subtitle="Hourly cumulative (kg)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={wasteCollectedToday}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<ChartTooltip unit=" kg" />} />
              <Bar dataKey="kg" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top bins requiring collection */}
        <Card
          title="Top Bins Requiring Immediate Collection"
          subtitle="Sorted by fill level"
          className="xl:col-span-2"
          bodyClass="p-0"
        >
          <div className="divide-y divide-slate-100">
            {topBins.map((b) => (
              <button
                key={b.id}
                onClick={() => onSelectBin?.(b)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy-900 truncate">{b.id} · {b.location}</p>
                  <p className="text-xs muted">Predicted {b.predicted}% · {b.sensor}</p>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <FillBadge pct={b.fill} />
                  <PriorityBadge priority={b.priority} />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        </Card>

        {/* Critical alerts */}
        <Card title="Critical Alerts" subtitle="High & critical priority">
          <div className="space-y-2.5">
            {criticalAlerts.map((a) => (
              <div key={a.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-danger-50/60 border border-danger-100">
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${a.severity === 'Critical' ? 'text-danger-600' : 'text-accent-600'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy-900 leading-snug">{a.type}</p>
                  <p className="text-xs muted leading-snug">{a.message}</p>
                </div>
              </div>
            ))}
            {criticalAlerts.length === 0 && <p className="text-sm muted">No critical alerts.</p>}
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      <Card title="Recent Collection Activity" subtitle="Today — demo data" bodyClass="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs muted uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-2.5 font-medium">Bin</th>
                <th className="text-left px-5 py-2.5 font-medium">Location</th>
                <th className="text-left px-5 py-2.5 font-medium">Vehicle</th>
                <th className="text-right px-5 py-2.5 font-medium">Collected</th>
                <th className="text-right px-5 py-2.5 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCollections.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-5 py-2.5 font-medium text-navy-900">{c.bin}</td>
                  <td className="px-5 py-2.5 text-navy-700">{c.location}</td>
                  <td className="px-5 py-2.5 text-navy-700">{c.vehicle}</td>
                  <td className="px-5 py-2.5 text-right font-semibold text-brand-700">{c.collectedKg} kg</td>
                  <td className="px-5 py-2.5 text-right muted">{c.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

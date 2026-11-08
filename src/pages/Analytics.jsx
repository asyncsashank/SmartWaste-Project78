import { useMemo, useState } from 'react';
import {
  Download,
  TrendingUp,
  Fuel,
  Gauge,
  Map as MapIcon,
  BarChart3,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '@/components/Card';
import DemoBanner from '@/components/DemoBanner';
import ChartTooltip from '@/components/ChartTooltip';
import {
  dailyTrend,
  weeklyAccumulation,
  areaWiseGeneration,
  routeDistances,
} from '@/data/analytics';
import { collectionHistory, bins } from '@/data/bins';

export default function Analytics() {
  const [range, setRange] = useState('week'); // day | week

  const collectionHistoryRows = useMemo(() => {
    const rows = [];
    bins.slice(0, 12).forEach((b) => {
      collectionHistory(b).forEach((c) => {
        rows.push({
          date: c.date,
          bin: b.id,
          location: b.location,
          vehicle: c.vehicle,
          collectedKg: c.collectedKg,
          durationMin: c.durationMin,
        });
      });
    });
    return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, []);

  function downloadCSV(filename, rows) {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const totalCollected = dailyTrend.reduce((s, d) => s + d.collected, 0);
  const avgEfficiency = Math.round(dailyTrend.reduce((s, d) => s + d.efficiency, 0) / dailyTrend.length);
  const totalFuel = dailyTrend.reduce((s, d) => s + d.fuel, 0);

  return (
    <div className="space-y-4">
      <DemoBanner>
        Analytics are computed from demo data. CSV exports contain demo figures only.
      </DemoBanner>

      {/* Filters + export */}
      <Card bodyClass="p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 muted" />
            <div className="flex gap-1.5">
              {['day', 'week'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    range === r ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {r === 'day' ? 'Daily' : 'Weekly'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => downloadCSV('collection_history.csv', collectionHistoryRows)}>
              <Download className="w-4 h-4" /> Collection History
            </button>
            <button className="btn-ghost" onClick={() => downloadCSV('daily_trends.csv', dailyTrend)}>
              <Download className="w-4 h-4" /> Daily Trends
            </button>
            <button className="btn-primary" onClick={() => downloadCSV('full_analytics_report.csv', [...dailyTrend, ...areaWiseGeneration])}>
              <Download className="w-4 h-4" /> Full Report
            </button>
          </div>
        </div>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryStat icon={TrendingUp} label="Total Collected (7d)" value={`${(totalCollected / 1000).toFixed(1)}t`} color="text-brand-700" />
        <SummaryStat icon={Gauge} label="Avg Efficiency" value={`${avgEfficiency}%`} color="text-navy-900" />
        <SummaryStat icon={Fuel} label="Fuel Used (7d)" value={`${totalFuel} L`} color="text-accent-700" />
        <SummaryStat icon={BarChart3} label="Areas Covered" value={areaWiseGeneration.length} color="text-navy-900" />
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card title="Daily Waste Collection Trend" subtitle="Collected kg, fuel & efficiency — demo" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="collected" name="Collected (kg)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="fuel" name="Fuel (L)" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="efficiency" name="Efficiency (%)" stroke="#213a66" strokeWidth={2} strokeDasharray="5 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Area-wise Waste Generation" subtitle="kg per zone — demo">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={areaWiseGeneration} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis dataKey="area" type="category" tick={{ fontSize: 10, fill: '#64748b' }} width={90} />
              <Tooltip content={<ChartTooltip unit=" kg" />} />
              <Bar dataKey="kg" name="Waste (kg)" fill="#213a66" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Route distance */}
        <Card title="Vehicle Route Distance" subtitle="Per route — demo">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={routeDistances}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="route" tick={{ fontSize: 10, fill: '#64748b' }} angle={-15} textAnchor="end" height={60} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<ChartTooltip unit=" km" />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="distance" name="Distance (km)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stops" name="Stops" fill="#213a66" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly accumulation */}
        <Card title="Weekly Collection Trend" subtitle="Collected vs predicted — demo">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyAccumulation}>
              <defs>
                <linearGradient id="aW" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#213a66" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#213a66" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip content={<ChartTooltip unit=" kg" />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="collected" name="Collected" stroke="#213a66" strokeWidth={2.5} fill="url(#aW)" />
              <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#f97316" strokeWidth={2} strokeDasharray="5 3" fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Collection history table */}
      <Card title="Collection History" subtitle="Recent records — demo" bodyClass="p-0">
        <div className="overflow-x-auto max-h-[360px]">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs muted uppercase tracking-wide sticky top-0">
              <tr>
                <th className="text-left px-5 py-2.5 font-medium">Date</th>
                <th className="text-left px-5 py-2.5 font-medium">Bin</th>
                <th className="text-left px-5 py-2.5 font-medium">Location</th>
                <th className="text-left px-5 py-2.5 font-medium">Vehicle</th>
                <th className="text-right px-5 py-2.5 font-medium">Collected</th>
                <th className="text-right px-5 py-2.5 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {collectionHistoryRows.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-5 py-2.5 text-navy-700 whitespace-nowrap">{c.date}</td>
                  <td className="px-5 py-2.5 font-medium text-navy-900">{c.bin}</td>
                  <td className="px-5 py-2.5 text-navy-700">{c.location}</td>
                  <td className="px-5 py-2.5 text-navy-700">{c.vehicle}</td>
                  <td className="px-5 py-2.5 text-right font-semibold text-brand-700">{c.collectedKg} kg</td>
                  <td className="px-5 py-2.5 text-right muted">{c.durationMin} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SummaryStat({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-slate-50 text-navy-700 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className={`text-xl font-bold ${color} leading-tight`}>{value}</p>
        <p className="text-xs muted">{label}</p>
      </div>
    </div>
  );
}

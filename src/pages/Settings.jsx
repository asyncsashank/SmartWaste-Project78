import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Gauge,
  Database,
  Cpu,
  Truck,
  Shield,
  Save,
  User,
} from 'lucide-react';
import Card from '@/components/Card';
import DemoBanner from '@/components/DemoBanner';

export default function Settings() {
  const [thresholds, setThresholds] = useState({ medium: 50, high: 80, critical: 95 });
  const [refresh, setRefresh] = useState(60);
  const [notifications, setNotifications] = useState({
    overflow: true,
    high: true,
    offline: true,
    battery: true,
    completed: false,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <DemoBanner>
        Settings are stored in the browser only for this demo. No backend persistence is connected.
      </DemoBanner>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Profile */}
        <Card title="Admin Profile" subtitle="Operator account">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-navy-900 text-white flex items-center justify-center text-lg font-semibold">
              AD
            </div>
            <div>
              <p className="font-semibold text-navy-900">Municipal Admin</p>
              <p className="text-sm muted">Greater Visakhapatnam Municipal Corporation</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs muted">Display Name</label>
              <input className="input mt-1" defaultValue="Admin" />
            </div>
            <div>
              <label className="text-xs muted">Email</label>
              <input className="input mt-1" defaultValue="admin@gvmc.gov.in" />
            </div>
          </div>
        </Card>

        {/* Fill thresholds */}
        <Card title="Bin Fill Thresholds" subtitle="Priority classification levels (%)">
          <div className="space-y-3">
            <ThresholdInput label="Medium" value={thresholds.medium} color="text-accent-700"
              onChange={(v) => setThresholds({ ...thresholds, medium: v })} />
            <ThresholdInput label="High" value={thresholds.high} color="text-danger-600"
              onChange={(v) => setThresholds({ ...thresholds, high: v })} />
            <ThresholdInput label="Critical" value={thresholds.critical} color="text-danger-700"
              onChange={(v) => setThresholds({ ...thresholds, critical: v })} />
          </div>
        </Card>

        {/* Data refresh */}
        <Card title="Data Refresh" subtitle="Sensor reading poll interval">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 text-navy-700 flex items-center justify-center">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy-900">Refresh interval</p>
                <p className="text-xs muted">How often bins are polled (demo)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={10}
                max={3600}
                className="input w-24 text-right"
                value={refresh}
                onChange={(e) => setRefresh(Number(e.target.value))}
              />
              <span className="text-sm muted">sec</span>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card title="Notification Preferences" subtitle="Alert types to receive">
          <div className="space-y-1">
            <NotifRow label="Bin overflow risk" desc="Alert when a bin nears 100%" checked={notifications.overflow}
              onChange={(v) => setNotifications({ ...notifications, overflow: v })} />
            <NotifRow label="High fill level" desc="Alert when a bin exceeds 80%" checked={notifications.high}
              onChange={(v) => setNotifications({ ...notifications, high: v })} />
            <NotifRow label="Sensor offline" desc="Alert when an IoT sensor goes offline" checked={notifications.offline}
              onChange={(v) => setNotifications({ ...notifications, offline: v })} />
            <NotifRow label="Low sensor battery" desc="Alert when battery drops below 25%" checked={notifications.battery}
              onChange={(v) => setNotifications({ ...notifications, battery: v })} />
            <NotifRow label="Collection completed" desc="Notify when a collection is done" checked={notifications.completed}
              onChange={(v) => setNotifications({ ...notifications, completed: v })} />
          </div>
        </Card>
      </div>

      {/* Integration status */}
      <Card title="Integration Status" subtitle="Planned backend connections — data flow architecture">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <Integration icon={Cpu} label="IoT Sensors (ESP32 + LoRa)" status="Demo" detail="Ultrasonic → ESP32 → LoRa → Gateway" />
          <Integration icon={Database} label="Backend Database" status="Demo" detail="Bin readings, history, collections" />
          <Integration icon={Cpu} label="ML Prediction API" status="Demo" detail="Fill-level forecast (2/4/6h)" />
          <Integration icon={Truck} label="OR-Tools Route Optimizer" status="Demo" detail="VRP solver — not yet connected" />
        </div>
        <div className="mt-4 p-3 rounded-lg bg-slate-50 text-xs muted leading-relaxed">
          <p className="font-medium text-navy-700 mb-1">Data flow architecture:</p>
          Ultrasonic Sensor → ESP32 → LoRa Communication → Gateway → Backend → Database →
          ML Prediction → Collection Priority → Route Optimization → Dashboard.
          All stages currently use demo data; each can be swapped for a real service via the API layer.
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <button className="btn-primary" onClick={handleSave}>
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function ThresholdInput({ label, value, color, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm font-medium ${color}`}>{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-40 accent-brand-600"
        />
        <span className="text-sm font-semibold text-navy-900 w-12 text-right">{value}%</span>
      </div>
    </div>
  );
}

function NotifRow({ label, desc, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <div>
        <p className="text-sm text-navy-900">{label}</p>
        <p className="text-xs muted">{desc}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-brand-600"
      />
    </label>
  );
}

function Integration({ icon: Icon, label, status, detail }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-4 h-4 text-navy-700" />
        <span className="text-sm font-medium text-navy-900">{label}</span>
      </div>
      <span className="badge bg-warning-50 text-warning-600 mb-1.5">{status}</span>
      <p className="text-xs muted leading-snug">{detail}</p>
    </div>
  );
}

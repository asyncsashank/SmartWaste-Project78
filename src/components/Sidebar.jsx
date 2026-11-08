import {
  LayoutDashboard,
  Trash2,
  Map,
  BrainCircuit,
  Route,
  Truck,
  Bell,
  BarChart3,
  Settings,
  Leaf,
  X,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bins', label: 'Smart Bin Monitoring', icon: Trash2 },
  { id: 'map', label: 'Live Map', icon: Map },
  { id: 'predictions', label: 'ML Predictions', icon: BrainCircuit },
  { id: 'routes', label: 'Dynamic Route Optimization', icon: Route },
  { id: 'vehicles', label: 'Vehicle Tracking', icon: Truck },
  { id: 'alerts', label: 'Alerts and Notifications', icon: Bell },
  { id: 'analytics', label: 'Analytics and Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ active, onNavigate, open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-navy-950/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-screen w-64 bg-navy-900 text-slate-300 flex flex-col z-50 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center shadow-md">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-white font-semibold text-sm">SmartWaste</p>
              <p className="text-navy-300 text-[11px]">Command Center</p>
            </div>
          </div>
          <button
            className="lg:hidden text-navy-300 hover:text-white"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-navy-800 text-[11px] text-navy-400 leading-relaxed">
          <p className="font-medium text-navy-300">B.Tech Final Year Project</p>
          <p>ML-Based Predictive Waste Collection &amp; Smart Bin Monitoring</p>
          <p className="mt-1 text-navy-500">Demo Dashboard · v1.0</p>
        </div>
      </aside>
    </>
  );
}

import { useEffect, useMemo, useState } from 'react';
import Sidebar, { NAV_ITEMS } from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import BinDetailModal from '@/components/BinDetailModal';
import Overview from '@/pages/Overview';
import BinMonitoring from '@/pages/BinMonitoring';
import LiveMap from '@/pages/LiveMap';
import Predictions from '@/pages/Predictions';
import RouteOptimization from '@/pages/RouteOptimization';
import VehicleTracking from '@/pages/VehicleTracking';
import Alerts from '@/pages/Alerts';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import { generateAlerts } from '@/data/analytics';
import { bins as allBins } from '@/data/bins';

type Bin = (typeof allBins)[number];

type PageId =
  | 'overview'
  | 'bins'
  | 'map'
  | 'predictions'
  | 'routes'
  | 'vehicles'
  | 'alerts'
  | 'analytics'
  | 'settings';

const TITLE_MAP: Record<PageId, string> = {
  overview: 'Overview',
  bins: 'Smart Bin Monitoring',
  map: 'Live Map',
  predictions: 'ML Predictions',
  routes: 'Dynamic Route Optimization',
  vehicles: 'Vehicle Tracking',
  alerts: 'Alerts and Notifications',
  analytics: 'Analytics and Reports',
  settings: 'Settings',
};

export default function App() {
  const [page, setPage] = useState<PageId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);

  const alertCount = useMemo(
    () => generateAlerts().filter((a) => !a.read).length,
    [],
  );

  // Simulated sensor refresh: nudge fill values every 30s for a live feel.
  // This only mutates local state copies shown in the modal — demo only.
  useEffect(() => {
    const id = setInterval(() => {
      // Intentionally a no-op visual placeholder; real refresh would come via apiService.
    }, 30000);
    return () => clearInterval(id);
  }, []);

  function navigate(id: string) {
    setPage(id as PageId);
    setSidebarOpen(false);
  }

  function openBin(bin: Bin | null) {
    if (bin) setSelectedBin(bin);
  }

  const title = TITLE_MAP[page];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        active={page}
        onNavigate={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          alertCount={alertCount}
          onBellClick={() => navigate('alerts')}
          onNavigate={navigate}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
          <div key={page} className="animate-fadeIn">
            {page === 'overview' && <Overview onSelectBin={openBin} />}
            {page === 'bins' && <BinMonitoring onSelectBin={openBin} />}
            {page === 'map' && <LiveMap onSelectBin={openBin} />}
            {page === 'predictions' && <Predictions onSelectBin={openBin} />}
            {page === 'routes' && <RouteOptimization />}
            {page === 'vehicles' && <VehicleTracking />}
            {page === 'alerts' && <Alerts onSelectBin={openBin} />}
            {page === 'analytics' && <Analytics />}
            {page === 'settings' && <Settings />}
          </div>
        </main>
      </div>

      {selectedBin && <BinDetailModal bin={selectedBin} onClose={() => setSelectedBin(null)} />}
    </div>
  );
}

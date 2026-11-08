import { Search, Bell, Menu } from 'lucide-react';

export default function Topbar({ title, onMenuClick, alertCount = 0, onBellClick, onNavigate }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
        <button
          className="lg:hidden p-2 -ml-2 rounded-lg text-navy-700 hover:bg-slate-100"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-[15px] sm:text-base font-semibold text-navy-900 truncate">
            {title}
          </h1>
          <p className="hidden sm:block text-xs muted">{today}</p>
        </div>

        {/* Search */}
        <div className="hidden md:flex relative w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-9 py-2"
            placeholder="Search bins, vehicles, alerts..."
          />
        </div>

        {/* Bell */}
        <button
          onClick={onBellClick}
          className="relative p-2 rounded-lg text-navy-700 hover:bg-slate-100 transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulseSoft">
              {alertCount > 99 ? '99+' : alertCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate?.('settings')}
          className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition"
        >
          <div className="w-9 h-9 rounded-full bg-navy-800 text-white flex items-center justify-center text-sm font-semibold">
            AD
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-sm font-medium text-navy-900">Admin</p>
            <p className="text-[11px] muted">Municipal Operator</p>
          </div>
        </button>
      </div>
    </header>
  );
}

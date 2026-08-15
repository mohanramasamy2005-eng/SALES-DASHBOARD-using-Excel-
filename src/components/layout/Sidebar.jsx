import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LineChart, Package, Users, ShoppingCart, FileText, Settings, TrendingUp, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/analytics', label: 'Sales Analytics', icon: LineChart },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark z-50 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Primary navigation"
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-border dark:border-border-dark shrink-0">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand-500 text-white">
              <TrendingUp size={17} strokeWidth={2.25} />
            </span>
            <span className="font-semibold tracking-tight text-[15px]">Peakline</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted hover:text-ink dark:hover:text-ink-dark" aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300'
                    : 'text-muted hover:bg-canvas dark:hover:bg-white/5 hover:text-ink dark:hover:text-ink-dark'
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-border dark:border-border-dark text-[11px] text-muted shrink-0">
          <p>Peakline Sales Analytics</p>
          <p className="mt-0.5">Mock data · Demo build</p>
        </div>
      </aside>
    </>
  );
}

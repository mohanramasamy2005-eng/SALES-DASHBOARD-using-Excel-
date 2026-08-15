import { Sun, Moon, RotateCcw, Database } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFilters } from '../context/FilterContext';
import { formatNumber } from '../utils/format';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { resetFilters, activeFilterCount, allOrders, products, customers } = useFilters();

  return (
    <div className="space-y-5 max-w-2xl">
      <section className="card p-5">
        <h3 className="text-sm font-semibold">Appearance</h3>
        <p className="text-xs text-muted mt-0.5">Choose how Peakline looks on this device. Saved automatically.</p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
            className={`flex-1 flex flex-col items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors ${
              theme === 'light' ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/30' : 'border-border dark:border-border-dark text-muted hover:bg-canvas dark:hover:bg-white/5'
            }`}
          >
            <Sun size={18} />
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
            className={`flex-1 flex flex-col items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-colors ${
              theme === 'dark' ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/30' : 'border-border dark:border-border-dark text-muted hover:bg-canvas dark:hover:bg-white/5'
            }`}
          >
            <Moon size={18} />
            Dark
          </button>
        </div>
      </section>

      <section className="card p-5">
        <h3 className="text-sm font-semibold">Filters</h3>
        <p className="text-xs text-muted mt-0.5">Clear every active date, region, category and product filter across the dashboard.</p>
        <button onClick={resetFilters} disabled={activeFilterCount === 0} className="btn-secondary mt-4">
          <RotateCcw size={14} />
          Reset all filters {activeFilterCount > 0 && `(${activeFilterCount} active)`}
        </button>
      </section>

      <section className="card p-5">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-muted" />
          <h3 className="text-sm font-semibold">Dataset</h3>
        </div>
        <p className="text-xs text-muted mt-0.5">Peakline runs on a self-contained, deterministic mock dataset — no backend or external API calls.</p>
        <dl className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div className="rounded-md bg-canvas dark:bg-white/5 py-3">
            <dt className="text-[11px] text-muted uppercase tracking-wide">Orders</dt>
            <dd className="tabular text-lg font-semibold mt-0.5">{formatNumber(allOrders.length)}</dd>
          </div>
          <div className="rounded-md bg-canvas dark:bg-white/5 py-3">
            <dt className="text-[11px] text-muted uppercase tracking-wide">Products</dt>
            <dd className="tabular text-lg font-semibold mt-0.5">{formatNumber(products.length)}</dd>
          </div>
          <div className="rounded-md bg-canvas dark:bg-white/5 py-3">
            <dt className="text-[11px] text-muted uppercase tracking-wide">Customers</dt>
            <dd className="tabular text-lg font-semibold mt-0.5">{formatNumber(customers.length)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

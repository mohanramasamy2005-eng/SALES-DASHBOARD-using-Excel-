import { RotateCcw } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { isoDateNDaysAgo } from '../../utils/calculations';

const QUICK_RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: 'All', days: null },
];

export default function FilterBar() {
  const { filters, updateFilter, resetFilters, activeFilterCount, categories, regions, products } = useFilters();

  const applyQuickRange = (days) => {
    if (days === null) {
      updateFilter('startDate', '');
      updateFilter('endDate', '');
      return;
    }
    updateFilter('startDate', isoDateNDaysAgo(days));
    updateFilter('endDate', isoDateNDaysAgo(0));
  };

  const filteredProducts = filters.category === 'All' ? products : products.filter((p) => p.category === filters.category);

  return (
    <div className="card p-3 sm:p-4 flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-medium text-muted uppercase tracking-wide" htmlFor="start-date">
          From
        </label>
        <input
          id="start-date"
          type="date"
          value={filters.startDate}
          onChange={(e) => updateFilter('startDate', e.target.value)}
          className="input"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-medium text-muted uppercase tracking-wide" htmlFor="end-date">
          To
        </label>
        <input
          id="end-date"
          type="date"
          value={filters.endDate}
          onChange={(e) => updateFilter('endDate', e.target.value)}
          className="input"
        />
      </div>

      <div className="flex gap-1" role="group" aria-label="Quick date range presets">
        {QUICK_RANGES.map((r) => (
          <button key={r.label} onClick={() => applyQuickRange(r.days)} className="btn-secondary !px-2.5 !py-1 text-xs">
            {r.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-medium text-muted uppercase tracking-wide" htmlFor="region-filter">
          Region
        </label>
        <select id="region-filter" value={filters.region} onChange={(e) => updateFilter('region', e.target.value)} className="input">
          <option value="All">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-medium text-muted uppercase tracking-wide" htmlFor="category-filter">
          Category
        </label>
        <select
          id="category-filter"
          value={filters.category}
          onChange={(e) => {
            updateFilter('category', e.target.value);
            updateFilter('product', 'All');
          }}
          className="input"
        >
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[10rem]">
        <label className="text-[11px] font-medium text-muted uppercase tracking-wide" htmlFor="product-filter">
          Product
        </label>
        <select id="product-filter" value={filters.product} onChange={(e) => updateFilter('product', e.target.value)} className="input">
          <option value="All">All products</option>
          {filteredProducts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={resetFilters} className="btn-secondary text-xs">
          <RotateCcw size={13} />
          Reset ({activeFilterCount})
        </button>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { getProductPerformance } from '../utils/calculations';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import SearchInput from '../components/ui/SearchInput';
import { useSimulatedLoading } from '../utils/useLoading';

function stockStatus(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock < 40) return 'Low Stock';
  return 'In Stock';
}

export default function Products() {
  const { filteredOrders, products, categories } = useFilters();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const loading = useSimulatedLoading([]);

  const performance = useMemo(() => {
    const perf = getProductPerformance(filteredOrders, products);
    const byId = Object.fromEntries(perf.map((p) => [p.productId, p]));
    // Ensure every catalog product appears even with zero orders in the filtered range.
    return products.map((p) => byId[p.id] ?? { productId: p.id, name: p.name, category: p.category, revenue: 0, profit: 0, unitsSold: 0, orders: 0, price: p.price, stock: p.stock, margin: 0 });
  }, [filteredOrders, products]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return performance.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (q && !`${p.name} ${p.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [performance, search, category]);

  const columns = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true, align: 'right', render: (r) => <span className="tabular">{formatCurrency(r.price)}</span> },
    { key: 'unitsSold', label: 'Units Sold', sortable: true, align: 'right', render: (r) => <span className="tabular">{formatNumber(r.unitsSold)}</span> },
    { key: 'revenue', label: 'Revenue', sortable: true, align: 'right', render: (r) => <span className="tabular">{formatCurrency(r.revenue)}</span> },
    {
      key: 'margin',
      label: 'Margin',
      sortable: true,
      align: 'right',
      render: (r) => <span className={`tabular ${r.margin >= 0 ? 'text-good' : 'text-bad'}`}>{r.revenue ? formatPercent(r.margin) : '—'}</span>,
    },
    { key: 'stock', label: 'Stock', sortable: true, align: 'right', render: (r) => <span className="tabular">{r.stock}</span> },
    { key: 'stockStatus', label: 'Status', sortable: false, render: (r) => <StatusBadge status={stockStatus(r.stock)} /> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products…" className="max-w-sm w-full" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input sm:w-56">
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted tabular sm:ml-auto">{rows.length} products</p>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        pageSize={12}
        loading={loading}
        getRowId={(r) => r.productId}
        emptyTitle="No products found"
        emptyDescription="Try a different search term or category."
      />
    </div>
  );
}

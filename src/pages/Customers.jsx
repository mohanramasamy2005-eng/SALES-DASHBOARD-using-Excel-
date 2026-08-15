import { useMemo, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { getCustomerPerformance } from '../utils/calculations';
import { formatCurrency, formatDate } from '../utils/format';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import SearchInput from '../components/ui/SearchInput';
import { useSimulatedLoading } from '../utils/useLoading';

export default function Customers() {
  const { filteredOrders, customers, regions } = useFilters();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [status, setStatus] = useState('All');
  const loading = useSimulatedLoading([]);

  const performance = useMemo(() => getCustomerPerformance(filteredOrders, customers), [filteredOrders, customers]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return performance.filter((c) => {
      if (region !== 'All' && c.region !== region) return false;
      if (status !== 'All' && c.status !== status) return false;
      if (q && !`${c.name} ${c.email}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [performance, search, region, status]);

  const columns = [
    { key: 'name', label: 'Customer', sortable: true },
    { key: 'region', label: 'Region', sortable: true },
    { key: 'orders', label: 'Orders', sortable: true, align: 'right', render: (r) => <span className="tabular">{r.orders}</span> },
    { key: 'totalSpent', label: 'Total Spend', sortable: true, align: 'right', render: (r) => <span className="tabular">{formatCurrency(r.totalSpent)}</span> },
    { key: 'avgOrderValue', label: 'Avg. Order Value', sortable: true, align: 'right', render: (r) => <span className="tabular">{formatCurrency(r.avgOrderValue)}</span> },
    { key: 'lastOrder', label: 'Last Order', sortable: true, render: (r) => formatDate(r.lastOrder) },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search customers…" className="max-w-sm w-full" />
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="input sm:w-44">
          <option value="All">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input sm:w-40">
          <option value="All">All segments</option>
          <option value="New">New</option>
          <option value="Regular">Regular</option>
          <option value="VIP">VIP</option>
        </select>
        <p className="text-xs text-muted tabular sm:ml-auto">{rows.length} customers</p>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        pageSize={12}
        loading={loading}
        getRowId={(r) => r.customerId}
        emptyTitle="No customers found"
        emptyDescription="Try a different search term, region or segment."
      />
    </div>
  );
}

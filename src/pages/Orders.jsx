import { useMemo, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { formatCurrency, formatDate } from '../utils/format';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import SearchInput from '../components/ui/SearchInput';
import FilterBar from '../components/filters/FilterBar';
import Modal from '../components/ui/Modal';
import { useSimulatedLoading } from '../utils/useLoading';

export default function Orders() {
  const { filters, filteredOrders } = useFilters();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const loading = useSimulatedLoading([filters]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return filteredOrders;
    return filteredOrders.filter((o) => `${o.id} ${o.customerName} ${o.productName} ${o.category} ${o.region} ${o.status}`.toLowerCase().includes(q));
  }, [filteredOrders, search]);

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true, render: (r) => <span className="tabular font-medium">{r.id}</span> },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'productName', label: 'Product', sortable: true, render: (r) => <span className="line-clamp-1 max-w-[14rem]">{r.productName}</span> },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'region', label: 'Region', sortable: true },
    { key: 'date', label: 'Date', sortable: true, render: (r) => formatDate(r.date) },
    { key: 'quantity', label: 'Qty', sortable: true, align: 'right', render: (r) => <span className="tabular">{r.quantity}</span> },
    { key: 'revenue', label: 'Revenue', sortable: true, align: 'right', render: (r) => <span className="tabular">{formatCurrency(r.revenue)}</span> },
    {
      key: 'profit',
      label: 'Profit',
      sortable: true,
      align: 'right',
      render: (r) => <span className={`tabular ${r.profit >= 0 ? 'text-good' : 'text-bad'}`}>{formatCurrency(r.profit)}</span>,
    },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge status={r.status} /> },
  ];

  const clickableColumns = columns.map((c) =>
    c.key === 'id'
      ? {
          ...c,
          render: (r) => (
            <button onClick={() => setSelectedOrder(r)} className="tabular font-medium text-brand-600 dark:text-brand-300 hover:underline">
              {r.id}
            </button>
          ),
        }
      : c
  );

  return (
    <div className="space-y-5">
      <FilterBar />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search orders, customers, products…" className="max-w-sm w-full" />
        <p className="text-xs text-muted tabular">{rows.length} orders</p>
      </div>

      <DataTable
        columns={clickableColumns}
        rows={rows}
        pageSize={12}
        loading={loading}
        emptyTitle="No orders found"
        emptyDescription="Try a different search term or adjust the filters above."
      />

      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={selectedOrder?.id ?? ''}>
        {selectedOrder && (
          <dl className="text-sm space-y-3">
            <Row label="Customer" value={selectedOrder.customerName} />
            <Row label="Product" value={selectedOrder.productName} />
            <Row label="Category" value={selectedOrder.category} />
            <Row label="Region" value={selectedOrder.region} />
            <Row label="Date" value={formatDate(selectedOrder.date)} />
            <Row label="Quantity" value={selectedOrder.quantity} />
            <Row label="Unit Price" value={formatCurrency(selectedOrder.unitPrice)} />
            <Row label="Revenue" value={formatCurrency(selectedOrder.revenue)} />
            <Row label="Profit" value={formatCurrency(selectedOrder.profit)} valueClass={selectedOrder.profit >= 0 ? 'text-good' : 'text-bad'} />
            <Row label="Status" value={<StatusBadge status={selectedOrder.status} />} />
          </dl>
        )}
      </Modal>
    </div>
  );
}

function Row({ label, value, valueClass = '' }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted text-xs uppercase tracking-wide">{label}</dt>
      <dd className={`font-medium tabular ${valueClass}`}>{value}</dd>
    </div>
  );
}

import { useState } from 'react';
import { Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { getMonthlyTrend, getCategoryPerformance, getRegionalPerformance, getProductPerformance, sumStats } from '../utils/calculations';
import { downloadCSV, formatCurrency } from '../utils/format';
import FilterBar from '../components/filters/FilterBar';

export default function Reports() {
  const { filteredOrders, products } = useFilters();
  const [lastExported, setLastExported] = useState(null);

  const stats = sumStats(filteredOrders);

  const reports = [
    {
      id: 'revenue',
      title: 'Revenue Report',
      description: 'Monthly revenue, cost and profit for the last 12 months.',
      count: 12,
      build: () => getMonthlyTrend(filteredOrders).map((m) => ({ Month: m.label, Revenue: m.revenue, Cost: m.cost, Profit: m.profit, Orders: m.orders })),
    },
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Every order currently matching the filters above.',
      count: filteredOrders.length,
      build: () =>
        filteredOrders.map((o) => ({
          OrderID: o.id,
          Customer: o.customerName,
          Product: o.productName,
          Category: o.category,
          Region: o.region,
          Date: o.date.slice(0, 10),
          Quantity: o.quantity,
          Revenue: o.revenue,
          Profit: o.profit,
          Status: o.status,
        })),
    },
    {
      id: 'products',
      title: 'Product Performance',
      description: 'Revenue, margin and units sold for every product.',
      count: products.length,
      build: () =>
        getProductPerformance(filteredOrders, products).map((p) => ({
          Product: p.name,
          Category: p.category,
          UnitsSold: p.unitsSold,
          Revenue: p.revenue,
          Profit: p.profit,
          Margin: `${p.margin}%`,
          Stock: p.stock,
        })),
    },
    {
      id: 'regional',
      title: 'Regional Performance',
      description: 'Revenue, profit and customer counts by region.',
      count: getRegionalPerformance(filteredOrders).length,
      build: () => getRegionalPerformance(filteredOrders).map((r) => ({ Region: r.region, Revenue: r.revenue, Profit: r.profit, Orders: r.orders, Customers: r.customers })),
    },
    {
      id: 'category',
      title: 'Category Performance',
      description: 'Revenue and profit broken down by product category.',
      count: getCategoryPerformance(filteredOrders).length,
      build: () => getCategoryPerformance(filteredOrders).map((c) => ({ Category: c.category, Revenue: c.revenue, Profit: c.profit, Orders: c.orders })),
    },
  ];

  const handleExport = (report) => {
    const rows = report.build();
    if (rows.length === 0) return;
    downloadCSV(`peakline-${report.id}-${new Date().toISOString().slice(0, 10)}.csv`, rows);
    setLastExported(report.title);
    setTimeout(() => setLastExported(null), 3000);
  };

  return (
    <div className="space-y-5">
      <FilterBar />

      <div className="card p-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <SummaryStat label="Filtered Revenue" value={formatCurrency(stats.totalRevenue)} />
        <SummaryStat label="Filtered Profit" value={formatCurrency(stats.totalProfit)} />
        <SummaryStat label="Filtered Orders" value={stats.totalOrders} />
      </div>

      {lastExported && (
        <div className="flex items-center gap-2 text-sm text-good bg-good/10 rounded-md px-3 py-2 animate-fade-in" role="status">
          <CheckCircle2 size={16} />
          {lastExported} exported as CSV.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div key={r.id} className="card p-5 flex flex-col">
            <span className="grid place-items-center h-9 w-9 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300 mb-3">
              <FileSpreadsheet size={18} />
            </span>
            <h3 className="text-sm font-semibold">{r.title}</h3>
            <p className="text-xs text-muted mt-1 flex-1">{r.description}</p>
            <p className="text-[11px] text-muted mt-3 tabular">{r.count} rows in current filter</p>
            <button onClick={() => handleExport(r)} disabled={r.count === 0} className="btn-primary mt-3 justify-center">
              <Download size={14} />
              Export CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryStat({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted uppercase tracking-wide">{label}</p>
      <p className="tabular text-lg font-semibold">{value}</p>
    </div>
  );
}

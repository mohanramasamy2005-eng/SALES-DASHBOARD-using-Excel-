import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '../context/FilterContext';
import { useTheme } from '../context/ThemeContext';
import {
  getKpiComparisons,
  getMonthlyTrend,
  getCategoryPerformance,
  getRegionalPerformance,
  getProductPerformance,
  getCustomerPerformance,
} from '../utils/calculations';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format';
import ChartCard from '../components/ui/ChartCard';
import FilterBar from '../components/filters/FilterBar';
import DataTable from '../components/ui/DataTable';
import { ChartSkeleton } from '../components/ui/Skeleton';
import { useSimulatedLoading } from '../utils/useLoading';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Analytics() {
  const { filters, filteredOrders, allOrders, products, customers } = useFilters();
  const { theme } = useTheme();
  const loading = useSimulatedLoading([filters]);
  const isTextDark = theme === 'dark';
  const gridColor = isTextDark ? '#232B3B' : '#E4E7EC';
  const axisColor = isTextDark ? '#8792A6' : '#5B6472';
  const tooltipStyle = { background: isTextDark ? '#121826' : '#fff', border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 };

  const { growth, comparisonLabel } = getKpiComparisons(allOrders, filters);
  const monthlyTrend = getMonthlyTrend(filteredOrders);
  const categoryPerf = getCategoryPerformance(filteredOrders);
  const regionalPerf = getRegionalPerformance(filteredOrders);
  const productPerf = getProductPerformance(filteredOrders, products).sort((a, b) => b.revenue - a.revenue);
  const customerPerf = getCustomerPerformance(filteredOrders, customers).sort((a, b) => b.totalSpent - a.totalSpent);

  const growthCards = [
    { label: 'Revenue Growth', value: growth.totalRevenue },
    { label: 'Profit Growth', value: growth.totalProfit },
    { label: 'Order Volume Growth', value: growth.totalOrders },
    { label: 'Customer Growth', value: growth.uniqueCustomers },
  ];

  const productColumns = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'unitsSold', label: 'Units Sold', sortable: true, align: 'right', render: (r) => <span className="tabular">{formatNumber(r.unitsSold)}</span> },
    { key: 'revenue', label: 'Revenue', sortable: true, align: 'right', render: (r) => <span className="tabular">{formatCurrency(r.revenue)}</span> },
    { key: 'margin', label: 'Margin', sortable: true, align: 'right', render: (r) => <span className="tabular">{formatPercent(r.margin)}</span> },
  ];

  const customerColumns = [
    { key: 'name', label: 'Customer', sortable: true },
    { key: 'region', label: 'Region', sortable: true },
    { key: 'orders', label: 'Orders', sortable: true, align: 'right', render: (r) => <span className="tabular">{r.orders}</span> },
    { key: 'totalSpent', label: 'Total Spend', sortable: true, align: 'right', render: (r) => <span className="tabular">{formatCurrency(r.totalSpent)}</span> },
  ];

  return (
    <div className="space-y-5">
      <FilterBar />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {growthCards.map((g) => (
          <div key={g.label} className="card p-4">
            <p className="text-xs font-medium text-muted uppercase tracking-wide">{g.label}</p>
            <p className={`mt-2 tabular text-xl font-semibold flex items-center gap-1 ${g.value >= 0 ? 'text-good' : 'text-bad'}`}>
              {g.value >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
              {formatPercent(Math.abs(g.value))}
            </p>
            <p className="text-[11px] text-muted mt-0.5 capitalize">{comparisonLabel}</p>
          </div>
        ))}
      </section>

      {loading ? (
        <ChartSkeleton />
      ) : (
        <ChartCard title="Revenue & Profit Trend" subtitle="12-month view">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend} margin={{ left: -12, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={(v) => formatNumber(v, { compact: true })} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs capitalize">{v}</span>} />
              <Line type="monotone" dataKey="revenue" stroke="#2E5CF0" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="profit" stroke="#1FA97A" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <ChartCard title="Category Performance" subtitle="Revenue and profit by category">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryPerf} margin={{ left: -12, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={(v) => formatNumber(v, { compact: true })} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs capitalize">{v}</span>} />
                <Bar dataKey="revenue" fill="#2E5CF0" radius={[3, 3, 0, 0]} />
                <Bar dataKey="profit" fill="#1FA97A" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {loading ? (
          <ChartSkeleton />
        ) : (
          <ChartCard title="Regional Performance" subtitle="Revenue, profit and customers by region">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={regionalPerf} margin={{ left: -12, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={(v) => formatNumber(v, { compact: true })} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs capitalize">{v}</span>} />
                <Bar dataKey="revenue" fill="#4C7FFF" radius={[3, 3, 0, 0]} />
                <Bar dataKey="profit" fill="#F3B23A" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </section>

      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold">Product Performance</h3>
          <p className="text-xs text-muted mt-0.5">Every product in the filtered range, ranked by revenue</p>
        </div>
        <DataTable columns={productColumns} rows={productPerf} loading={loading} pageSize={8} getRowId={(r) => r.productId} emptyTitle="No product activity" />
      </section>

      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold">Customer Performance</h3>
          <p className="text-xs text-muted mt-0.5">Every customer in the filtered range, ranked by spend</p>
        </div>
        <DataTable columns={customerColumns} rows={customerPerf} loading={loading} pageSize={8} getRowId={(r) => r.customerId} emptyTitle="No customer activity" />
      </section>
    </div>
  );
}

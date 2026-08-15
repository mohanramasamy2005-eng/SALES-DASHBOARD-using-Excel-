import { DollarSign, ShoppingCart, Users, Receipt, TrendingUp, Percent, PiggyBank } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '../context/FilterContext';
import { useTheme } from '../context/ThemeContext';
import { getKpiComparisons, getMonthlyTrend, getCategoryPerformance, getRegionalPerformance, getTopProducts, getCustomerSegmentation } from '../utils/calculations';
import { formatCurrency, formatNumber, formatPercent } from '../utils/format';
import KpiCard from '../components/ui/KpiCard';
import ChartCard from '../components/ui/ChartCard';
import FilterBar from '../components/filters/FilterBar';
import EmptyState from '../components/ui/EmptyState';
import { KpiSkeleton, ChartSkeleton } from '../components/ui/Skeleton';
import { useSimulatedLoading } from '../utils/useLoading';

const PIE_COLORS = ['#2E5CF0', '#F3B23A', '#1FA97A', '#E4574C', '#7FA9FF'];

export default function Dashboard() {
  const { filters, filteredOrders, allOrders, customers } = useFilters();
  const loading = useSimulatedLoading([filters]);

  const { current, growth, comparisonLabel } = getKpiComparisons(allOrders, filters);
  const monthlyTrend = getMonthlyTrend(filteredOrders);
  const categoryPerf = getCategoryPerformance(filteredOrders).slice(0, 6);
  const regionalPerf = getRegionalPerformance(filteredOrders);
  const topProducts = getTopProducts(filteredOrders, 6);
  const segmentation = getCustomerSegmentation(filteredOrders, customers);

  const { theme } = useTheme();
  const isTextDark = theme === 'dark';
  const gridColor = isTextDark ? '#232B3B' : '#E4E7EC';
  const axisColor = isTextDark ? '#8792A6' : '#5B6472';

  const kpis = [
    { label: 'Total Revenue', value: formatCurrency(current.totalRevenue, { compact: true }), delta: growth.totalRevenue, icon: DollarSign },
    { label: 'Total Orders', value: formatNumber(current.totalOrders), delta: growth.totalOrders, icon: ShoppingCart },
    { label: 'Total Customers', value: formatNumber(current.uniqueCustomers), delta: growth.uniqueCustomers, icon: Users },
    { label: 'Avg. Order Value', value: formatCurrency(current.avgOrderValue), delta: growth.avgOrderValue, icon: Receipt },
    { label: 'Total Profit', value: formatCurrency(current.totalProfit, { compact: true }), delta: growth.totalProfit, icon: PiggyBank, accent: 'amber' },
    { label: 'Sales Growth', value: formatPercent(growth.totalRevenue, { signed: true }), delta: growth.totalRevenue, icon: TrendingUp },
    { label: 'Conversion Rate', value: formatPercent(current.conversionRate), delta: growth.conversionRate, deltaIsPoints: true, icon: Percent },
  ].map((k) => ({ ...k, comparisonLabel }));

  if (filteredOrders.length === 0 && !loading) {
    return (
      <div className="space-y-5">
        <FilterBar />
        <div className="card">
          <EmptyState
            title="No orders match these filters"
            description="Try widening the date range or clearing the region, category or product filters."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FilterBar />

      <section aria-label="Key performance indicators" className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {loading ? Array.from({ length: 7 }).map((_, i) => <KpiSkeleton key={i} />) : kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <ChartCard title="Revenue Trend" subtitle="Monthly revenue over the last 12 months" className="xl:col-span-2">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyTrend} margin={{ left: -12, right: 8 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E5CF0" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2E5CF0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v, { compact: true })} />
                <Tooltip
                  contentStyle={{ background: isTextDark ? '#121826' : '#fff', border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2E5CF0" strokeWidth={2} fill="url(#revGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {loading ? (
          <ChartSkeleton />
        ) : (
          <ChartCard title="Customer Segmentation" subtitle="Customers grouped by lifetime spend">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={segmentation} dataKey="customers" nameKey="segment" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {segmentation.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={24} iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs">{v}</span>} />
                <Tooltip
                  contentStyle={{ background: isTextDark ? '#121826' : '#fff', border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }}
                  formatter={(value, name, props) => [`${value} customers · ${formatCurrency(props.payload.revenue, { compact: true })}`, props.payload.segment]}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <ChartCard title="Category Performance" subtitle="Revenue by product category">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryPerf} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: axisColor }} tickFormatter={(v) => formatNumber(v, { compact: true })} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: axisColor }} width={110} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: isTextDark ? '#121826' : '#fff', border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#2E5CF0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {loading ? (
          <ChartSkeleton />
        ) : (
          <ChartCard title="Regional Performance" subtitle="Revenue by region">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={regionalPerf} margin={{ left: -12, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={(v) => formatNumber(v, { compact: true })} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: isTextDark ? '#121826' : '#fff', border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#F3B23A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {loading ? (
          <ChartSkeleton />
        ) : (
          <ChartCard title="Top Products" subtitle="Ranked by revenue">
            <ul className="space-y-3">
              {topProducts.map((p, i) => (
                <li key={p.productId} className="flex items-center gap-3">
                  <span className="tabular text-xs text-muted w-4 shrink-0">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <div className="h-1.5 rounded-full bg-canvas dark:bg-white/5 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${Math.max(6, (p.revenue / topProducts[0].revenue) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="tabular text-xs font-medium shrink-0">{formatCurrency(p.revenue, { compact: true })}</span>
                </li>
              ))}
            </ul>
          </ChartCard>
        )}
      </section>

      {!loading && (
        <ChartCard title="Profit Analysis" subtitle="Revenue vs. cost vs. profit, month by month">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyTrend} margin={{ left: -12, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} tickFormatter={(v) => formatNumber(v, { compact: true })} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: isTextDark ? '#121826' : '#fff', border: `1px solid ${gridColor}`, borderRadius: 8, fontSize: 12 }}
                formatter={(value, name) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs capitalize">{v}</span>} />
              <Bar dataKey="revenue" fill="#B3CDFF" radius={[3, 3, 0, 0]} />
              <Bar dataKey="cost" fill="#F3B23A" radius={[3, 3, 0, 0]} />
              <Bar dataKey="profit" fill="#1FA97A" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}

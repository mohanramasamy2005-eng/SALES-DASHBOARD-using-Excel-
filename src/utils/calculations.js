// All aggregation logic lives here so every page (Dashboard, Analytics,
// Products, Customers, Reports) derives numbers from the same source of
// truth instead of recomputing or hardcoding values independently.

const isRevenueOrder = (o) => o.status !== 'Cancelled';

export function filterOrders(orders, filters) {
  const { startDate, endDate, region, category, product, search } = filters;
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  if (end) end.setHours(23, 59, 59, 999);
  const q = (search || '').trim().toLowerCase();

  return orders.filter((o) => {
    const d = new Date(o.date);
    if (start && d < start) return false;
    if (end && d > end) return false;
    if (region && region !== 'All' && o.region !== region) return false;
    if (category && category !== 'All' && o.category !== category) return false;
    if (product && product !== 'All' && o.productId !== product) return false;
    if (q) {
      const hay = `${o.id} ${o.customerName} ${o.productName} ${o.category} ${o.region} ${o.status}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sumStats(orders) {
  const revenueOrders = orders.filter(isRevenueOrder);
  const totalRevenue = revenueOrders.reduce((s, o) => s + o.revenue, 0);
  const totalProfit = orders.reduce((s, o) => s + o.profit, 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map((o) => o.customerId)).size;
  const avgOrderValue = revenueOrders.length ? totalRevenue / revenueOrders.length : 0;
  const cancelledOrReturned = orders.filter((o) => o.status === 'Cancelled' || o.status === 'Returned').length;
  const conversionRate = totalOrders ? ((totalOrders - cancelledOrReturned) / totalOrders) * 100 : 0;
  return { totalRevenue, totalProfit, totalOrders, uniqueCustomers, avgOrderValue, conversionRate };
}

function pctChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

// Compares the filtered period against an equal-length immediately preceding
// period (using the full unfiltered order set clipped to the same
// region/category/product facets) so every KPI's trend arrow means the same thing.
export function getKpiComparisons(allOrders, filters) {
  const current = filterOrders(allOrders, filters);
  const currentStats = sumStats(current);

  let previousStats = null;
  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    const spanMs = end - start;
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - spanMs);
    const prevFilters = { ...filters, startDate: prevStart.toISOString(), endDate: prevEnd.toISOString() };
    previousStats = sumStats(filterOrders(allOrders, prevFilters));
    return {
      current: currentStats,
      previous: previousStats,
      comparisonLabel: 'vs. previous period',
      growth: {
        totalRevenue: pctChange(currentStats.totalRevenue, previousStats.totalRevenue),
        totalProfit: pctChange(currentStats.totalProfit, previousStats.totalProfit),
        totalOrders: pctChange(currentStats.totalOrders, previousStats.totalOrders),
        uniqueCustomers: pctChange(currentStats.uniqueCustomers, previousStats.uniqueCustomers),
        avgOrderValue: pctChange(currentStats.avgOrderValue, previousStats.avgOrderValue),
        conversionRate: currentStats.conversionRate - previousStats.conversionRate,
      },
    };
  } else {
    // Default: last 30 days vs prior 30 days, ignoring date facet but respecting other facets.
    const now = new Date();
    const last30Start = new Date(now);
    last30Start.setDate(now.getDate() - 30);
    const prev30Start = new Date(now);
    prev30Start.setDate(now.getDate() - 60);
    const prev30End = new Date(last30Start.getTime() - 1);

    const currentWindow = filterOrders(allOrders, { ...filters, startDate: last30Start.toISOString(), endDate: now.toISOString() });
    const prevWindow = filterOrders(allOrders, { ...filters, startDate: prev30Start.toISOString(), endDate: prev30End.toISOString() });
    previousStats = sumStats(prevWindow);
    // Use the full (unbounded by 30-day) filtered set for headline numbers,
    // but the 30-day windows purely to compute a trend percentage.
    return {
      current: currentStats,
      previous: previousStats,
      comparisonLabel: 'vs. previous 30 days',
      growth: {
        totalRevenue: pctChange(sumStats(currentWindow).totalRevenue, previousStats.totalRevenue),
        totalProfit: pctChange(sumStats(currentWindow).totalProfit, previousStats.totalProfit),
        totalOrders: pctChange(sumStats(currentWindow).totalOrders, previousStats.totalOrders),
        uniqueCustomers: pctChange(sumStats(currentWindow).uniqueCustomers, previousStats.uniqueCustomers),
        avgOrderValue: pctChange(sumStats(currentWindow).avgOrderValue, previousStats.avgOrderValue),
        conversionRate: sumStats(currentWindow).conversionRate - previousStats.conversionRate,
      },
    };
  }
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getMonthlyTrend(orders, monthsBack = 12, now = new Date()) {
  const buckets = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: `${MONTH_LABELS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`, revenue: 0, profit: 0, cost: 0, orders: 0 });
  }
  const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));
  for (const o of orders) {
    const d = new Date(o.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = byKey[key];
    if (!bucket) continue;
    if (isRevenueOrder(o)) bucket.revenue += o.revenue;
    bucket.cost += o.cost;
    bucket.profit += o.profit;
    bucket.orders += 1;
  }
  return buckets.map((b) => ({ ...b, revenue: round2(b.revenue), profit: round2(b.profit), cost: round2(b.cost) }));
}

export function getCategoryPerformance(orders) {
  const map = {};
  for (const o of orders) {
    if (!isRevenueOrder(o)) continue;
    map[o.category] = map[o.category] || { category: o.category, revenue: 0, profit: 0, orders: 0 };
    map[o.category].revenue += o.revenue;
    map[o.category].profit += o.profit;
    map[o.category].orders += 1;
  }
  return Object.values(map)
    .map((c) => ({ ...c, revenue: round2(c.revenue), profit: round2(c.profit) }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getRegionalPerformance(orders) {
  const map = {};
  for (const o of orders) {
    if (!isRevenueOrder(o)) continue;
    map[o.region] = map[o.region] || { region: o.region, revenue: 0, profit: 0, orders: 0, customers: new Set() };
    map[o.region].revenue += o.revenue;
    map[o.region].profit += o.profit;
    map[o.region].orders += 1;
    map[o.region].customers.add(o.customerId);
  }
  return Object.values(map)
    .map((r) => ({ region: r.region, revenue: round2(r.revenue), profit: round2(r.profit), orders: r.orders, customers: r.customers.size }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getTopProducts(orders, limit = 8) {
  const map = {};
  for (const o of orders) {
    if (!isRevenueOrder(o)) continue;
    map[o.productId] = map[o.productId] || { productId: o.productId, name: o.productName, category: o.category, revenue: 0, profit: 0, unitsSold: 0, orders: 0 };
    map[o.productId].revenue += o.revenue;
    map[o.productId].profit += o.profit;
    map[o.productId].unitsSold += o.quantity;
    map[o.productId].orders += 1;
  }
  return Object.values(map)
    .map((p) => ({ ...p, revenue: round2(p.revenue), profit: round2(p.profit) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function getProductPerformance(orders, products) {
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const map = {};
  for (const o of orders) {
    map[o.productId] = map[o.productId] || { productId: o.productId, name: o.productName, category: o.category, revenue: 0, profit: 0, unitsSold: 0, orders: 0, returns: 0 };
    if (isRevenueOrder(o)) {
      map[o.productId].revenue += o.revenue;
      map[o.productId].unitsSold += o.quantity;
    }
    map[o.productId].profit += o.profit;
    map[o.productId].orders += 1;
    if (o.status === 'Returned') map[o.productId].returns += 1;
  }
  return Object.values(map).map((p) => {
    const meta = byId[p.productId];
    return {
      ...p,
      revenue: round2(p.revenue),
      profit: round2(p.profit),
      price: meta?.price ?? 0,
      stock: meta?.stock ?? 0,
      margin: p.revenue ? round2((p.profit / p.revenue) * 100) : 0,
    };
  });
}

export function getCustomerPerformance(orders, customers) {
  const byId = Object.fromEntries(customers.map((c) => [c.id, c]));
  const map = {};
  for (const o of orders) {
    map[o.customerId] = map[o.customerId] || { customerId: o.customerId, name: o.customerName, region: o.region, totalSpent: 0, orders: 0, lastOrder: o.date };
    if (isRevenueOrder(o)) map[o.customerId].totalSpent += o.revenue;
    map[o.customerId].orders += 1;
    if (new Date(o.date) > new Date(map[o.customerId].lastOrder)) map[o.customerId].lastOrder = o.date;
  }
  return Object.values(map).map((c) => {
    const meta = byId[c.customerId];
    const avgOrderValue = c.orders ? c.totalSpent / c.orders : 0;
    let status = 'New';
    if (c.totalSpent > 15000) status = 'VIP';
    else if (c.orders > 3) status = 'Regular';
    return {
      ...c,
      totalSpent: round2(c.totalSpent),
      avgOrderValue: round2(avgOrderValue),
      email: meta?.email ?? '',
      joined: meta?.joined ?? null,
      status,
    };
  });
}

export function getCustomerSegmentation(orders, customers) {
  const perf = getCustomerPerformance(orders, customers);
  const segments = { New: 0, Regular: 0, VIP: 0 };
  const revenueBySegment = { New: 0, Regular: 0, VIP: 0 };
  for (const c of perf) {
    segments[c.status] = (segments[c.status] || 0) + 1;
    revenueBySegment[c.status] = (revenueBySegment[c.status] || 0) + c.totalSpent;
  }
  return Object.keys(segments).map((key) => ({ segment: key, customers: segments[key], revenue: round2(revenueBySegment[key]) }));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

export function isoDateNDaysAgo(n, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

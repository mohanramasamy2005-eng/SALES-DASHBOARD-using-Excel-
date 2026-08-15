import { createContext, useContext, useMemo, useState } from 'react';
import { DATASET, CATEGORIES, REGIONS } from '../data/generateData';
import { filterOrders } from '../utils/calculations';

const FilterContext = createContext(null);

const DEFAULT_FILTERS = {
  startDate: '',
  endDate: '',
  region: 'All',
  category: 'All',
  product: 'All',
  search: '',
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filteredOrders = useMemo(() => filterOrders(DATASET.orders, filters), [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.startDate || filters.endDate) count++;
    if (filters.region !== 'All') count++;
    if (filters.category !== 'All') count++;
    if (filters.product !== 'All') count++;
    return count;
  }, [filters]);

  const value = {
    filters,
    updateFilter,
    resetFilters,
    filteredOrders,
    activeFilterCount,
    allOrders: DATASET.orders,
    products: DATASET.products,
    customers: DATASET.customers,
    categories: CATEGORIES,
    regions: REGIONS,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}

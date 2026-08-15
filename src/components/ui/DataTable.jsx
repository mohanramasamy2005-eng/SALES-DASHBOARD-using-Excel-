import { useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import { TableSkeleton } from './Skeleton';

/**
 * columns: [{ key, label, sortable, align, render(row) }]
 */
export default function DataTable({ columns, rows, pageSize = 10, loading = false, emptyTitle = 'No results', emptyDescription, getRowId }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('desc');
    }
    setPage(1);
  };

  if (loading) return <TableSkeleton />;

  if (rows.length === 0) {
    return (
      <div className="card">
        <EmptyState variant="no-results" title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border dark:border-border-dark">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`text-xs font-medium text-muted uppercase tracking-wide px-4 py-3 whitespace-nowrap ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  } ${col.sortable ? 'cursor-pointer select-none hover:text-ink dark:hover:text-ink-dark' : ''}`}
                  onClick={() => handleSort(col)}
                >
                  <span className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'flex-row-reverse' : ''}`}>
                    {col.label}
                    {col.sortable &&
                      (sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )
                      ) : (
                        <ChevronsUpDown size={12} className="opacity-40" />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr
                key={getRowId ? getRowId(row) : row.id}
                className="border-b border-border/60 dark:border-border-dark/60 last:border-0 hover:bg-canvas dark:hover:bg-white/[0.03] transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 whitespace-nowrap ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 pb-4">
        <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} totalItems={sortedRows.length} pageSize={pageSize} />
      </div>
    </div>
  );
}

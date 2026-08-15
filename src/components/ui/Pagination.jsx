import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }) {
  if (totalPages <= 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pageNumbers = getPageWindow(page, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-2 border-t border-border dark:border-border-dark">
      <p className="text-xs text-muted tabular">
        Showing {totalItems === 0 ? 0 : start}–{end} of {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <button
          className="btn-secondary !px-2"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pageNumbers.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-xs text-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`h-8 min-w-[2rem] px-2 rounded-md text-xs font-medium tabular transition-colors ${
                p === page ? 'bg-brand-500 text-white' : 'text-muted hover:bg-canvas dark:hover:bg-white/5'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          className="btn-secondary !px-2"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function getPageWindow(current, total) {
  const delta = 1;
  const range = [];
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) range.push(i);
  if (range[0] > 1) {
    range.unshift(1);
    if (range[1] > 2) range.splice(1, 0, '…');
  }
  if (range[range.length - 1] < total) {
    if (range[range.length - 1] < total - 1) range.push('…');
    range.push(total);
  }
  return range;
}

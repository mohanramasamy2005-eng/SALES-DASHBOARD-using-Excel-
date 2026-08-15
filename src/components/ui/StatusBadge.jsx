const STATUS_STYLES = {
  Delivered: 'bg-good/10 text-good',
  Shipped: 'bg-brand-500/10 text-brand-600 dark:text-brand-300',
  Processing: 'bg-amber-400/15 text-amber-500 dark:text-amber-400',
  Cancelled: 'bg-bad/10 text-bad',
  Returned: 'bg-muted/15 text-muted',
  VIP: 'bg-amber-400/15 text-amber-500 dark:text-amber-400',
  Regular: 'bg-brand-500/10 text-brand-600 dark:text-brand-300',
  New: 'bg-good/10 text-good',
  'In Stock': 'bg-good/10 text-good',
  'Low Stock': 'bg-amber-400/15 text-amber-500 dark:text-amber-400',
  'Out of Stock': 'bg-bad/10 text-bad',
};

const DOT_STYLES = {
  Delivered: 'bg-good',
  Shipped: 'bg-brand-500',
  Processing: 'bg-amber-500',
  Cancelled: 'bg-bad',
  Returned: 'bg-muted',
  VIP: 'bg-amber-500',
  Regular: 'bg-brand-500',
  New: 'bg-good',
  'In Stock': 'bg-good',
  'Low Stock': 'bg-amber-500',
  'Out of Stock': 'bg-bad',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-muted/15 text-muted';
  const dot = DOT_STYLES[status] ?? 'bg-muted';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}

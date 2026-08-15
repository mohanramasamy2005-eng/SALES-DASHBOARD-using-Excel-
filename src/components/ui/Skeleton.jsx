export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-border/60 dark:bg-border-dark/60 rounded-md ${className}`} />;
}

export function KpiSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function ChartSkeleton({ height = 280 }) {
  return (
    <div className="card p-5">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton style={{ height }} className="w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

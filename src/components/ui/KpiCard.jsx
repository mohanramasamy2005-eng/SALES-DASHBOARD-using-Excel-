import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KpiCard({ label, value, delta, deltaIsPoints = false, icon: Icon, accent = 'brand', comparisonLabel = 'vs previous 30 days' }) {
  const isPositive = delta >= 0;
  const deltaLabel = deltaIsPoints ? `${isPositive ? '+' : ''}${delta.toFixed(1)} pts` : `${isPositive ? '+' : ''}${delta.toFixed(1)}%`;

  const accentClasses = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300',
    amber: 'bg-amber-400/15 text-amber-500 dark:text-amber-400',
  };

  return (
    <div className="card p-4 sm:p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-muted uppercase tracking-wide">{label}</span>
        {Icon && (
          <span className={`grid place-items-center h-8 w-8 rounded-lg shrink-0 ${accentClasses[accent] ?? accentClasses.brand}`}>
            <Icon size={16} strokeWidth={2} />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <span className="tabular text-2xl font-semibold tracking-tight">{value}</span>
        <span
          className={`flex items-center gap-0.5 text-xs font-medium tabular shrink-0 pb-0.5 ${
            isPositive ? 'text-good' : 'text-bad'
          }`}
          aria-label={`${isPositive ? 'Up' : 'Down'} ${Math.abs(delta).toFixed(1)}${deltaIsPoints ? ' points' : ' percent'} vs previous period`}
        >
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {deltaLabel}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-muted">{comparisonLabel}</p>
    </div>
  );
}

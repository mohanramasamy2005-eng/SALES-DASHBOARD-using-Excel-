export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`card p-4 sm:p-5 animate-fade-in ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">{title}</h3>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

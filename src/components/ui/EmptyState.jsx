import { Inbox, SearchX } from 'lucide-react';

export default function EmptyState({ variant = 'no-data', title, description, action }) {
  const Icon = variant === 'no-results' ? SearchX : Inbox;
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-4 animate-fade-in">
      <span className="grid place-items-center h-12 w-12 rounded-full bg-canvas dark:bg-white/5 text-muted mb-3">
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <p className="text-sm font-medium text-ink dark:text-ink-dark">{title}</p>
      {description && <p className="text-xs text-muted mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

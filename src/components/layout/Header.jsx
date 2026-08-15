import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const TITLES = {
  '/': { title: 'Dashboard', subtitle: "Here's how the business is performing." },
  '/analytics': { title: 'Sales Analytics', subtitle: 'Growth, trends and performance breakdowns.' },
  '/products': { title: 'Products', subtitle: 'Catalog performance and stock levels.' },
  '/customers': { title: 'Customers', subtitle: 'Spending, segments and activity.' },
  '/orders': { title: 'Orders', subtitle: 'Every transaction, searchable and sortable.' },
  '/reports': { title: 'Reports', subtitle: 'Export summaries as CSV.' },
  '/settings': { title: 'Settings', subtitle: 'Preferences for this dashboard.' },
};

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const meta = TITLES[pathname] ?? { title: 'Peakline', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 sm:px-6 bg-canvas/80 dark:bg-canvas-dark/80 backdrop-blur border-b border-border dark:border-border-dark">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-muted hover:text-ink dark:hover:text-ink-dark"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <div className="min-w-0">
        <h1 className="text-[15px] font-semibold leading-tight truncate">{meta.title}</h1>
        <p className="text-xs text-muted leading-tight hidden sm:block truncate">{meta.subtitle}</p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="grid place-items-center h-9 w-9 rounded-md border border-border dark:border-border-dark text-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface dark:hover:bg-surface-dark transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}

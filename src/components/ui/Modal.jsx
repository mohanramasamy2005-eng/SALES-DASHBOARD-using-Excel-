import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className="relative card w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 shadow-pop animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">{title}</h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close dialog"
            className="grid place-items-center h-7 w-7 rounded-md text-muted hover:bg-canvas dark:hover:bg-white/5"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

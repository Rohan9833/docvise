import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cx } from './ui.jsx';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog: focus moves inside on open, Tab is trapped, Escape and the backdrop close it,
 * and focus returns to the element that opened it.
 */
export default function Modal({ title, description, onClose, children, size = 'md', isTop = true }) {
  const panel = useRef(null);
  const top = useRef(isTop);
  top.current = isTop;
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const opener = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const el = panel.current;
    const items = () => [...el.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null || n === document.activeElement);
    (el.querySelector('[data-autofocus]') || items()[0] || el).focus();

    const onKey = (e) => {
      if (!top.current) return;
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const f = items();
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0]; const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (opener && typeof opener.focus === 'function') opener.focus();
    };
  }, [onClose]);

  const width = size === 'lg' ? 'sm:max-w-5xl' : size === 'sm' ? 'sm:max-w-lg' : 'sm:max-w-2xl';

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <motion.div className="absolute inset-0 bg-navy-950/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cx('relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl outline-none sm:rounded-3xl', width)}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-3 sm:px-6 sm:py-3">
          <div>
            <h2 id={titleId} className="text-[20px] font-bold sm:text-[22px]">{title}</h2>
            {description && <p id={descId} className="mt-0.5 text-[14px] text-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink hover:bg-brand-50" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">{children}</div>
      </motion.div>
    </div>,
    document.body,
  );
}

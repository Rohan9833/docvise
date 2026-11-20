import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');
export { cx };

/** Official DocVise logo (supplied artwork – never recreated as text). */
export function Logo({ className = 'h-10 w-auto', eager = false }) {
  return (
    <picture>
      <source srcSet="/assets/docvise-logo.webp" type="image/webp" />
      <img
        src="/assets/docvise-logo.png"
        alt="DocVise – Doctor's Advice. Made Visual. Made Simple."
        width="800"
        height="233"
        className={className}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}

const BTN = {
  primary:
    'bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-[0_10px_24px_-10px_rgb(76_29_149/0.7)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgb(76_29_149/0.8)] active:translate-y-0',
  outline: 'border-2 border-brand-500/70 bg-white text-brand-700 hover:bg-brand-50 hover:border-brand-500',
};

/** Button – renders <a> when href is given. */
export function Button({ variant = 'primary', size = 'md', icon: Icon, trailing = ArrowRight, href, className, children, ...rest }) {
  const Trailing = trailing;
  const sizes = size === 'lg' ? 'h-14 px-7 text-[17px]' : size === 'sm' ? 'h-10 px-4 text-sm' : 'h-12 px-6 text-[15px]';
  const cls = cx(
    'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-60',
    sizes, BTN[variant], className,
  );
  const inner = (
    <>
      {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
      <span>{children}</span>
      {Trailing && <Trailing className="h-[18px] w-[18px]" aria-hidden="true" />}
    </>
  );
  return href ? <a href={href} className={cls} {...rest}>{inner}</a> : <button type="button" className={cls} {...rest}>{inner}</button>;
}

/** Section number + eyebrow + headline + supporting copy, as in the approved design. */
export function SectionHeader({ num, eyebrow, title, sub, id, className, titleClass }) {
  return (
    <div className={cx('flex gap-5', className)}>
      {num && (
        <span aria-hidden="true" className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 font-display text-[17px] font-bold text-navy md:flex">
          {num}
        </span>
      )}
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className={cx('mt-2 text-[28px] leading-[1.15] font-bold sm:text-[32px] lg:text-[34px]', titleClass)}>{title}</h2>
        {sub && <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink/80 sm:text-[17px]">{sub}</p>}
      </div>
    </div>
  );
}

/** Subtle fade-up on scroll; disabled for reduced-motion users. */
export function Reveal({ children, className, delay = 0, as = 'div' }) {
  const reduce = useReducedMotion();
  const M = motion[as] || motion.div;
  if (reduce) return <M className={className}>{children}</M>;
  return (
    <M className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
      {children}
    </M>
  );
}

/** WhatsApp glyph (brand icons are not part of lucide). */
export function WhatsAppIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#25D366" />
      <path d="M8.2 24.1l1.2-4.1a8.1 8.1 0 1 1 3 2.9z" fill="#fff" />
      <path d="M13.3 11.6c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5a6.6 6.6 0 0 0 2.6 2.4c.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.3.5v.4c0 .4-.3.9-.8 1.1-.6.3-1.6.3-3-.4a9 9 0 0 1-3.6-3.4c-.8-1.4-.8-2.5-.6-3.2z" fill="#25D366" />
    </svg>
  );
}

/** PDF document glyph. */
export function PdfIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M7 3h13l6 6v18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#fff" stroke="#E53935" strokeWidth="1.8" />
      <path d="M20 3v6h6" fill="none" stroke="#E53935" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="4" y="15" width="18" height="9" rx="2" fill="#E53935" />
      <text x="13" y="22" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="6.6" fontWeight="800" fill="#fff">PDF</text>
    </svg>
  );
}

/** Lavender rounded tile with a patient illustration. */
export function Illustration({ name, alt, className = 'h-20 w-24', eager = false }) {
  return (
    <img src={`/assets/${name}.svg`} alt={alt} className={cx('object-contain', className)} loading={eager ? 'eager' : 'lazy'} decoding="async" width="160" height="120" />
  );
}

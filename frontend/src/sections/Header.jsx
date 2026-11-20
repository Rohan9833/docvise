import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo, Button, cx } from '../components/ui.jsx';
import { NAV } from '../data/site.js';
import { useModal } from '../hooks/useModal.js';
import { useActiveSection } from '../hooks/useActiveSection.js';

const IDS = NAV.map((n) => n.id);

export default function Header() {
  const { open } = useModal();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(IDS);
  const toggle = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') { setMenu(false); toggle.current?.focus(); } };
    const onResize = () => { if (window.innerWidth >= 1280) setMenu(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [menu]);

  return (
    <header className={cx('sticky top-0 z-50 border-b bg-white/90 backdrop-blur transition-shadow', scrolled ? 'border-line shadow-[0_6px_20px_-12px_rgb(76_29_149/0.25)]' : 'border-transparent')}>
      <div className="container-site flex h-[72px] items-center justify-between gap-6 lg:h-[78px]">
        <a href="#top" className="shrink-0" aria-label="DocVise home">
          <Logo eager className="h-11 w-auto sm:h-12" />
        </a>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-8 2xl:gap-9">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} aria-current={active === n.id ? 'true' : undefined}
                  className={cx('relative py-2 text-[14px] font-medium transition-colors hover:text-brand-600', active === n.id ? 'text-brand-600' : 'text-ink/80')}>
                  {n.label}
                  {active === n.id && <span aria-hidden="true" className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-orange" />}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><Button size="sm" className="h-11 px-5" onClick={() => open('enquiry')}>Request a Demo</Button></div>
          <button ref={toggle} type="button" className="flex h-11 w-11 items-center justify-center rounded-xl text-navy hover:bg-brand-50 xl:hidden"
            aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu((m) => !m)}>
            {menu ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!menu} className="border-t border-line bg-white xl:hidden">
        <nav aria-label="Mobile" className="container-site py-3">
          <ul className="divide-y divide-line">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={() => setMenu(false)} className="flex min-h-12 items-center text-[17px] font-semibold text-navy">{n.label}</a>
              </li>
            ))}
          </ul>
          <Button className="mt-3 mb-2 w-full" onClick={() => { setMenu(false); open('enquiry'); }}>Request a Demo</Button>
        </nav>
      </div>
    </header>
  );
}

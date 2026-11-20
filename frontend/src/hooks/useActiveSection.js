import { useEffect, useState } from 'react';

/** Returns the id of the section currently in view (for nav highlighting). */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 120) { setActive(null); return; }
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => obs.observe(el));
    const onTop = () => { if (window.scrollY < 120) setActive(null); };
    window.addEventListener('scroll', onTop, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener('scroll', onTop); };
  }, [ids]);
  return active;
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader, Reveal, Illustration, cx } from '../components/ui.jsx';

const CARDS = [
  { code: 'en', label: 'English', text: 'Walk for 30 minutes every morning.' },
  { code: 'mr', label: 'मराठी', text: 'दररोज सकाळी ३० मिनिटे चाला.' },
  { code: 'hi', label: 'हिन्दी', text: 'हर सुबह ३० मिनट टहलें।' },
  { code: 'ta', label: 'தமிழ்', text: 'தினமும் காலையில் 30 நிமிடங்கள் நடக்கவும்.' },
];

export default function Multilingual() {
  const track = useRef(null);
  const [state, setState] = useState({ index: 0, canPrev: false, canNext: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth;
    setState({
      index: Math.round(el.scrollLeft / step),
      canPrev: el.scrollLeft > 4,
      canNext: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const scrollTo = (i) => {
    const el = track.current;
    const card = el.children[Math.max(0, Math.min(CARDS.length - 1, i))];
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };
  const scrollable = state.canPrev || state.canNext;

  return (
    <section id="multilingual" aria-labelledby="ml-title" className="scroll-mt-20 py-8 lg:py-10">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <SectionHeader num="04" id="ml-title" eyebrow="Multilingual patient education"
              title={<>The Doctor Advises in English.<br className="hidden sm:inline" /> The Patient Understands in Their Language.</>}
              sub="One instruction. Multiple languages. The same visual clarity." />
          </Reveal>

        </div>

        <ul ref={track} onScroll={measure} className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {CARDS.map((c) => (
            <li key={c.code} className="card flex w-[78%] shrink-0 snap-start items-center gap-3 p-4 xs:w-[66%] sm:w-[46%] lg:w-[calc(25%-12px)]">
              <Illustration name="walk" alt="" className="h-24 w-28 shrink-0" />
              <div>
                <p lang={c.code} className="font-bold text-brand-500">{c.label}</p>
                <p lang={c.code} className="mt-1 text-[15px] font-semibold leading-snug text-navy">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className={cx('mx-auto mt-4 flex items-center justify-center gap-3', !scrollable && 'invisible')} aria-hidden={!scrollable}>
          <div className="flex gap-1.5" role="tablist" aria-label="Language examples">
            {CARDS.map((c, i) => (
              <button key={c.code} type="button" role="tab" aria-selected={state.index === i} aria-label={`Show example ${i + 1}`} tabIndex={scrollable ? 0 : -1}
                onClick={() => scrollTo(i)} className={cx('h-2.5 rounded-full transition-all', state.index === i ? 'w-6 bg-brand-500' : 'w-2.5 bg-brand-200')} />
            ))}
          </div>
          <button type="button" aria-label="Previous example" disabled={!state.canPrev} tabIndex={scrollable ? 0 : -1} onClick={() => scrollTo(state.index - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy shadow-card disabled:opacity-40"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" aria-label="Next example" disabled={!state.canNext} tabIndex={scrollable ? 0 : -1} onClick={() => scrollTo(state.index + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-brand-600 text-white shadow-card disabled:opacity-40"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <p className="mt-3 text-[13px] text-muted">Examples shown. DocVise supports multiple Indian languages.</p>
      </div>
    </section>
  );
}

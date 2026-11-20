import { useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, Video, MoreVertical, Mic, CheckCheck, Send, ChevronDown, Sparkles } from 'lucide-react';
import { cx, Logo, PdfIcon, Illustration } from './ui.jsx';
import demo from '../data/demo-languages.json';

/* ------------------------------------------------------------------ */
/* Scaled composition: lays out children at a fixed design width and   */
/* scales the whole group to the available width (keeps the approved   */
/* proportions of the mockups on every screen size).                   */
/* ------------------------------------------------------------------ */
export function Scaled({ base, className, children, label }) {
  const outer = useRef(null);
  const inner = useRef(null);
  const [box, setBox] = useState({ scale: 1, height: undefined });
  useLayoutEffect(() => {
    const update = () => {
      if (!outer.current || !inner.current) return;
      const scale = Math.min(1, outer.current.clientWidth / base);
      setBox({ scale, height: inner.current.offsetHeight * scale });
    };
    update();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(update);
    ro.observe(outer.current);
    ro.observe(inner.current);
    return () => ro.disconnect();
  }, [base]);
  return (
    <div ref={outer} className={cx('relative w-full', className)} style={{ height: box.height }} role={label ? 'img' : undefined} aria-label={label}>
      <div ref={inner} style={{ width: base, transform: `scale(${box.scale})`, transformOrigin: 'top left' }} className="absolute left-0 top-0" aria-hidden={label ? 'true' : undefined}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phone frame + WhatsApp-style screens                                */
/* ------------------------------------------------------------------ */
export function PhoneFrame({ children, className, label }) {
  return (
    <div role="img" aria-label={label} className={cx('relative rounded-[2.2rem] bg-[#121722] p-[7px] shadow-float ring-1 ring-black/5', className)}>
      <div className="relative overflow-hidden rounded-[1.8rem] bg-wa-chat" aria-hidden="true">
        <div className="absolute left-1/2 top-2 z-10 h-[18px] w-[34%] -translate-x-1/2 rounded-full bg-[#0a0d14]" />
        {children}
      </div>
    </div>
  );
}

function StatusBar({ dark }) {
  return (
    <div className={cx('flex items-center justify-between px-5 pt-2.5 pb-1 text-[11px] font-semibold', dark ? 'text-white' : 'text-ink')}>
      <span>10:30</span>
      <span className="flex items-end gap-[2px]">
        <i className="block h-[5px] w-[3px] rounded-sm bg-current" /><i className="block h-[7px] w-[3px] rounded-sm bg-current" /><i className="block h-[9px] w-[3px] rounded-sm bg-current" />
        <i className="ml-1 block h-[9px] w-[18px] rounded-[3px] border border-current p-[1px]"><i className="block h-full w-3/4 rounded-[1px] bg-current" /></i>
      </span>
    </div>
  );
}

function WaHeader({ subtitle = 'Business account' }) {
  return (
    <div className="bg-wa-dark text-white">
      <StatusBar dark />
      <div className="flex items-center gap-2 px-2.5 pb-2.5">
        <ChevronLeft className="h-4 w-4 shrink-0" />
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
          <img src="/assets/docvise-mark.png" alt="" className="h-5 w-5" width="20" height="20" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[12.5px] font-bold">DocVise</span>
          <span className="block text-[9.5px] text-white/75">{subtitle}</span>
        </span>
        <Video className="h-4 w-4" />
        <MoreVertical className="h-4 w-4" />
      </div>
    </div>
  );
}

function Bubble({ out, time, children, className }) {
  return (
    <div className={cx('flex', out ? 'justify-end' : 'justify-start')}>
      <div className={cx('relative max-w-[86%] rounded-lg px-2.5 pb-1.5 pt-1.5 text-[10.5px] leading-snug text-[#111b21] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]', out ? 'rounded-tr-none bg-wa-bubble' : 'rounded-tl-none bg-white', className)}>
        {children}
        <span className="mt-0.5 flex items-center justify-end gap-1 text-[8.5px] text-[#667781]">
          {time}{out && <CheckCheck className="h-3 w-3 text-[#53bdeb]" />}
        </span>
      </div>
    </div>
  );
}

function InputBar() {
  return (
    <div className="flex items-center gap-1.5 px-2 pb-3 pt-1">
      <div className="flex h-8 flex-1 items-center rounded-full bg-white px-3 text-[10.5px] text-[#8696a0]">Message</div>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00a884] text-white"><Mic className="h-4 w-4" /></span>
    </div>
  );
}

/** Hero phone: the doctor's WhatsApp conversation ending with the PDF. */
export function HeroChat() {
  return (
    <>
      <WaHeader />
      <div className="space-y-2 px-2.5 pt-3 pb-2">
        <Bubble out time="10:30">Hello DocVise</Bubble>
        <Bubble time="10:30" className="!px-0 !pb-0">
          <span className="block px-2.5">Welcome, Doctor. Tap below to enter your advice and choose the patient's language.</span>
          <span className="mt-1.5 block border-t border-[#e9edef] py-1.5 text-center text-[11px] font-semibold text-[#027eb5]">Enter advice</span>
        </Bubble>
        <Bubble out time="10:31">Advice submitted<br />Language: Marathi</Bubble>
        <Bubble time="10:32">
          <span className="flex items-center gap-2 rounded-md bg-[#f5f6f6] p-1.5">
            <PdfIcon className="h-7 w-7 shrink-0" />
            <span className="leading-tight"><b className="block text-[10.5px]">Patient_Guide_Marathi.pdf</b><span className="text-[9px] text-[#667781]">1 page · PDF</span></span>
          </span>
        </Bubble>
      </div>
      <InputBar />
    </>
  );
}

/** Section 3 phone: the doctor's instructions and selected language. */
export function InstructionsChat() {
  return (
    <>
      <WaHeader />
      <div className="space-y-2 px-2.5 pt-3 pb-2">
        <Bubble time="10:30">Please enter your advice and choose the patient's language.</Bubble>
        <Bubble out time="10:31">
          <span className="block space-y-1">
            {demo.instructions.map((t) => <span key={t} className="block rounded bg-white/55 px-1.5 py-0.5 font-medium">{t}</span>)}
          </span>
        </Bubble>
        <div className="rounded-lg bg-white p-2 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]">
          <span className="block text-[9.5px] font-semibold text-[#3b4a54]">Patient language</span>
          <span className="mt-1 flex items-center justify-between rounded-md border border-[#00a884] px-2 py-1 text-[10.5px] font-semibold">
            Marathi <ChevronDown className="h-3 w-3" />
          </span>
        </div>
      </div>
      <div className="flex justify-end px-2.5 pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00a884] text-white"><Send className="h-4 w-4" /></span>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Patient-guidance PDF previews                                       */
/* ------------------------------------------------------------------ */
function PdfHead({ lang }) {
  return (
    <div className="flex flex-col gap-1 px-4 pt-4 pb-2">
      <Logo className="h-8 w-auto self-start" />
      <p className="text-[13.5px] font-semibold text-ink">
        Patient guidance · <span lang={lang.code} className="font-bold text-brand-500">{lang.native}</span>
      </p>
    </div>
  );
}

/** Stacked rows (hero). rows: [{ img, alt, text }] */
export function PdfList({ lang, rows, className }) {
  return (
    <div className={cx('rounded-2xl border border-line bg-white shadow-float', className)}>
      <PdfHead lang={lang} />
      <ul className="space-y-2 px-3">
        {rows.map((r) => (
          <li key={r.img} className="flex items-center gap-2 rounded-xl bg-brand-50 p-1.5">
            <Illustration name={r.img} alt={r.alt} className="h-[72px] w-24 shrink-0" eager />
            <span lang={lang.code} className="text-[15px] font-bold leading-snug text-navy">{r.text}</span>
          </li>
        ))}
      </ul>
      <p className="px-4 pt-2 pb-3 text-[11.5px] text-muted">Shared by your doctor</p>
    </div>
  );
}

/** 2 × 2 grid (in-action section and interactive demo). */
export function PdfGrid({ lang, className, large = false }) {
  return (
    <div className={cx('rounded-2xl border border-line bg-white shadow-float', className)}>
      <PdfHead lang={lang} />
      <ol className="grid grid-cols-2 gap-2 px-3 pb-3">
        {lang.items.map((text, i) => (
          <li key={text} className={cx('flex flex-col gap-1 rounded-xl bg-brand-50 p-2', large && 'sm:p-3')}>
            <Illustration name={demo.illustrations[i]} alt={demo.illustrationAlt[i]} className={cx('h-[72px] w-full', large && 'h-24 sm:h-32')} />
            <span lang={lang.code} className={cx('text-[12.5px] font-bold leading-snug text-navy', large && 'text-[13px] sm:text-[15px]')}>
              <span className="mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 align-[1px] font-sans text-[9px] text-white">{i + 1}</span>
              {text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** "Creating your illustrated guide…" processing card. */
export function ProcessingCard({ className }) {
  return (
    <div className={cx('flex flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-white/90 p-5 text-center shadow-card', className)}>
      <span className="relative">
        <Sparkles className="h-10 w-10 text-brand-500" strokeWidth={1.6} aria-hidden="true" />
        <Sparkles className="absolute -right-3 -top-2 h-4 w-4 text-orange" aria-hidden="true" />
      </span>
      <p className="text-[13px] font-medium leading-snug text-ink">Creating your<br />illustrated guide…</p>
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => <i key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300" style={{ animationDelay: `${i * 200}ms` }} />)}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tent card (doctor-facing; carries the sponsoring brand)            */
/* ------------------------------------------------------------------ */
export function TentCard({ className }) {
  return (
    <div className={className || 'relative'} role="img" aria-label="DocVise QR tent card for the doctor's clinic, with space for the supporting brand">
      <div className="absolute inset-x-[10%] bottom-0 top-[3%] bg-[#e4e9f2] [clip-path:polygon(12%_0,88%_0,100%_100%,0_100%)]" aria-hidden="true" />
      <div className="relative flex h-full flex-col items-center bg-white px-[14%] pt-[8%] pb-[6%] text-center shadow-card [clip-path:polygon(9%_0,91%_0,100%_100%,0_100%)]" aria-hidden="true">
        <Logo className="h-auto w-[78%]" />
        <img src="/assets/qr-pattern.svg" alt="" className="mt-[6%] h-auto w-[62%]" width="100" height="100" />
        <p className="mt-[5%] text-[12px] font-bold leading-tight text-navy">Scan for<br />Patient Guidance</p>
        <span className="mt-auto rounded-md border border-dashed border-orange bg-[#fff7ec] px-2 py-0.5 text-[10px] font-extrabold text-[#b45309]">YOUR BRAND</span>
      </div>
    </div>
  );
}

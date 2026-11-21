import { QrCode, Users, FileText, LayoutDashboard, Activity, MessageCircle, BarChart3, Settings } from 'lucide-react';
import { cx } from './ui.jsx';

// Illustrative figures only – clearly labelled as sample data in the UI.
const KPIS = [
  { icon: QrCode, label: 'QR Scans', value: '8,260', tone: 'bg-blue-50 text-blue-600' },
  { icon: Users, label: 'Active Doctors', value: '1,184', tone: 'bg-brand-50 text-brand-500' },
  { icon: FileText, label: 'PDFs Delivered', value: '3,420', tone: 'bg-orange-50 text-orange' },
  { icon: MessageCircle, label: 'WhatsApp Interactions', value: '12,680', tone: 'bg-emerald-50 text-emerald-600' },
];
const TREND = [42, 48, 46, 55, 58, 62, 60, 70, 74, 80, 86, 92];
const LANGS = [['Hindi', 37, '#6d3cf5'], ['Marathi', 30, '#3b82f6'], ['Tamil', 14, '#2dd4bf'], ['Kannada', 11, '#fb923c'], ['Other', 8, '#cbd5e1']];
const NAV = [[LayoutDashboard, 'Overview'], [Activity, 'Doctor Activity'], [QrCode, 'QR Management'], [MessageCircle, 'WhatsApp Sessions'], [BarChart3, 'Reports'], [Settings, 'Settings']];

function Trend() {
  const w = 220; const h = 70; const max = 100;
  const pts = TREND.map((v, i) => [(i / (TREND.length - 1)) * w, h - (v / max) * h]);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h + 4}`} className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="dvTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7c4dff" stopOpacity=".3" /><stop offset="1" stopColor="#7c4dff" stopOpacity="0" /></linearGradient></defs>
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="#eef0f5" strokeWidth="1" />)}
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill="url(#dvTrend)" />
      <path d={d} fill="none" stroke="#7c4dff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Donut() {
  let acc = 0;
  const stops = LANGS.map(([, p, c]) => { const s = `${c} ${acc}% ${acc + p}%`; acc += p; return s; }).join(', ');
  return (
    <div className="flex items-center gap-2">
      <div className="relative aspect-square w-[42%] shrink-0 rounded-full" style={{ background: `conic-gradient(${stops})` }} aria-hidden="true">
        <div className="absolute inset-[22%] rounded-full bg-white" />
      </div>
      <ul className="min-w-0 space-y-[2px] text-[7px] leading-tight text-ink sm:text-[8px]">
        {LANGS.map(([n, p, c]) => <li key={n} className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-sm" style={{ background: c }} />{n} <span className="text-muted">{p}%</span></li>)}
      </ul>
    </div>
  );
}

/** Head Office dashboard preview – a visual, not a working admin app. */
export default function DashboardPreview({ className, showBase = true }) {
  return (
    <figure className={cx('relative', className)}>
      <div className="rounded-[14px] bg-[#1b1f2e] p-[6px] shadow-float sm:p-1">
        <div className="flex overflow-hidden rounded-lg bg-[#f7f6fc]" role="img" aria-label="Preview of the DocVise Head Office dashboard showing QR scans, active doctors, PDFs delivered, WhatsApp interactions, a usage trend and language usage, with sample data">
          <aside className="hidden w-[22%] shrink-0 flex-col gap-1 bg-gradient-to-b from-navy-950 to-brand-700 p-2 text-white xs:flex" aria-hidden="true">
            <span className="mb-1 flex flex-col gap-1"><img src="/assets/docvise-logo.png" alt="" className="h-auto w-full" width="800" height="233" /><b className="text-[8px] sm:text-[9px]">Head Office</b></span>
            {NAV.map(([I, l], i) => (
              <span key={l} className={cx('flex items-center gap-1 rounded px-1 py-[3px] text-[6.5px] sm:text-[7.5px]', i === 0 ? 'bg-brand-500' : 'text-white/80')}><I className="h-2.5 w-2.5 shrink-0" />{l}</span>
            ))}
          </aside>
          <div className="min-w-0 flex-1 p-2 sm:p-3" aria-hidden="true">
            <div className="mb-2 flex items-center justify-between">
              <b className="font-display text-[11px] text-navy sm:text-[13px]">Overview</b>
              <span className="rounded-full bg-orange/15 px-2 py-[2px] text-[7px] font-bold uppercase tracking-wide text-[#b45309] sm:text-[8px]">Sample data</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {KPIS.map(({ icon: I, label, value, tone }) => (
                <div key={label} className="rounded-md bg-white p-1.5 shadow-sm">
                  <span className={cx('mb-1 flex h-4 w-4 items-center justify-center rounded sm:h-5 sm:w-5', tone)}><I className="h-2.5 w-2.5 sm:h-3 sm:w-3" /></span>
                  <span className="block truncate text-[6.5px] text-muted sm:text-[7.5px]">{label}</span>
                  <b className="block text-[10px] text-navy sm:text-[12px]">{value}</b>
                </div>
              ))}
            </div>
            <div className="mt-1.5 grid grid-cols-[1.5fr_1fr] gap-1.5">
              <div className="rounded-md bg-white p-1.5 shadow-sm">
                <span className="block text-[7px] font-semibold text-ink sm:text-[8px]">Usage Trend – PDFs Delivered</span>
                <div className="mt-1 h-12 sm:h-16"><Trend /></div>
              </div>
              <div className="rounded-md bg-white p-1.5 shadow-sm">
                <span className="mb-1 block text-[7px] font-semibold text-ink sm:text-[8px]">Language Usage</span>
                <Donut />
              </div>
            </div>
            <div className="mt-1.5 rounded-md bg-white p-1.5 shadow-sm">
              <span className="block text-[7px] font-semibold text-ink sm:text-[8px]">Subscription utilisation</span>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-brand-100"><i className="block h-full w-[68%] rounded-full bg-gradient-to-r from-brand-700 to-brand-500" /></span>
            </div>
          </div>
        </div>
      </div>
      {showBase && <div aria-hidden="true" className="mx-auto h-2.5 w-[104%] -translate-x-[2%] rounded-b-xl bg-gradient-to-b from-[#c9ced8] to-[#aeb4c0]" />}
      <figcaption className="mt-2 text-center text-[12px] text-muted">Illustrative preview with sample data.</figcaption>
    </figure>
  );
}

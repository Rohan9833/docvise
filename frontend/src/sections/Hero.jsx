import { Languages, PlayCircle } from 'lucide-react';
import { Button, Reveal, WhatsAppIcon, PdfIcon } from '../components/ui.jsx';
import { PhoneFrame, HeroChat, PdfList, Scaled } from '../components/Mockups.jsx';
import { useModal } from '../hooks/useModal.js';
import { button_click } from '../analytics/events.js';

const MARATHI = { code: 'mr', native: 'मराठी' };
const ROWS = [
  { img: 'walk', alt: 'A man walking in the morning', text: 'दररोज सकाळी चाला.' },
  { img: 'salt', alt: 'A salt shaker with a reduce sign', text: 'आहारातील मिठाचे प्रमाण कमी करा.' },
  { img: 'medicine', alt: 'A clock and a strip of medicines', text: 'डॉक्टरांनी लिहून दिलेली औषधे वेळेवर घ्या.' },
];
const FEATURES = [
  { icon: <WhatsAppIcon className="h-8 w-8" />, label: 'WhatsApp-Based' },
  { icon: <Languages className="h-8 w-8 text-brand-500" strokeWidth={1.8} />, label: 'Multilingual' },
  { icon: <PdfIcon className="h-8 w-8" />, label: 'Illustrated PDFs' },
];

function Swoosh() {
  return (
    <svg viewBox="0 0 220 18" className="absolute -bottom-3 left-0 h-[0.32em] w-[105%]" preserveAspectRatio="none" aria-hidden="true">
      <path d="M3 13 C 60 4, 140 2, 217 9" stroke="#F7931E" strokeWidth="4.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ProductVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      <div aria-hidden="true" className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_60%_45%,#ece3fd_0%,#f4effe_45%,transparent_75%)]" />
      <Scaled base={600}>
        <div className="relative h-[520px]">
          <PhoneFrame label="DocVise conversation on WhatsApp ending with the illustrated PDF" className="absolute left-0 top-0 w-[268px]">
            <HeroChat />
          </PhoneFrame>
          <PdfList lang={MARATHI} rows={ROWS} className="absolute left-[262px] top-[34px] z-10 w-[332px]" />
        </div>
      </Scaled>
      <svg viewBox="0 0 24 24" className="absolute -right-1 bottom-[12%] h-6 w-6 text-orange sm:h-7 sm:w-7" aria-hidden="true"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" fill="currentColor" /></svg>
    </div>
  );
}

export default function Hero() {
  const { open } = useModal();
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#fbf9ff_70%,#f6f2fe_100%)] pb-14 pt-8 sm:pt-10 lg:pb-20 lg:pt-14">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-100/60 blur-3xl" />
      <div className="container-site relative grid gap-x-10 gap-y-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center">
        <Reveal className="lg:col-start-1 lg:row-start-1">
          <h1 id="hero-title" className="text-[40px] leading-[1.06] font-extrabold xs:text-[44px] sm:text-[54px] lg:text-[52px] xl:text-[58px]">
            Doctor’s Advice,<span className="gradient-text">Made Visual.</span> <br />
            <span className="relative inline-block">Made Simple.<Swoosh /></span>
          </h1>
          <p className="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-navy/85 sm:text-[18px]">
            Transforming doctors’ instructions into multilingual, illustrated patient guidance—delivered as a shareable PDF through WhatsApp.
          </p>
          <ul className="mt-7 grid max-w-[34rem] grid-cols-3 gap-3">
            {FEATURES.map((f) => (
              <li key={f.label} className="card flex flex-col items-center gap-2 px-2 py-4 text-center text-[14px] font-semibold text-ink sm:flex-row sm:px-4 sm:text-left">
                <span className="shrink-0">{f.icon}</span>{f.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ProductVisual />
        </Reveal>

        <div className="flex flex-col gap-3 sm:flex-row lg:col-start-1 lg:row-start-2 lg:-mt-2">
          <Button size="lg" className="w-full sm:w-auto lg:h-12 lg:px-5 lg:text-[15px] xl:h-14 xl:px-7 xl:text-[17px]" onClick={() => { button_click({ button_name: 'request_demo', section: 'hero' }); open('enquiry'); }}>Request a Demo</Button>
          <Button size="lg" variant="outline" href="#how-it-works" icon={PlayCircle} onClick={() => button_click({ button_name: "see_how_it_works", section: "hero" })} trailing={null} className="w-full sm:w-auto lg:h-12 lg:px-5 lg:text-[15px] xl:h-14 xl:px-7 xl:text-[17px]">See How It Works</Button>
        </div>
      </div>
    </section>
  );
}

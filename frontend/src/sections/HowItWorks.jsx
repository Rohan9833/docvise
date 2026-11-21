import { QrCode, NotebookPen, Sparkles } from 'lucide-react';
import { SectionHeader, Reveal, WhatsAppIcon, PdfIcon } from '../components/ui.jsx';

const STEPS = [
  { title: 'Scan QR', text: 'Doctor scans their unique QR code.', icon: <QrCode className="h-9 w-9 sm:h-11 sm:w-11 text-navy" strokeWidth={1.6} /> },
  { title: 'Open WhatsApp', text: 'DocVise opens through WhatsApp.', icon: <WhatsAppIcon className="h-9 w-9 sm:h-11 sm:w-11" /> },
  { title: 'Enter Advice & Language', text: 'Doctor enters instructions and selects the patient’s language.', icon: <NotebookPen className="h-9 w-9 sm:h-11 sm:w-11 text-brand-500" strokeWidth={1.6} /> },
  { title: 'Visual Advice', text: 'DocVise transforms the instructions into multilingual illustrations.', icon: <Sparkles className="h-9 w-9 sm:h-11 sm:w-11 text-brand-500" strokeWidth={1.6} /> },
  { title: 'Receive PDF', text: 'The illustrated PDF is delivered to the doctor on WhatsApp.', icon: <PdfIcon className="h-9 w-9 sm:h-11 sm:w-11" /> },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 py-8 lg:py-10">
      <div className="container-site">
        <Reveal>
          <SectionHeader num="02" id="how-title" eyebrow="How DocVise works"
            title={<>One QR Scan. A Few Instructions.<br className="hidden sm:inline" /> A Personalised PDF.</>}
            sub="No app to install. The entire journey happens on WhatsApp." />
        </Reveal>

        {/* Desktop: horizontal cards. Below lg: numbered vertical timeline. */}
        <ol className="relative mt-9 space-y-4 before:absolute before:bottom-8 before:left-[19px] before:top-8 before:w-0.5 before:bg-brand-200 lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0 lg:before:hidden">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.06} className="relative flex items-center gap-4 lg:flex lg:items-center lg:gap-3">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-[16px] font-bold text-white ring-4 ring-white lg:static lg:h-9 lg:w-9 lg:text-[15px]">
                {i + 1}
              </span>
              <div className="card flex flex-1 items-center gap-3 p-3 sm:gap-4 sm:p-5 lg:h-full lg:flex-row lg:items-center lg:px-4 lg:py-4 lg:text-left">
                <span className="shrink-0" aria-hidden="true">{s.icon}</span>
                <span>
                  <h3 className="font-display text-[17px] font-bold leading-snug text-navy lg:text-[16px]">{s.title}</h3>
                  <p className="mt-1 text-[15px] leading-snug text-ink/75 lg:mt-1 lg:text-[14px]">{s.text}</p>
                </span>
              </div>
              
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

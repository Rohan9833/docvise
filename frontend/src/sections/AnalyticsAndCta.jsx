import { QrCode, Network, FileText, Gauge } from 'lucide-react';
import { SectionHeader, Reveal, Button, WhatsAppIcon } from '../components/ui.jsx';
import DashboardPreview from '../components/DashboardPreview.jsx';
import { PhoneFrame, HeroChat, TentCard, Scaled } from '../components/Mockups.jsx';
import { useModal } from '../hooks/useModal.js';
import { button_click } from '../analytics/events.js';

const HIGHLIGHTS = [
  { icon: <QrCode className="h-7 w-7 text-navy" strokeWidth={1.7} />, text: 'Doctor-wise QR scans & activity' },
  { icon: <Network className="h-7 w-7 text-navy" strokeWidth={1.7} />, text: 'Zone, Region, Area, HQ & MR performance' },
  { icon: <WhatsAppIcon className="h-7 w-7" />, text: 'WhatsApp interactions' },
  { icon: <FileText className="h-7 w-7 text-navy" strokeWidth={1.7} />, text: 'PDF generation & language-wise usage' },
  { icon: <Gauge className="h-7 w-7 text-navy" strokeWidth={1.7} />, text: 'Subscription utilisation' },
];

export default function AnalyticsAndCta() {
  const { open } = useModal();
  return (
    <div className="container-site grid gap-8 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-stretch lg:pb-20">
      <section id="analytics" aria-labelledby="analytics-title" className="scroll-mt-20 lg:py-4">
        <Reveal>
          <SectionHeader num="06" id="analytics-title" eyebrow="Head Office analytics"
            title="From Doctor Engagement to Actionable Insights."
            sub="Get visibility into adoption, usage and performance across your field force." titleClass="lg:text-[30px]" />
        </Reveal>
        <Reveal delay={0.05} className="mt-7 lg:hidden">
          <DashboardPreview />
        </Reveal>
        <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 xl:gap-2.5">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal as="li" key={h.text} delay={i * 0.05} className="card flex flex-col items-center gap-2 px-2 py-4 text-center">
              <span aria-hidden="true">{h.icon}</span>
              <span className="text-[13px] font-semibold leading-snug text-navy xl:text-[12px]">{h.text}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      <section id="contact" aria-labelledby="cta-title" className="scroll-mt-20">
        <Reveal className="relative h-full overflow-hidden rounded-[2rem] border border-line bg-[linear-gradient(135deg,#f6f2fe_0%,#fbf9ff_50%,#eef4ff_100%)] p-6 sm:p-8">
          <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_220px] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_230px]">
            <div className="order-2 sm:order-1">
              <SectionHeader id="cta-title" eyebrow="Bring DocVise to your brand"
                title="Your Brand. Your Doctors. Smarter Patient Education." titleClass="!text-[26px] xl:!text-[27px]" />
              <p className="mt-3 text-[16px] leading-relaxed text-ink/80">Bring multilingual visual patient education into everyday doctor interactions with DocVise.</p>
              <Button size="lg" className="mt-6 w-full sm:w-auto" onClick={() => { button_click({ button_name: 'request_demo', section: 'contact_cta' }); open('enquiry'); }}>Request a Demo</Button>
            </div>
            <Scaled base={500} className="order-1 mx-auto max-w-[280px] sm:order-2 lg:max-w-[320px] xl:max-w-none" label="DocVise on WhatsApp beside a QR tent card for the doctor's clinic, with space for the supporting brand">
              <div className="relative h-[520px]">
                <PhoneFrame className="absolute left-3 top-6 z-10 w-[250px] -rotate-6"><HeroChat /></PhoneFrame>
                <TentCard className="absolute right-0 top-[110px] h-[380px] w-[280px]" />
              </div>
            </Scaled>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

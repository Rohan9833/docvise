import { HeartHandshake, RefreshCw, BarChart3, Users, TrendingUp } from 'lucide-react';
import { SectionHeader, Reveal } from '../components/ui.jsx';
import DashboardPreview from '../components/DashboardPreview.jsx';

const BENEFITS = [
  { icon: HeartHandshake, title: 'Engage Doctors', text: 'Offer a useful patient-education service doctors can access in everyday practice.' },
  { icon: RefreshCw, title: 'Encourage Repeat Usage', text: 'Enable doctors to create illustrated guidance whenever needed.' },
  { icon: BarChart3, title: 'Measure Engagement', text: 'Track QR scans, active doctors, completed sessions and PDFs delivered.' },
  { icon: Users, title: 'Monitor Your Field Force', text: 'Analyse doctor participation and utilisation from Zone down to individual Medical Representative.' },
];

export default function WhyDocVise() {
  return (
    <section id="why-docvise" aria-labelledby="why-title" className="scroll-mt-20 py-8 lg:py-16">
      <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <Reveal>
            <SectionHeader num="05" id="why-title" eyebrow="Why DocVise for your brand"
              title={<>Built for Doctors.<br className="hidden sm:inline" /> Designed for Pharma Brands.</>}
              sub="A patient-education initiative that supports meaningful doctor engagement and provides measurable usage insights." />
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:gap-4">
            {BENEFITS.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.06} className="card flex items-start gap-3 p-3 sm:gap-4 sm:p-5">
                <Icon className="h-8 w-8 shrink-0 text-brand-500 sm:h-9 sm:w-9" strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <h3 className="font-sans text-[16px] font-bold text-navy">{title}</h3>
                  <p className="mt-1 text-[14.5px] leading-snug text-ink/75">{text}</p>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Desktop shows the dashboard here (approved desktop layout); mobile shows it in Analytics. */}
        <Reveal delay={0.1} className="relative hidden pb-8 lg:block">
          <DashboardPreview showBase={false} />
          <div className="absolute -bottom-1 left-[6%] right-[6%] flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 px-5 py-3.5 text-white shadow-float">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange"><TrendingUp className="h-5 w-5" aria-hidden="true" /></span>
            <span className="font-display text-[16px] font-semibold">Complete Visibility. Better Decisions.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

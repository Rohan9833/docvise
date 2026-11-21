import { HeartHandshake, RefreshCw, BarChart3, Users } from 'lucide-react';
import { SectionHeader, Reveal } from '../components/ui.jsx';

const BENEFITS = [
  { icon: HeartHandshake, title: 'Engage Doctors', text: 'Offer a useful patient-education service doctors can access in everyday practice.' },
  { icon: RefreshCw, title: 'Encourage Repeat Usage', text: 'Enable doctors to create illustrated guidance whenever needed.' },
  { icon: BarChart3, title: 'Measure Engagement', text: 'Track QR scans, active doctors, completed sessions and PDFs delivered.' },
  { icon: Users, title: 'Monitor Your Field Force', text: 'Analyse doctor participation and utilisation from Zone down to individual Medical Representative.' },
];

export default function WhyDocVise() {
  return (
    <section id="why-docvise" aria-labelledby="why-title" className="scroll-mt-20 py-8 lg:py-16">
      <div className="container-site">
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

      </div>
    </section>
  );
}

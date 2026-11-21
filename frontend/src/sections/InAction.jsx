import { ChevronRight } from 'lucide-react';
import { SectionHeader, Reveal, Button } from '../components/ui.jsx';
import { PhoneFrame, InstructionsChat, PdfGrid, Scaled } from '../components/Mockups.jsx';
import { useModal } from '../hooks/useModal.js';
import demo from '../data/demo-languages.json';

const MARATHI = demo.languages.find((l) => l.code === 'mr');
const Arrow = ({ className }) => <ChevronRight aria-hidden="true" className={`h-7 w-7 shrink-0 text-brand-500 ${className || ''}`} strokeWidth={2.5} />;

export default function InAction() {
  const { open } = useModal();
  return (
    <section id="in-action" aria-labelledby="action-title" className="scroll-mt-20 py-4 lg:py-4">
      <div className="container-site">
        <div className="rounded-[2rem] border border-line bg-[linear-gradient(135deg,#f6f2fe_0%,#f9f7ff_55%,#eef4ff_100%)] px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,390px)_minmax(0,1fr)] xl:items-center">
            <Reveal className="relative z-10 min-w-0">
              <SectionHeader num="03" id="action-title" eyebrow="See DocVise in action"
                title={<>From Instructions to<br className="hidden sm:inline" />  Illustrations.On WhatsApp.</>}
                sub={<>Example: the doctor types four<br className="hidden xl:inline" /> instructions and selects Marathi.</>} titleClass="xl:text-[27px]" />
              <div className="mt-7 hidden xl:block"><Button variant="outline" onClick={() => open('demo')}>Try the Interactive Demo</Button></div>
            </Reveal>

            <Reveal delay={0.1} className="relative z-0 min-w-0">
              {/* Desktop and mobile use the same phone → PDF flow. */}
              <Scaled base={680} className="mx-auto hidden max-w-[680px] md:block">
                <div className="flex items-center gap-3">
                  <PhoneFrame label="Doctor's instructions on WhatsApp: Do CBC, Do BMD test, Do chest X-ray, Reduce weight; patient language Marathi" className="w-[236px] shrink-0">
                    <InstructionsChat />
                  </PhoneFrame>
                  <Arrow />
                  <PdfGrid lang={MARATHI} className="w-[370px] shrink-0" />
                </div>
              </Scaled>
              <Scaled base={560} className="mx-auto max-w-[560px] md:hidden">
                <div className="flex items-center gap-2">
                  <PhoneFrame label="Doctor's instructions on WhatsApp: Do CBC, Do BMD test, Do chest X-ray, Reduce weight; patient language Marathi" className="w-[236px] shrink-0">
                    <InstructionsChat />
                  </PhoneFrame>
                  <Arrow />
                  <PdfGrid lang={MARATHI} className="w-[290px] shrink-0" />
                </div>
              </Scaled>
            </Reveal>
          </div>
          <div className="mt-8 flex justify-center xl:hidden">
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => open('demo')}>Try the Interactive Demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

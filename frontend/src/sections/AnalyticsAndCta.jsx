import { QrCode, Network, FileText, Gauge } from "lucide-react";
import {
  SectionHeader,
  Reveal,
  Button,
  WhatsAppIcon,
} from "../components/ui.jsx";
import DashboardPreview from "../components/DashboardPreview.jsx";
import {
  PhoneFrame,
  HeroChat,
  TentCard,
  Scaled,
} from "../components/Mockups.jsx";
import { useModal } from "../hooks/useModal.js";
import { button_click } from "../analytics/events.js";

const HIGHLIGHTS = [
  {
    icon: <QrCode className="h-7 w-7 text-navy" strokeWidth={1.7} />,
    text: (
      <>
        Doctor-wise
        <br />
        QR scans & activity
      </>
    ),
  },
  {
    icon: <Network className="h-7 w-7 text-navy" strokeWidth={1.7} />,
    text: "Zone, Region, Area, HQ & MR performance",
  },
  {
    icon: <WhatsAppIcon className="h-7 w-7" />,
    text: (
      <>
        WhatsApp
        <br /> interactions
      </>
    ),
  },
  {
    icon: <FileText className="h-7 w-7 text-navy" strokeWidth={1.7} />,
    text: "PDF generation & language-wise usage",
  },
  {
    icon: <Gauge className="h-7 w-7 text-navy" strokeWidth={1.7} />,
    text: "Subscription utilisation",
  },
];

export default function AnalyticsAndCta() {
  const { open } = useModal();
  return (
    <div className="container-site grid gap-8 pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] pb-8 lg:items-stretch lg:gap-6 lg:pb-10">
      <section
        id="analytics"
        aria-labelledby="analytics-title"
        className="scroll-mt-20 lg:py-4"
      >
        <Reveal>
          <SectionHeader
            num="06"
            id="analytics-title"
            eyebrow="Head Office analytics"
            title="From Doctor Engagement to Actionable Insights."
            sub="Get visibility into adoption, usage and performance across your field force."
            titleClass="lg:text-[30px]"
          />
        </Reveal>
        <Reveal delay={0.05} className="mt-7">
          <DashboardPreview />
        </Reveal>
        <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3 xl:gap-3">
          {/* {HIGHLIGHTS.map((h, i) => (
            <Reveal
              as="li"
              key={h.text}
              delay={i * 0.05}
              className="card flex flex-col items-center gap-2 px-2 py-4 text-center"
            >
              <span aria-hidden="true">{h.icon}</span>
              <span className="text-[13px] font-semibold leading-snug text-navy xl:text-[12px]">
                {h.text}
              </span>
            </Reveal>
          ))} */}
          {HIGHLIGHTS.map((h, i) => (
            <Reveal
              as="li"
              key={i}
              delay={i * 0.05}
              className={`card flex items-center gap-2 px-2 py-4 text-center ${
                i === HIGHLIGHTS.length - 1
                  ? "col-span-2 flex-row justify-center sm:col-span-1 sm:flex-col"
                  : "flex-col"
              }`}
            >
              <span aria-hidden="true" className="shrink-0">
                {h.icon}
              </span>

              <span
                className={`text-[13px] font-semibold leading-snug text-navy xl:text-[12px] ${
                  i === HIGHLIGHTS.length - 1
                    ? "text-left sm:text-center"
                    : "text-center"
                }`}
              >
                {h.text}
              </span>
            </Reveal>
          ))}
        </ul>
      </section>

      <section
        id="contact"
        aria-labelledby="cta-title"
        className="scroll-mt-20 lg:self-start"
      >
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-line bg-[linear-gradient(135deg,#f6f2fe_0%,#fbf9ff_50%,#eef4ff_100%)] p-6 sm:p-8 lg:p-6">
          <div className="grid items-center gap-6 sm:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_200px] xl:grid-cols-[minmax(0,1fr)_230px]">
            <div className="order-2 sm:order-1 lg:order-1">
              <SectionHeader
                id="cta-title"
                eyebrow="Bring DocVise to your brand"
                title="Your Brand. Your Doctors. Smarter Patient Education."
                titleClass="!text-[26px] xl:!text-[27px]"
              />
              <p className="mt-3 text-[16px] leading-relaxed text-ink/80">
                Bring multilingual visual patient education into everyday doctor
                interactions with DocVise.
              </p>
              <Button
                size="lg"
                className="mt-6 w-full sm:w-auto"
                onClick={() => {
                  button_click({
                    button_name: "request_demo",
                    section: "contact_cta",
                  });
                  open("enquiry");
                }}
              >
                Request a Demo
              </Button>
            </div>
            <Scaled
              base={500}
              className="order-1 mx-auto max-w-[280px] sm:order-2 lg:order-2 lg:max-w-none"
              label="DocVise on WhatsApp beside a QR tent card for the doctor's clinic, with space for the supporting brand"
            >
              <div className="relative h-[520px]">
                <PhoneFrame className="absolute left-3 top-6 z-10 w-[250px] -rotate-6">
                  <HeroChat />
                </PhoneFrame>
                <TentCard className="absolute right-0 top-[110px] h-[380px] w-[280px]" />
              </div>
            </Scaled>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

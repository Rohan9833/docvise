import { Languages, PlayCircle } from "lucide-react";
import { Button, Reveal, WhatsAppIcon, PdfIcon } from "../components/ui.jsx";
import {
  PhoneFrame,
  HeroChat,
  PdfList,
  Scaled,
} from "../components/Mockups.jsx";
import { useModal } from "../hooks/useModal.js";
import { button_click } from "../analytics/events.js";

const MARATHI = { code: "mr", native: "मराठी" };

const ROWS = [
  {
    img: "walk",
    alt: "A man walking in the morning",
    text: "दररोज सकाळी चाला.",
  },
  {
    img: "salt",
    alt: "A salt shaker with a reduce sign",
    text: "आहारातील मिठाचे प्रमाण कमी करा.",
  },
  {
    img: "medicine",
    alt: "A clock and a strip of medicines",
    text: "डॉक्टरांनी लिहून दिलेली औषधे वेळेवर घ्या.",
  },
];

const FEATURES = [
  {
    icon: <WhatsAppIcon className="h-8 w-8" />,
    label: "WhatsApp-Based",
  },
  {
    icon: <Languages className="h-8 w-8 text-brand-500" strokeWidth={1.8} />,
    label: "Multilingual",
  },
  {
    icon: <PdfIcon className="h-8 w-8" />,
    label: "Illustrated PDFs",
  },
];

function Swoosh() {
  return (
    <svg
      viewBox="0 0 220 18"
      className="absolute -bottom-2 left-0 h-[0.32em] w-[105%]"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M3 13 C 60 4, 140 2, 217 9"
        stroke="#F7931E"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProductVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_60%_45%,#ece3fd_0%,#f4effe_45%,transparent_75%)]"
      />

      <Scaled base={600}>
        <div className="relative h-[460px] sm:h-[520px]">
          <PhoneFrame
            label="DocVise conversation on WhatsApp ending with the illustrated PDF"
            className="absolute left-9 top-0 z-[-5] w-[238px]"
          >
            <HeroChat />
          </PhoneFrame>

          <PdfList
            lang={MARATHI}
            rows={ROWS}
            className="absolute left-[262px] top-[34px] z-10 w-[332px]"
          />
        </div>
      </Scaled>
    </div>
  );
}

export default function Hero() {
  const { open } = useModal();

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#fbf9ff_70%,#f6f2fe_100%)] pb-8 pt-2 sm:pt-10 lg:pb-10 lg:pt-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-100/60 blur-3xl"
      />

      <div className="container-site relative grid gap-x-10 gap-y-2 sm:gap-y-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center">
        {/* Heading */}
        <h1
          id="hero-title"
          className="order-0 text-[20px] leading-[1.5] font-extrabold sm:text-[54px] lg:col-start-1 lg:row-start-1 lg:text-[52px] xl:text-[58px]"
        >
          Doctor’s Advice,
          <span className="relative inline-block gradient-text ml-[2px]">
            Made Visual,
            <Swoosh />
          </span>
          <br />
          <span className="relative inline-block gradient-text mt-[4px]">
            मेड़ लोकल.
          </span>
        </h1>

        {/* Product visual */}
        <Reveal
          delay={0.1}
          className="order-1 lg:col-start-2 lg:row-start-1 lg:row-span-2"
        >
          <ProductVisual />
        </Reveal>

        {/* Description and buttons */}
        <Reveal className="order-2 flex flex-col lg:col-start-1 lg:row-start-2">
          {/* Description */}
          <p className="order-2 mt-5 max-w-[34rem] text-[17px] leading-relaxed text-navy/85 sm:order-2 sm:mt-5 sm:text-[18px]">
            Transforming doctors’ instructions into multilingual, illustrated
            patient guidance—delivered as a shareable PDF through WhatsApp.
          </p>

          {/* Buttons */}
          <div className="order-1 mt-0 flex flex-row gap-2 sm:order-1 sm:mt-5 sm:flex-row lg:mt-4">
            <Button
              size="lg"
              className="min-w-0 flex-1 !h-8 !px-1.5 !text-[11px] !gap-1 whitespace-nowrap sm:flex-none sm:w-auto sm:!h-9 sm:!px-3 sm:!text-[12px] lg:!h-10 lg:!px-4 lg:!text-[13px] xl:!h-11 xl:!px-5 xl:!text-[14px]"
              onClick={() => {
                button_click({
                  button_name: "request_demo",
                  section: "hero",
                });
                open("enquiry");
              }}
            >
              Request a Demo
            </Button>

            <Button
              size="lg"
              variant="outline"
              href="#how-it-works"
              icon={PlayCircle}
              onClick={() =>
                button_click({
                  button_name: "see_how_it_works",
                  section: "hero",
                })
              }
              trailing={null}
              className="min-w-0 flex-1 !h-8 !px-1.5 !text-[11px] !gap-1 whitespace-nowrap sm:flex-none sm:w-auto sm:!h-9 sm:!px-3 sm:!text-[12px] lg:!h-10 lg:!px-4 lg:!text-[13px] xl:!h-11 xl:!px-5 xl:!text-[14px]"
            >
              See How It Works
            </Button>
          </div>
        </Reveal>

        {/* Feature cards */}
        <ul className="order-3 mt-2 grid max-w-[34rem] grid-cols-3 gap-3 lg:col-span-2 lg:row-start-3 lg:mt-0 lg:max-w-none">
          {FEATURES.map((f) => (
            <li
              key={f.label}
              className="card flex flex-col items-center gap-2 px-2 py-4 text-center text-[14px] font-semibold text-ink sm:flex-row sm:px-4 sm:text-left"
            >
              <span className="shrink-0">{f.icon}</span>
              {f.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

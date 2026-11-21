import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import { ShieldCheck } from "lucide-react";
import { ModalContext } from "./hooks/useModal.js";
import Header from "./sections/Header.jsx";
import Hero from "./sections/Hero.jsx";
import HowItWorks from "./sections/HowItWorks.jsx";
import InAction from "./sections/InAction.jsx";
import Multilingual from "./sections/Multilingual.jsx";
import WhyDocVise from "./sections/WhyDocVise.jsx";
import AnalyticsAndCta from "./sections/AnalyticsAndCta.jsx";
import Footer from "./sections/Footer.jsx";
import usePageAndVisibilityTracking from "./analytics/usePageAndVisibilityTracking.js";

// Modals are code-split: they load only when a visitor opens one.
const DemoModal = lazy(() => import("./components/DemoModal.jsx"));
const EnquiryModal = lazy(() => import("./components/EnquiryModal.jsx"));
const LegalModal = lazy(() => import("./components/LegalModal.jsx"));

function Disclaimer() {
  return (
    <section
      aria-labelledby="disclaimer-heading"
      className="bg-white py-4 sm:py-10 lg:py-6"
    >
      <div className="container-site">
        <div className="flex items-start gap-4 rounded-[24px] bg-brand-700 px-5 py-6 text-white sm:gap-5 sm:px-7 sm:py-8 md:rounded-[28px]">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#E8A414]"
            size={30}
          />
          <div className="min-w-0">
            <h2
              id="disclaimer-heading"
              className="text-sm font-extrabold tracking-[0.12em] text-white"
            >
              DISCLAIMER
            </h2>
            <p className="mt-2 text-[10px] leading-3 text-white/90 sm:text-base sm:leading-7">
              DocVise is an AI-powered patient-education tool that converts
              doctor-provided instructions into visual and multilingual content.
              AI-generated illustrations and translations may contain
              inaccuracies. Healthcare professionals are responsible for
              reviewing and approving the content before sharing it with
              patients. DocVise does not replace professional medical judgement,
              diagnosis or treatment.
              {/* The doctors, names, clinics and people shown here are AI-generated for illustration. Any figures shown are sample data. The health content in the samples is not medically verified and is not medical advice. Please consult a qualified doctor for any health concern. This website and its demonstrations are for illustrative purposes and showcase DocVise services. */}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  // Track the current URL, including hash-based section navigation.
  const [currentPath, setCurrentPath] = useState(
    () =>
      window.location.pathname + window.location.search + window.location.hash,
  );

  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(
        window.location.pathname +
          window.location.search +
          window.location.hash,
      );
    };

    window.addEventListener("hashchange", updatePath);
    window.addEventListener("popstate", updatePath);

    return () => {
      window.removeEventListener("hashchange", updatePath);
      window.removeEventListener("popstate", updatePath);
    };
  }, []);

  // Track page views and browser-tab visibility.
  usePageAndVisibilityTracking(currentPath);

  // A small stack so a dialog can open another (e.g. Privacy Policy from the enquiry form) without losing input.
  const [stack, setStack] = useState([]);
  const open = useCallback(
    (name, props = {}) =>
      setStack((s) => [...s, { name, props, key: `${name}-${Date.now()}` }]),
    [],
  );
  const close = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ModalContext.Provider value={value}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-card"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <HowItWorks />
        <InAction />
        <Multilingual />
        <WhyDocVise />
        <AnalyticsAndCta />
      </main>
      <Disclaimer />
      <Footer />
      <Suspense fallback={null}>
        {stack.map((m, i) => {
          const common = {
            onClose: close,
            isTop: i === stack.length - 1,
            ...m.props,
          };
          if (m.name === "demo") return <DemoModal key={m.key} {...common} />;
          if (m.name === "enquiry")
            return <EnquiryModal key={m.key} {...common} />;
          return <LegalModal key={m.key} kind={m.name} {...common} />;
        })}
      </Suspense>
    </ModalContext.Provider>
  );
}

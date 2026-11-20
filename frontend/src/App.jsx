import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { ModalContext } from "./hooks/useModal.js";
import Header from "./sections/Header.jsx";
import Hero from "./sections/Hero.jsx";
import HowItWorks from "./sections/HowItWorks.jsx";
import InAction from "./sections/InAction.jsx";
import Multilingual from "./sections/Multilingual.jsx";
import WhyDocVise from "./sections/WhyDocVise.jsx";
import AnalyticsAndCta from "./sections/AnalyticsAndCta.jsx";
import Footer from "./sections/Footer.jsx";

// Modals are code-split: they load only when a visitor opens one.
const DemoModal = lazy(() => import("./components/DemoModal.jsx"));
const EnquiryModal = lazy(() => import("./components/EnquiryModal.jsx"));
const LegalModal = lazy(() => import("./components/LegalModal.jsx"));

export default function App() {
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

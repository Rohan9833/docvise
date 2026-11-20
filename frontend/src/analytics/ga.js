import ReactGA from "react-ga4";

// ============================================================
// Google Analytics 4 Initialization
// ============================================================

export { ReactGA };

let initialized = false;

/**
 * Initialize Google Analytics only once.
 */
export const initializeGA = () => {
  if (initialized) return;

  const measurementId = import.meta.env.VITE_GA_ID;

  if (!measurementId) {
    console.warn("GA4 Measurement ID missing");
    return;
  }

  ReactGA.initialize(measurementId, {
    gtagOptions: {
      send_page_view: false,
    },
  });

  initialized = true;

  if (import.meta.env.DEV) {
    console.log("Google Analytics initialized");
  }
};

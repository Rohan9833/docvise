import ReactGA from "react-ga4";

// ============================================================
// Google Analytics 4 Initialization
// ============================================================

let initialized = false;

/**
 * Initialize Google Analytics only once.
 */
export const initializeGA = () => {
  // Prevent duplicate initialization
  if (initialized) return;

  // Get the GA4 Measurement ID from environment variables
  const measurementId = import.meta.env.VITE_GA_ID;

  // If the Measurement ID is missing, do not initialize GA
  if (!measurementId) {
    console.warn("GA4 Measurement ID missing");
    return;
  }

  // Initialize Google Analytics without automatic pageviews.
  // Pageviews are managed by our React tracking hook.
  ReactGA.initialize(measurementId, {
    gtagOptions: {
      send_page_view: false,
    },
  });

  // Mark GA as initialized
  initialized = true;

  if (import.meta.env.DEV) {
    console.log("Google Analytics initialized");
  }
};

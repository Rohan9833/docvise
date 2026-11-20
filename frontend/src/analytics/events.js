import { ReactGA } from "./ga.js";

// ============================================================
// DocVise GA4 Event Tracker
// ============================================================

const safeEvent = (eventName, params = {}) => {
  try {
    ReactGA.event(eventName, params);

    if (import.meta.env.DEV) {
      console.log("GA Event:", eventName, params);
    }
  } catch (error) {
    console.warn("GA event failed:", eventName, error);
  }
};

const normalizeLocation = (location) =>
  location || window.location.pathname;

// ============================================================
// Page Tracking
// ============================================================

let lastPageView = null;

/**
 * Send one page view per unique URL in the current runtime.
 * @param {string} path
 */
export const page_view = (path) => {
  const cleanPath = path?.replace(/\/+$/, "") || "/";
  if (cleanPath === lastPageView) return;
  lastPageView = cleanPath;

  try {
    ReactGA.send({
      hitType: "pageview",
      page: cleanPath,
      title: document.title,
    });

    if (import.meta.env.DEV) {
      console.log("GA Page View:", cleanPath);
    }
  } catch (error) {
    console.warn("GA pageview failed:", cleanPath, error);
  }
};

// ============================================================
// Generic Event
// ============================================================

export const trackEvent = (eventName, params = {}) => {
  safeEvent(eventName, params);
};

// ============================================================
// Authentication Events
// ============================================================

export const sign_up = ({ method = "email" } = {}) => {
  safeEvent("sign_up", { method });
};

export const login = ({ method = "email" } = {}) => {
  safeEvent("login", { method });
};

export const logout = () => {
  safeEvent("logout", {});
};

// ============================================================
// Navigation and Button Events
// ============================================================

export const navigation_menu_click = ({ menu_item, location } = {}) => {
  safeEvent("navigation_menu_click", {
    menu_item,
    location: normalizeLocation(location),
  });
};

export const button_click = ({
  button_name,
  section = "general",
  location,
} = {}) => {
  safeEvent("button_click", {
    button_name,
    section,
    location: normalizeLocation(location),
  });
};

// ============================================================
// Document Events
// ============================================================

export const file_upload = ({
  file_type = "unknown",
  file_size_category = "unknown",
} = {}) => {
  safeEvent("file_upload", { file_type, file_size_category });
};

export const document_processing_started = ({
  document_type = "unknown",
} = {}) => {
  safeEvent("document_processing_started", { document_type });
};

export const document_processing_completed = ({
  document_type = "unknown",
  processing_time_category = "unknown",
} = {}) => {
  safeEvent("document_processing_completed", {
    document_type,
    processing_time_category,
  });
};

export const document_processing_failed = ({
  document_type = "unknown",
  error_type = "unknown",
} = {}) => {
  safeEvent("document_processing_failed", { document_type, error_type });
};

export const document_download = ({
  document_type = "unknown",
  format = "unknown",
} = {}) => {
  safeEvent("document_download", { document_type, format });
};

// ============================================================
// Application Engagement Events
// ============================================================

export const feature_used = ({ feature_name, location } = {}) => {
  safeEvent("feature_used", {
    feature_name,
    location: normalizeLocation(location),
  });
};

export const search_performed = ({ search_type = "general" } = {}) => {
  safeEvent("search_performed", { search_type });
};

// ============================================================
// Tab Visibility Events
// ============================================================

let lastVisibilityState = null;
let lastVisibilitySentAt = 0;
const VISIBILITY_THROTTLE_MS = 2000;

export const tab_visibility = (state) => {
  if (state === lastVisibilityState) return;

  const now = Date.now();
  if (now - lastVisibilitySentAt < VISIBILITY_THROTTLE_MS) return;

  lastVisibilityState = state;
  lastVisibilitySentAt = now;

  if (state === "hidden") safeEvent("tab_hidden", {});
  if (state === "visible") safeEvent("tab_visible", {});
};

import ReactGA from "react-ga4";

// ============================================================
// DocVise GA4 Event Tracker
// ============================================================

/**
 * Internal safe wrapper.
 * Analytics errors should never break the application.
 *
 * @param {string} eventName
 * @param {Record<string, any>} params
 */
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

/**
 * Normalize the page location.
 *
 * @param {string} location
 */
const normalizeLocation = (location) =>
  location || window.location.pathname;

// ============================================================
// Page Tracking
// ============================================================

/**
 * SPA page view.
 *
 * @param {string} path
 */
export const page_view = (path) => {
  const cleanPath = path?.replace(/\/+$/, "") || "/";

  try {
    ReactGA.send({
      hitType: "pageview",
      page: cleanPath,
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

/**
 * Generic event tracker.
 *
 * Prefer dedicated event functions when available.
 *
 * @param {string} eventName
 * @param {Record<string, any>} params
 */
export const trackEvent = (eventName, params = {}) => {
  safeEvent(eventName, params);
};

// ============================================================
// Authentication Events
// ============================================================

/**
 * Successful user registration.
 */
export const sign_up = ({ method = "email" } = {}) => {
  safeEvent("sign_up", {
    method,
  });
};

/**
 * Successful user login.
 */
export const login = ({ method = "email" } = {}) => {
  safeEvent("login", {
    method,
  });
};

/**
 * User logout.
 */
export const logout = () => {
  safeEvent("logout", {});
};

// ============================================================
// Navigation and Button Events
// ============================================================

/**
 * Navigation menu click.
 *
 * @param {{ menu_item: string, location?: string }} params
 */
export const navigation_menu_click = ({
  menu_item,
  location,
}) => {
  safeEvent("navigation_menu_click", {
    menu_item,
    location: normalizeLocation(location),
  });
};

/**
 * Button click.
 *
 * @param {{ button_name: string, section?: string, location?: string }} params
 */
export const button_click = ({
  button_name,
  section = "general",
  location,
}) => {
  safeEvent("button_click", {
    button_name,
    section,
    location: normalizeLocation(location),
  });
};

// ============================================================
// Document Events
// ============================================================

/**
 * Successful file upload.
 *
 * Do not send filenames or document contents to Analytics.
 *
 * @param {{ file_type?: string, file_size_category?: string }} params
 */
export const file_upload = ({
  file_type = "unknown",
  file_size_category = "unknown",
} = {}) => {
  safeEvent("file_upload", {
    file_type,
    file_size_category,
  });
};

/**
 * Document processing started.
 *
 * @param {{ document_type?: string }} params
 */
export const document_processing_started = ({
  document_type = "unknown",
} = {}) => {
  safeEvent("document_processing_started", {
    document_type,
  });
};

/**
 * Document processing completed successfully.
 *
 * @param {{ document_type?: string, processing_time_category?: string }} params
 */
export const document_processing_completed = ({
  document_type = "unknown",
  processing_time_category = "unknown",
} = {}) => {
  safeEvent("document_processing_completed", {
    document_type,
    processing_time_category,
  });
};

/**
 * Document processing failed.
 *
 * Do not send raw error messages if they contain sensitive information.
 *
 * @param {{ document_type?: string, error_type?: string }} params
 */
export const document_processing_failed = ({
  document_type = "unknown",
  error_type = "unknown",
} = {}) => {
  safeEvent("document_processing_failed", {
    document_type,
    error_type,
  });
};

/**
 * Document download.
 *
 * @param {{ document_type?: string, format?: string }} params
 */
export const document_download = ({
  document_type = "unknown",
  format = "unknown",
} = {}) => {
  safeEvent("document_download", {
    document_type,
    format,
  });
};

// ============================================================
// Application Engagement Events
// ============================================================

/**
 * Feature used by the user.
 *
 * @param {{ feature_name: string, location?: string }} params
 */
export const feature_used = ({
  feature_name,
  location,
}) => {
  safeEvent("feature_used", {
    feature_name,
    location: normalizeLocation(location),
  });
};

/**
 * Search performed inside DocVise.
 *
 * Do not send the actual search text if it could contain sensitive data.
 *
 * @param {{ search_type?: string }} params
 */
export const search_performed = ({
  search_type = "general",
} = {}) => {
  safeEvent("search_performed", {
    search_type,
  });
};

// ============================================================
// Tab Visibility Events
// ============================================================

let lastVisibilitySentAt = 0;

const VISIBILITY_THROTTLE_MS = 2000;

/**
 * Browser tab visibility.
 *
 * @param {"hidden"|"visible"} state
 */
export const tab_visibility = (state) => {
  const now = Date.now();

  if (now - lastVisibilitySentAt < VISIBILITY_THROTTLE_MS) {
    return;
  }

  lastVisibilitySentAt = now;

  if (state === "hidden") {
    safeEvent("tab_hidden", {});
  }

  if (state === "visible") {
    safeEvent("tab_visible", {});
  }
};

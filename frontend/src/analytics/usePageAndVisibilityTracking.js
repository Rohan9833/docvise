import { useEffect } from "react";
import { page_view, tab_visibility } from "./events.js";

/**
 * Track SPA page views and browser tab visibility.
 * @param {string} currentPath Current URL/path.
 */
export default function usePageAndVisibilityTracking(currentPath) {
  useEffect(() => {
    if (!currentPath) return;
    page_view(currentPath);
  }, [currentPath]);

  useEffect(() => {
    const onVisibilityChange = () => {
      tab_visibility(document.visibilityState === "hidden" ? "hidden" : "visible");
    };

    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onBlur = () => tab_visibility("hidden");
    const onFocus = () => tab_visibility("visible");

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
}

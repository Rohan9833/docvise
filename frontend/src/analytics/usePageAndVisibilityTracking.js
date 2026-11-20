import { useEffect } from "react";
import { page_view, tab_visibility } from "./events.js";

/**
 * Track SPA page views and browser tab visibility.
 *
 * @param {string} currentPath Current React route/path.
 */
export default function usePageAndVisibilityTracking(currentPath) {
    useEffect(() => {
        if (!currentPath) return;

        const cleanPath = currentPath.replace(/\\/ + $ /, "") || "/";
        page_view(cleanPath);
    }, [currentPath]);

    useEffect(() => {
        const onVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                tab_visibility("hidden");
            } else if (document.visibilityState === "visible") {
                tab_visibility("visible");
            }
        };

        // Track current visibility when the hook mounts.
        onVisibilityChange();

        document.addEventListener("visibilitychange", onVisibilityChange);

        // Fallbacks for browsers or cases where visibility events are missed.
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

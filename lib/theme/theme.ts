// No "use client" here — this file exports plain functions/data, not a component,
// so it's safe to import from both the server (root layout, for themeInitScript)
// and client components (ThemeToggle). getStoredTheme/applyTheme touch the DOM
// directly, so they're only ever actually called from inside client code.
const STORAGE_KEY = "sga-theme";
const CHANGE_EVENT = "sga-theme-change";

export type Theme = "light" | "dark";

// Dark is the default everywhere except a returning visitor who chose light —
// the inline script (themeInitScript below) already applies that before first
// paint, so these helpers only ever need to move between the two.
export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

// Always "dark" — matches what the server (and thus the initial client render,
// before useSyncExternalStore corrects it) has no way to know otherwise.
export function getServerTheme(): Theme {
  return "dark";
}

export function subscribeToThemeChange(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private browsing / storage blocked — theme still applies for this page view.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

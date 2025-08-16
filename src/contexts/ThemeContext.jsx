import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * Theme values: "light" | "dark" | "system"
 * - "system" tracks the OS preference and updates live.
 */
const THEME_KEY = "theme";
const ThemeContext = createContext(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};

// Helper: read persisted theme or fallback to "system"
function getStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {}
  return "system";
}

// Helper: is OS dark right now?
function systemPrefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

// Helper: apply class on <html> and persist when not "system"
function applyThemeToDOM(theme) {
  const isDark = theme === "dark" || (theme === "system" && systemPrefersDark());
  const root = document.documentElement;
  
  // Force remove and add the class to ensure it applies
  root.classList.remove("dark");
  if (isDark) {
    root.classList.add("dark");
  }
  
  // Optional: set data-theme for debugging/analytics
  root.dataset.theme = theme;
  root.dataset.actualTheme = isDark ? "dark" : "light";

  // Persist only explicit choices; keep "system" so we can respect it later
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

export function ThemeProvider({ children }) {
  // Persisted choice: "light" | "dark" | "system"
  const [theme, setTheme] = useState(() => getStoredTheme());

  // Derived boolean that your UI can use directly
  const darkMode = theme === "dark" || (theme === "system" && systemPrefersDark());

  // Avoid duplicate listeners
  const mediaRef = useRef(null);

  // On mount & whenever theme changes, apply to DOM
  useEffect(() => {
    applyThemeToDOM(theme);

    // When in "system" mode, react to OS changes
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mediaRef.current = mq;

      const handler = () => {
        if (theme === "system") applyThemeToDOM("system");
      };

      // modern + legacy
      if (mq.addEventListener) mq.addEventListener("change", handler);
      else mq.addListener?.(handler);

      return () => {
        if (mediaRef.current) {
          if (mq.removeEventListener) mq.removeEventListener("change", handler);
          else mq.removeListener?.(handler);
        }
      };
    }
  }, [theme]);

  // Public API
  const toggleDarkMode = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      return next;
    });
  };

  const value = useMemo(
    () => ({
      theme,                 // "light" | "dark" | "system"
      darkMode,              // boolean
      setTheme,              // setTheme("light" | "dark" | "system")
      toggleDarkMode,        // quick toggle light<->dark
    }),
    [theme, darkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;

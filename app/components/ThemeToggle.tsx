"use client";

import { useEffect, useState } from "react";

// Light/dark toggle. Drives ONLY <html data-theme> + localStorage. It deliberately does NOT
// use the id "theme-toggle-checkbox" or dispatch a 'themeChanged' event — both would
// re-activate dead legacy code in public/legacy/app.js and flip the hero canvas against the
// design intent. The initial attribute is set pre-paint by the css-bootstrap script in
// app/layout.tsx; we read it on mount (null until then) so the icon never causes a hydration
// mismatch.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — ignore */
    }
    setTheme(next);
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={theme === null}
      aria-label={theme === null ? "Theme toggle loading" : isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={`bv-6 inline-flex h-9 w-9 shrink-0 items-center justify-center text-ink/70 transition-colors hover:text-ink ${className}`}
      style={{ background: "var(--tl-card-bg)", boxShadow: "inset 0 0 0 1px var(--tl-card-border)" }}
    >
      {theme === null ? (
        <span className="h-4 w-4" aria-hidden />
      ) : isLight ? (
        // moon → click switches to dark
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      ) : (
        // sun → click switches to light
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}

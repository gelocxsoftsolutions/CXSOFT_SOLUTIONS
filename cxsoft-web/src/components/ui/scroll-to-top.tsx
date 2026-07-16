"use client";

import * as React from "react";
import { cn } from "~/lib/cn";

export function ScrollToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/30 ring-1 ring-inset ring-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-sky-400 hover:shadow-xl hover:shadow-sky-500/40 active:scale-95",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none",
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 0 1-.75-.75V5.56l-3.22 3.22a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L10.75 5.56v10.69A.75.75 0 0 1 10 17Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

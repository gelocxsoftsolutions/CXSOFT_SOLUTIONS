"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "~/lib/cn";

const baseInputClass =
  "w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white/90 ring-1 ring-inset ring-white/10 outline-none transition-colors placeholder:text-white/35 focus:bg-white/8 focus:ring-white/25";

export function DropdownSelect<T extends string>({
  value,
  onChange,
  options,
  className,
  disabled,
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const id = React.useId();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (buttonRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          baseInputClass,
          "flex items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-60",
          open && "ring-white/25 bg-white/8",
          className,
        )}
      >
        <span className="truncate">{value}</span>
        <span className="shrink-0 text-white/60">
          <ChevronIcon
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            role="listbox"
            aria-labelledby={id}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl bg-[#061b33]/95 ring-1 ring-inset ring-white/12 shadow-xl shadow-black/35 backdrop-blur-md"
          >
            <div className="scrollbar-cx max-h-64 overflow-auto p-1">
              {options.map((opt) => {
                const selected = opt === value;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(opt);
                      setOpen(false);
                      buttonRef.current?.focus();
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                      selected
                        ? "bg-sky-500/20 text-white"
                        : "text-white/80 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <span className="truncate">{opt}</span>
                    {selected ? (
                      <span className="text-sky-200">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 0 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a.75.75 0 0 1 .006 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L3.29 8.99a.75.75 0 1 1 1.06-1.06l4.01 4.01 6.72-6.65a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

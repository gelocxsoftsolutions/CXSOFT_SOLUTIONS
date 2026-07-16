"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { ButtonLink } from "~/components/ui/button";
import { Container } from "~/components/ui/container";
import { cn } from "~/lib/cn";

const navItems = [
  { label: "Home", href: "/#top" },
  {
    label: "Services",
    href: "/#services",
    dropdown: [
      { label: "Custom Web Apps", href: "/#services", icon: "code", accent: "sky" },
      {
        label: "Mobile Apps",
        href: "/#services",
        icon: "mobile",
        accent: "violet",
      },
      {
        label: "Softwares",
        href: "/#services",
        icon: "layers",
        accent: "indigo",
      },
      {
        label: "Ecommerce & Payments",
        href: "/#services",
        icon: "cart",
        accent: "amber",
      },
      {
        label: "Automation & Integrations",
        href: "/#services",
        icon: "spark",
        accent: "emerald",
      },
      {
        label: "Server Setup",
        href: "/#services",
        icon: "server",
        accent: "rose",
      },
    ],
  },
  {
    label: "Solutions",
    href: "/#solutions",
    dropdown: [
      {
        label: "Operations Management System",
        href: "/#solutions",
        icon: "settings",
        accent: "sky",
      },
      {
        label: "Customer Portals",
        href: "/#solutions",
        icon: "users",
        accent: "emerald",
      },
      { label: "Website", href: "/#solutions", icon: "globe", accent: "indigo" },
      {
        label: "Ticketing System",
        href: "/#solutions",
        icon: "ticket",
        accent: "amber",
      },
      {
        label: "Mobile App Integration",
        href: "/#solutions",
        icon: "link",
        accent: "violet",
      },
    ],
  },
  {
    label: "Portfolio",
    href: "/#portfolio",
    dropdown: [
      {
        label: "NCT Seafoods Operations Management System",
        href: "/#portfolio",
        icon: "fish",
        accent: "sky",
      },
      {
        label: "CXSOFT SOLUTIONS Ticketing System",
        href: "/#portfolio",
        icon: "ticket",
        accent: "amber",
      },
      {
        label: "Pickleball Reservation and Membership System",
        href: "/#portfolio",
        icon: "ball",
        accent: "emerald",
      },
    ],
  },
  { label: "Blog", href: "/#blog" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
] as const;

function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/cxsoftlogo.png"
        alt="CXSOFT SOLUTIONS"
        width={36}
        height={36}
        className="h-9 w-auto object-contain"
        priority
      />
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-wide text-white">
          CXSOFT
        </div>
        <div className="text-xs font-semibold tracking-widest text-white/70">
          SOLUTIONS
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileDropdown, setMobileDropdown] = React.useState<string | null>(null);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const expanded = activeMenu !== null;

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const cancelClose = React.useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  }, []);

  const scheduleClose = React.useCallback(() => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => setActiveMenu(null), 120);
  }, [cancelClose]);

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-transparent py-3">
        <Container className="max-w-7xl">
          {/* Desktop header bar */}
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-xl ring-1 ring-inset ring-white/15 shadow-lg shadow-black/25 transition-[height] duration-200",
              expanded ? "h-[240px]" : "h-[72px]",
            )}
            onMouseEnter={cancelClose}
            onMouseLeave={() => {
              cancelClose();
              setActiveMenu(null);
            }}
          >
            <div className="flex h-[72px] items-center justify-between px-4 sm:px-8">
              <Link href="/#top" className="shrink-0" onClick={() => setMobileOpen(false)}>
                <Logo />
              </Link>

              <nav className="hidden items-center gap-2 text-sm font-medium text-white/80 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center rounded-full px-3 py-2 transition-all duration-200 hover:bg-white/10 hover:px-4 hover:text-white",
                      activeMenu === item.label && "bg-white/10 text-white",
                    )}
                    onMouseEnter={() => {
                      const hasDropdown = "dropdown" in item;
                      cancelClose();
                      setActiveMenu(hasDropdown ? item.label : null);
                    }}
                    onMouseLeave={() => {
                      const hasDropdown = "dropdown" in item;
                      if (hasDropdown) scheduleClose();
                    }}
                    onFocus={() => {
                      const hasDropdown = "dropdown" in item;
                      cancelClose();
                      setActiveMenu(hasDropdown ? item.label : null);
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <ButtonLink href="/quote" variant="primary" size="sm" className="hidden sm:inline-flex">
                  Get a Quote
                </ButtonLink>
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-white md:hidden"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                  {mobileOpen ? (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="absolute inset-x-0 top-[72px] hidden md:block">
              <Container className="max-w-7xl px-8">
                <div
                  className={cn(
                    "py-3 transition-all duration-200",
                    expanded
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-2 opacity-0 pointer-events-none",
                  )}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  <HeaderDropdown
                    activeMenu={activeMenu}
                    onNavigate={() => setActiveMenu(null)}
                  />
                </div>
              </Container>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300 md:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "relative mt-[84px] mx-3 rounded-2xl bg-slate-800/95 backdrop-blur-xl ring-1 ring-inset ring-white/15 shadow-xl shadow-black/40 transition-all duration-300",
            mobileOpen ? "translate-y-0" : "-translate-y-4",
          )}
        >
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) => {
              const hasDropdown = "dropdown" in item;
              const isOpen = mobileDropdown === item.label;
              return (
                <div key={item.label}>
                  {hasDropdown ? (
                    <button
                      type="button"
                      onClick={() => setMobileDropdown(isOpen ? null : item.label)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {item.label}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
                      >
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )}
                  {hasDropdown && isOpen && (
                    <div className="ml-4 mt-1 mb-2 flex flex-col gap-1 rounded-xl bg-white/5 p-2">
                      {(item as any).dropdown.map((link: any) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => { setMobileOpen(false); setMobileDropdown(null); }}
                          className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mt-2 border-t border-white/10 pt-3">
              <ButtonLink href="/quote" variant="primary" size="md" className="w-full justify-center">
                Get a Quote
              </ButtonLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

type Accent = "sky" | "violet" | "indigo" | "amber" | "emerald" | "rose";

type IconName =
  | "code"
  | "mobile"
  | "layers"
  | "cart"
  | "spark"
  | "server"
  | "settings"
  | "users"
  | "globe"
  | "ticket"
  | "link"
  | "fish"
  | "ball";

const accentStyles: Record<
  Accent,
  { badge: string; icon: string; hover: string }
> = {
  sky: {
    badge: "bg-sky-500/15 ring-sky-300/25",
    icon: "text-sky-200",
    hover: "hover:ring-sky-200/25",
  },
  violet: {
    badge: "bg-violet-500/15 ring-violet-300/25",
    icon: "text-violet-200",
    hover: "hover:ring-violet-200/25",
  },
  indigo: {
    badge: "bg-indigo-500/15 ring-indigo-300/25",
    icon: "text-indigo-200",
    hover: "hover:ring-indigo-200/25",
  },
  amber: {
    badge: "bg-amber-500/15 ring-amber-300/25",
    icon: "text-amber-200",
    hover: "hover:ring-amber-200/25",
  },
  emerald: {
    badge: "bg-emerald-500/15 ring-emerald-300/25",
    icon: "text-emerald-200",
    hover: "hover:ring-emerald-200/25",
  },
  rose: {
    badge: "bg-rose-500/15 ring-rose-300/25",
    icon: "text-rose-200",
    hover: "hover:ring-rose-200/25",
  },
};

function HeaderDropdown({
  activeMenu,
  onNavigate,
}: {
  activeMenu: string | null;
  onNavigate: () => void;
}) {
  const item = navItems.find((nav) => nav.label === activeMenu);
  const links = item && "dropdown" in item ? item.dropdown : undefined;

  if (!links) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => (
        (() => {
          const styles = accentStyles[link.accent];
          return (
        <Link
          key={link.label}
          href={link.href}
          onClick={onNavigate}
          className={cn(
            "group relative flex items-center gap-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 px-4 py-3 ring-1 ring-inset ring-white/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white hover:shadow-md hover:shadow-black/20",
            styles.hover,
          )}
        >
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset transition-colors duration-200 group-hover:bg-white/10",
              styles.badge,
            )}
          >
            <Icon name={link.icon} className={cn("h-5 w-5", styles.icon)} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-white/90 group-hover:text-white">
              {link.label}
            </span>
          </span>
        </Link>
          );
        })()
      ))}
    </div>
  );
}

function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  switch (name) {
    case "code":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M9 18 3 12l6-6" />
          <path d="m15 6 6 6-6 6" />
          <path d="M13 5 11 19" />
        </svg>
      );
    case "mobile":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M10 6h4" />
          <path d="M12 18h.01" />
        </svg>
      );
    case "layers":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="m12 2 9 5-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 17 9 5 9-5" />
        </svg>
      );
    case "cart":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 3H2" />
          <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
          <path d="M17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        </svg>
      );
    case "spark":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 2l1.2 4.2L17.5 8l-4.3 1.8L12 14l-1.2-4.2L6.5 8l4.3-1.8L12 2Z" />
          <path d="M19 11l.8 2.8 2.7 1-2.7 1-.8 2.8-.8-2.8-2.7-1 2.7-1L19 11Z" />
          <path d="M5 12l.7 2.5 2.4.9-2.4.9L5 18.7l-.7-2.5-2.4-.9 2.4-.9L5 12Z" />
        </svg>
      );
    case "server":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" />
          <path d="M4 15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4Z" />
          <path d="M7 7h.01" />
          <path d="M7 17h.01" />
        </svg>
      );
    case "settings":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19.4 15a7.9 7.9 0 0 0 .1-1 7.9 7.9 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a8.1 8.1 0 0 0-1.7-1L13 3h-2l-.9 2.5a8.1 8.1 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.9 7.9 0 0 0-.1 1 7.9 7.9 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1a8.1 8.1 0 0 0 1.7 1L11 21h2l.9-2.5a8.1 8.1 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z" />
        </svg>
      );
    case "users":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "globe":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
          <path d="M2 12h20" />
          <path d="M12 2a15 15 0 0 1 0 20" />
          <path d="M12 2a15 15 0 0 0 0 20" />
        </svg>
      );
    case "ticket":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 9a2 2 0 0 1 2-2h14v4a2 2 0 0 0 0 4v4H6a2 2 0 0 1-2-2V9Z" />
          <path d="M13 7v2" />
          <path d="M13 11v2" />
          <path d="M13 15v2" />
        </svg>
      );
    case "link":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13" />
          <path d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11" />
        </svg>
      );
    case "fish":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M21 12c-2.2 3.5-6 6-10.5 6S2.7 15.5 1 12c1.7-3.5 5.2-6 9.5-6S18.8 8.5 21 12Z" />
          <path d="M10.5 12c0 2.2-1.6 4-3.5 4" />
          <path d="M10.5 12c0-2.2-1.6-4-3.5-4" />
          <path d="M22.5 9.5 21 12l1.5 2.5" />
          <path d="M14 11h.01" />
        </svg>
      );
    case "ball":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
          <path d="M5.5 8.5c3 2 10 2 13 0" />
          <path d="M5.5 15.5c3-2 10-2 13 0" />
        </svg>
      );
  }
}

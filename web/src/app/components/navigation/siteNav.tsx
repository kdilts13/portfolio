'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type FocusEvent } from 'react';

type NavLink = {
  label: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Login', href: '/login' },
  { label: 'AI Tools', href: '/ai-tools' },
  { label: 'National Parks', href: '/parks' },
];

const NAV_SURFACE = 'bg-card';
const NAV_BORDER = 'border-primary-blue/35';

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-[18px] w-[22px]">
      <span
        className={`absolute left-0 top-0 h-[2px] w-full bg-foreground transition-transform duration-200 ${
          open ? 'translate-y-[8px] rotate-45' : ''
        }`}
      />
      <span
        className={`absolute left-0 top-[8px] h-[2px] w-full bg-foreground transition-opacity duration-150 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute left-0 top-[16px] h-[2px] w-full bg-foreground transition-transform duration-200 ${
          open ? 'translate-y-[-8px] -rotate-45' : ''
        }`}
      />
    </span>
  );
}

function CloseIcon() {
  return (
    <span className="relative block h-5 w-5">
      <span className="absolute left-0 top-2.5 block h-[2px] w-full -rotate-45 bg-foreground" />
      <span className="absolute left-0 top-2.5 block h-[2px] w-full rotate-45 bg-foreground" />
    </span>
  );
}

export default function SiteNav() {
  const pathname = usePathname() || '/';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleDesktopBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDesktopOpen(false);
    }
  };

  return (
    <>
      {/* Mobile / tablet top bar with hamburger and slide-out */}
      <header className={`sticky top-0 z-50 border-b ${NAV_BORDER} ${NAV_SURFACE} lg:hidden`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-md p-1 text-foreground transition-colors hover:text-primary-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-green to-primary-blue text-sm font-semibold uppercase text-background shadow-sm">
              KD
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold">Kevin Dilts</span>
              <span className="text-xs text-muted">Full-stack engineer</span>
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-card/80 bg-card/60 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label="Open navigation menu"
          >
            <MenuIcon open={mobileOpen} />
            <span className="text-xs uppercase tracking-[0.2em] text-muted">Menu</span>
          </button>
        </div>

        <div className={`${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
              mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />

          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className={`fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-6 border ${NAV_BORDER} ${NAV_SURFACE} px-6 py-6 shadow-xl transition-transform duration-300 ${
              mobileOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                Navigate
              </p>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="rounded-md p-2 text-foreground transition-colors hover:text-primary-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
                onClick={() => setMobileOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        active
                          ? 'border-primary-blue bg-card text-foreground shadow-sm'
                          : 'border-card/80 text-body hover:border-primary-blue hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* Desktop: hover/focus tab that slides the nav out from the side */}
      <div
        className="hidden lg:block"
        onMouseLeave={() => setDesktopOpen(false)}
        onFocusCapture={() => setDesktopOpen(true)}
        onBlurCapture={handleDesktopBlur}
      >
        <div className="fixed right-0 top-24 z-40">
          <div
            className={`relative w-72 transition-transform duration-300 ease-out ${
              desktopOpen ? 'translate-x-0' : 'translate-x-[calc(100%)]'
            }`}
          >
            <button
              type="button"
              aria-label={desktopOpen ? 'Hide navigation' : 'Show navigation'}
              className={`absolute -left-12 top-6 flex h-12 w-12 items-center justify-center rounded-l-lg border ${NAV_BORDER} ${NAV_SURFACE} text-foreground shadow-md transition-colors hover:border-primary-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue`}
              onMouseEnter={() => setDesktopOpen(true)}
              onClick={() => setDesktopOpen((open) => !open)}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-green to-primary-blue text-xs font-semibold uppercase text-background">
                Nav
              </span>
            </button>

            <div className={`rounded-l-xl border ${NAV_BORDER} ${NAV_SURFACE} px-5 py-5 shadow-xl`}>
              <Link
                href="/"
                className="group flex items-center gap-3 rounded-md p-2 text-foreground transition-colors hover:text-primary-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-green to-primary-blue text-sm font-semibold uppercase text-background shadow-sm">
                  KD
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">Kevin Dilts</span>
                  <span className="text-xs text-muted">Full-stack engineer</span>
                </span>
              </Link>

              <nav aria-label="Primary desktop" className="mt-4">
                <ul className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => {
                    const active = isActivePath(pathname, link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                            active
                              ? 'border-primary-blue bg-card text-foreground shadow-sm'
                              : 'border-card/80 text-body hover:border-primary-blue hover:text-foreground'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

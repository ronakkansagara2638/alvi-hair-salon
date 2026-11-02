"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, site } from "@/lib/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href) =>
    `text-sm transition-colors hover:text-gold-dark ${
      pathname === href ? "text-gold-dark" : "text-ink-soft"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur">
      <div className="wrap flex h-18 items-center justify-between gap-4 py-4">
        <Link href="/" className="leading-none" onClick={() => setOpen(false)}>
          <span className="block font-serif text-2xl tracking-tight text-ink">
            {site.shortName}
          </span>
          <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-gold-dark">
            Family Salon
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className={linkClass("/book")}
            aria-current={pathname === "/book" ? "page" : undefined}
          >
            Book online
          </Link>
        </nav>

        <div className="hidden md:block">
          <Link href="/book" className="btn btn-gold">
            Book an appointment
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 h-px w-4 bg-current transition-transform ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-4 bg-current transition-transform ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-cream md:hidden">
          <div className="wrap flex flex-col gap-1 py-4">
            {[...navLinks, { href: "/book", label: "Book online" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm ${
                  pathname === link.href
                    ? "bg-sand text-gold-dark"
                    : "text-ink-soft hover:bg-sand"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

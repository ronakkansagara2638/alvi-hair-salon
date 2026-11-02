import Link from "next/link";
import { navLinks, site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-sand/50">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-xl">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {site.tagline}
          </p>
        </div>

        <div>
          <p className="eyebrow">Visit</p>
          <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-ink-soft">
            <p>{site.address.line1}</p>
            <p>{site.address.line2}</p>
            <p>{site.address.line3}</p>
            <p>{site.address.city}</p>
          </address>
        </div>

        <div>
          <p className="eyebrow">Hours</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {site.hours.map((entry) => (
              <li key={entry.days} className="flex justify-between gap-4">
                <span>{entry.days}</span>
                <span className="text-muted">{entry.time}</span>
              </li>
            ))}
          </ul>
          <a
            href={site.phoneHref}
            className="mt-4 inline-block text-sm font-medium text-gold-dark hover:underline"
          >
            {site.phone}
          </a>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {[...navLinks, { href: "/book", label: "Book an appointment" }].map(
              (link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold-dark">
                    {link.label}
                  </Link>
                </li>
              )
            )}
            <li>
              <a
                href={site.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold-dark"
              >
                Get directions
              </a>
            </li>
            <li>
              <Link href="/admin" className="text-muted hover:text-gold-dark">
                Staff login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/70">
        <div className="wrap flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Sector 21, Nerul · Navi Mumbai</p>
        </div>
      </div>
    </footer>
  );
}

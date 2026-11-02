import Link from "next/link";
import { site } from "@/lib/site";

export const metadata = {
  title: "Visit us",
  description:
    "The Alvi Family Salon is at Shop E-4, Shiv Parvati CHS, Sector 21, Nerul, Navi Mumbai — opposite Nerul railway station, next to MTNL.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line bg-sand/40">
        <div className="wrap py-16 lg:py-20">
          <p className="eyebrow">Visit us</p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Easy to find, easy to reach
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
            We are on the ground floor of Shiv Parvati CHS in Sector 21, Nerul —
            opposite Nerul railway station and right next to MTNL.
          </p>
        </div>
      </section>

      <div className="wrap grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <div className="card p-6">
            <p className="eyebrow">Address</p>
            <address className="mt-3 space-y-1 text-base not-italic leading-relaxed text-ink-soft">
              <p>{site.address.line1}</p>
              <p>{site.address.line2}</p>
              <p>{site.address.line3}</p>
              <p>{site.address.city}</p>
            </address>
            <a
              href={site.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block text-sm font-medium text-gold-dark underline-offset-4 hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>

          <div className="card p-6">
            <p className="eyebrow">Opening hours</p>
            <ul className="mt-3 divide-y divide-line/80 text-sm">
              {site.hours.map((entry) => (
                <li
                  key={entry.days}
                  className="flex justify-between gap-6 py-3 first:pt-0 last:pb-0"
                >
                  <span className="text-muted">{entry.days}</span>
                  <span className="font-medium">{entry.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Last appointment is taken 45 minutes before closing. Festival
              timings may vary — call ahead on public holidays.
            </p>
          </div>

          <div className="card p-6">
            <p className="eyebrow">Contact</p>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="text-muted">Phone · </span>
                <a href={site.phoneHref} className="font-medium hover:text-gold-dark">
                  {site.phone}
                </a>
              </p>
              <p>
                <span className="text-muted">Email · </span>
                <a
                  href={`mailto:${site.email}`}
                  className="font-medium hover:text-gold-dark"
                >
                  {site.email}
                </a>
              </p>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              For bridal bookings and group appointments, please call us at
              least a week in advance.
            </p>
          </div>

          <Link href="/book" className="btn btn-gold w-full sm:w-auto">
            Book an appointment
          </Link>
        </div>

        <div className="overflow-hidden rounded-[1.6rem] border border-line bg-sand">
          <iframe
            title="Map showing The Alvi Family Salon in Nerul"
            src={site.mapEmbedUrl}
            className="h-[420px] w-full lg:h-full lg:min-h-[560px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
}

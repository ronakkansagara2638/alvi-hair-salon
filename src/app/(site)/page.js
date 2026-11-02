import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { CATEGORIES, servicesByCategory } from "@/lib/services";
import { site } from "@/lib/site";

const photos = {
  hero: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80",
  styling:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
  detail:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
  nails:
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=80",
  barber:
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80",
};

const promises = [
  {
    title: "Family friendly",
    text: "One place for everyone — kids' cuts, men's grooming and ladies' beauty services.",
  },
  {
    title: "Two minutes from the station",
    text: "Just outside Nerul railway station, next to MTNL. Easy to reach on your way home.",
  },
  {
    title: "Honest pricing",
    text: "Prices are listed up front, and we confirm your slot before you come in.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <div className="wrap grid gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
          <div>
            <p className="eyebrow">{site.name} · Nerul</p>
            <h1 className="mt-5 font-serif text-[2.9rem] leading-[1.03] tracking-tight text-ink sm:text-6xl lg:text-[4.2rem]">
              Good hair days,
              <br />
              for the <em className="text-gold">whole family.</em>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
              {site.tagline} Trusted cuts, colour, facials and bridal styling,
              done with care and on time.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/book" className="btn btn-gold">
                Book an appointment
              </Link>
              <a href={site.phoneHref} className="btn btn-outline">
                Call {site.phone}
              </a>
            </div>

            <dl className="mt-10 grid max-w-lg gap-4 border-t border-line pt-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">Open</dt>
                <dd className="mt-1 font-medium">Daily, 10 am – 8 pm</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">Find us</dt>
                <dd className="mt-1 font-medium">Sector 21, Nerul</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">Walk-ins</dt>
                <dd className="mt-1 font-medium">Welcome, subject to slots</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2rem] border border-gold/30"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-sand">
              <Image
                src={photos.hero}
                alt="Styling chairs and mirrors inside The Alvi Family Salon"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-2xl border border-line bg-cream px-5 py-3 shadow-sm sm:left-8">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-dark">
                Today
              </p>
              <p className="mt-1 text-sm font-medium">10:00 am – 8:00 pm</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="wrap grid gap-8 py-12 sm:grid-cols-3">
          {promises.map((item, index) => (
            <div key={item.title} className="flex gap-4">
              <span className="font-serif text-xl text-gold">
                0{index + 1}
              </span>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.1em]">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Services</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
              Everything under one roof
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-medium text-gold-dark underline-offset-4 hover:underline"
          >
            See the full price list →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const items = servicesByCategory(category.id);
            const from = Math.min(...items.map((item) => item.price));
            return (
              <Link
                key={category.id}
                href={`/services#${category.id}`}
                className="card group flex flex-col p-6 transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-sm"
              >
                <h3 className="font-serif text-2xl">{category.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {category.blurb}
                </p>
                <p className="mt-6 text-sm text-ink-soft">
                  From <span className="font-semibold">{formatINR(from)}</span>
                </p>
                <span className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">
                  View services →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-sand/60 py-20">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.6rem]">
            <Image
              src={photos.styling}
              alt="A stylist finishing a haircut at the salon"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">About us</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
              A neighbourhood salon that knows your name
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              The Alvi Family Salon has been part of the Sector 21 neighbourhood
              for years, looking after three generations of the same families.
              Our stylists and beauticians keep things simple: listen first,
              use products that suit your hair and skin, and never rush a
              service.
            </p>
            <ul className="mt-7 grid gap-3 text-sm text-ink-soft">
              {[
                "Senior stylists for cuts, colour and keratin",
                "Separate beauty room for threading, waxing and facials",
                "Bridal packages with trial sessions on request",
                "Kids' haircuts without the fuss",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/book" className="btn btn-gold mt-8">
              Find a time that suits you
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Gallery</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
              Inside the salon
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Warm light, clean stations and a calm corner for beauty services.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { src: photos.detail, alt: "Salon interior with styling mirrors" },
            { src: photos.nails, alt: "Manicure and nail care service" },
            { src: photos.barber, alt: "Men's grooming and beard trim" },
            { src: photos.styling, alt: "Hair styling in progress" },
          ].map((photo, index) => (
            <div
              key={photo.src + index}
              className={`relative overflow-hidden rounded-2xl bg-sand ${
                index === 0 ? "aspect-[4/5] sm:row-span-2 sm:aspect-auto" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-white py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Visit us</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
              Right beside Nerul station
            </h2>
            <address className="mt-6 space-y-1 text-base not-italic leading-relaxed text-ink-soft">
              <p>{site.address.line1}</p>
              <p>{site.address.line2}</p>
              <p>{site.address.line3}</p>
              <p>{site.address.city}</p>
            </address>

            <dl className="mt-7 space-y-3 border-t border-line pt-6 text-sm">
              {site.hours.map((entry) => (
                <div key={entry.days} className="flex justify-between gap-6">
                  <dt className="text-muted">{entry.days}</dt>
                  <dd className="font-medium">{entry.time}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/book" className="btn btn-gold">
                Book an appointment
              </Link>
              <a
                href={site.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                Get directions
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-line bg-sand">
            <iframe
              title="Map showing The Alvi Family Salon in Nerul"
              src={site.mapEmbedUrl}
              className="h-[360px] w-full lg:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}

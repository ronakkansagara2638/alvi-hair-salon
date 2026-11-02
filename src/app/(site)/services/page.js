import Link from "next/link";
import { formatINR } from "@/lib/format";
import { CATEGORIES, servicesByCategory } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata = {
  title: "Services & prices",
  description:
    "Haircuts, colour, keratin, waxing, facials, manicures and bridal makeup — with prices at The Alvi Family Salon, Nerul.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-line bg-sand/40">
        <div className="wrap py-16 lg:py-20">
          <p className="eyebrow">Services & prices</p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Clear prices, no surprises
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
            Every appointment is confirmed by our team before you visit. Prices
            below are starting prices — final cost depends on hair length and
            the products you choose.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-gold">
              Book an appointment
            </Link>
            <a href={site.phoneHref} className="btn btn-outline">
              Call {site.phone}
            </a>
          </div>
        </div>
      </section>

      <div className="wrap space-y-16 py-16">
        {CATEGORIES.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-28">
            <div className="flex flex-col gap-2 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif text-3xl">{category.name}</h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
                  {category.blurb}
                </p>
              </div>
              <Link
                href={`/book?service=${servicesByCategory(category.id)[0].id}`}
                className="text-sm font-medium text-gold-dark underline-offset-4 hover:underline"
              >
                Book {category.name.toLowerCase()} →
              </Link>
            </div>

            <ul className="divide-y divide-line/80">
              {servicesByCategory(category.id).map((service) => (
                <li
                  key={service.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 py-4"
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-muted">
                      {service.duration} min
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    {formatINR(service.price)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="border-t border-line bg-white">
        <div className="wrap flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl">Not sure what to book?</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              Call us and we will suggest the right service and stylist for
              your hair and skin.
            </p>
          </div>
          <a href={site.phoneHref} className="btn btn-gold">
            Talk to the salon
          </a>
        </div>
      </section>
    </>
  );
}

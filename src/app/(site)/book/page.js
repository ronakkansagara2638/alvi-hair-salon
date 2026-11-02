import BookingForm from "@/components/BookingForm";
import { BOOKING_WINDOW_DAYS, addDays, todayIST } from "@/lib/bookings";
import { SERVICES } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book an appointment",
  description:
    "Pick a service, date and time online. The Alvi Family Salon, Sector 21, Nerul — open daily 10 am to 8 pm.",
};

export default async function BookPage({ searchParams }) {
  const params = await searchParams;
  const requested = typeof params?.service === "string" ? params.service : "";
  const initialServiceId = SERVICES.some((service) => service.id === requested)
    ? requested
    : "";
  const today = todayIST();

  return (
    <>
      <section className="border-b border-line bg-sand/40">
        <div className="wrap py-14 lg:py-16">
          <p className="eyebrow">Appointments</p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
            Book your visit
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            Choose a service and a free slot. We will call you to confirm — no
            payment is needed online.
          </p>
        </div>
      </section>

      <div className="wrap grid gap-10 py-14 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="space-y-6 lg:sticky lg:top-28">
          <div className="card p-6">
            <p className="eyebrow">Good to know</p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                Appointments can be requested up to {BOOKING_WINDOW_DAYS} days
                ahead.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                We hold your slot for 15 minutes past the booking time. Please
                call if you are running late.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                Bridal makeup and keratin treatments need a quick phone
                consultation first.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                Cancellations are free — just let us know a few hours in
                advance.
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <p className="eyebrow">The salon</p>
            <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-ink-soft">
              <p>{site.address.line1}</p>
              <p>{site.address.line2}</p>
              <p>{site.address.line3}</p>
              <p>{site.address.city}</p>
            </address>
            <a
              href={site.phoneHref}
              className="mt-4 inline-block text-sm font-semibold text-gold-dark hover:underline"
            >
              {site.phone}
            </a>
            <p className="mt-4 text-xs text-muted">Open daily · 10 am – 8 pm</p>
          </div>
        </div>

        <BookingForm
          today={today}
          maxDate={addDays(today, BOOKING_WINDOW_DAYS)}
          initialServiceId={initialServiceId}
        />
      </div>
    </>
  );
}

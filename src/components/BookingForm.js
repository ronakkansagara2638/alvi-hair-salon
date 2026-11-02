"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDateLong, formatINR, formatTime } from "@/lib/format";
import { CATEGORIES, SERVICES, getService } from "@/lib/services";

function groupServices() {
  return CATEGORIES.map((category) => ({
    ...category,
    items: SERVICES.filter((service) => service.category === category.id),
  }));
}

export default function BookingForm({ today, maxDate, initialServiceId = "" }) {
  const groups = groupServices();
  const [serviceId, setServiceId] = useState(
    initialServiceId || SERVICES[0].id
  );
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [fields, setFields] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    company: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const service = getService(serviceId);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetch(
      `/api/availability?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}`,
      { signal: controller.signal }
    )
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        if (data.error) {
          setError(data.error);
          setSlots([]);
        } else {
          setSlots(data.slots || []);
        }
      })
      .catch((fetchError) => {
        if (active && fetchError.name !== "AbortError") {
          setError("Could not load available times. Please try again.");
        }
      })
      .finally(() => {
        if (active) setSlotsLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [date, serviceId]);

  function resetSlotState() {
    setSlotsLoading(true);
    setTime("");
    setError("");
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!time) {
      setError("Please choose a time slot.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date, time, ...fields }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not book this appointment.");
        return;
      }

      setConfirmation(data.booking);
    } catch {
      setError("Could not reach the salon. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div className="card p-7 sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-xl text-gold-dark">
          ✓
        </div>
        <p className="eyebrow mt-5">Request received</p>
        <h2 className="mt-2 font-serif text-3xl">Thank you, {confirmation.name.split(" ")[0]}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Your appointment is pending confirmation. We will call you on the
          number you shared to confirm it shortly.
        </p>

        <dl className="mt-6 divide-y divide-line/80 rounded-xl border border-line">
          <div className="flex justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-muted">Reference</dt>
            <dd className="font-semibold tracking-wide">{confirmation.id}</dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-muted">Service</dt>
            <dd className="text-right font-medium">{confirmation.serviceName}</dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-muted">When</dt>
            <dd className="text-right font-medium">
              {formatDateLong(confirmation.date)}
              <br />
              {formatTime(confirmation.time)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-muted">Estimated price</dt>
            <dd className="font-medium">{formatINR(confirmation.price)}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setConfirmation(null);
              setTime("");
              setFields({ name: "", phone: "", email: "", notes: "", company: "" });
            }}
          >
            Book another appointment
          </button>
          <Link href="/" className="btn btn-gold">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8" noValidate>
      <div className="space-y-6">
        <div>
          <label className="label" htmlFor="serviceId">
            1 · Choose a service
          </label>
          <select
            id="serviceId"
            className="field"
            value={serviceId}
            onChange={(event) => {
              resetSlotState();
              setServiceId(event.target.value);
            }}
          >
            {groups.map((group) => (
              <optgroup key={group.id} label={group.name}>
                {group.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {formatINR(item.price)} · {item.duration} min
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="date">
            2 · Pick a date
          </label>
          <input
            id="date"
            type="date"
            className="field"
            value={date}
            min={today}
            max={maxDate}
            onChange={(event) => {
              resetSlotState();
              setDate(event.target.value);
            }}
            required
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="label">3 · Pick a time</span>
            {!slotsLoading && slots.length > 0 && (
              <span className="text-xs text-muted">
                {slots.filter((slot) => slot.available).length} slots open
              </span>
            )}
          </div>

          {slotsLoading ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 animate-pulse rounded-lg bg-sand"
                />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="rounded-lg bg-sand/70 px-4 py-3 text-sm text-ink-soft">
              No slots available for this date. Please choose another day.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const selected = slot.time === time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setTime(slot.time)}
                    aria-pressed={selected}
                    className={`rounded-lg border px-2 py-2.5 text-sm transition ${
                      selected
                        ? "border-gold bg-gold text-white"
                        : slot.available
                          ? "border-line bg-white text-ink hover:border-gold hover:text-gold-dark"
                          : "cursor-not-allowed border-line/60 bg-sand/40 text-muted/50 line-through"
                    }`}
                  >
                    {formatTime(slot.time)}
                  </button>
                );
              })}
            </div>
          )}
          {!slotsLoading && slots.length > 0 && !time && (
            <p className="mt-2 text-xs text-muted">
              Times shown are for a {service.duration}-minute appointment.
            </p>
          )}
        </div>

        <div className="border-t border-line pt-6">
          <p className="label">4 · Your details</p>
          <div className="mt-1 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                name="name"
                className="field"
                autoComplete="name"
                value={fields.name}
                onChange={updateField}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted" htmlFor="phone">
                Mobile number
              </label>
              <input
                id="phone"
                name="phone"
                className="field"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="10-digit number"
                value={fields.phone}
                onChange={updateField}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted" htmlFor="email">
                Email <span className="text-muted/70">(optional)</span>
              </label>
              <input
                id="email"
                name="email"
                className="field"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={updateField}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-muted" htmlFor="notes">
                Anything we should know?{" "}
                <span className="text-muted/70">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                className="field min-h-20 resize-y"
                rows={3}
                maxLength={300}
                placeholder="Allergies, preferred stylist, occasion…"
                value={fields.notes}
                onChange={updateField}
              />
            </div>
          </div>
          <input
            type="text"
            name="company"
            value={fields.company}
            onChange={updateField}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
        </div>

        <div className="rounded-xl bg-sand/60 px-4 py-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-ink-soft">{service.name}</span>
            <span className="font-semibold">{formatINR(service.price)}</span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {service.duration} min · {time ? formatTime(time) : "choose a time"} ·{" "}
            {formatDateLong(date)}
          </p>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-gold w-full" disabled={submitting}>
          {submitting ? "Booking…" : "Request appointment"}
        </button>
        <p className="text-center text-xs text-muted">
          No payment needed now. We confirm every appointment by phone.
        </p>
      </div>
    </form>
  );
}

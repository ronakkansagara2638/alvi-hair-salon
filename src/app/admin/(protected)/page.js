import Link from "next/link";
import { deleteAction, setStatusAction } from "@/app/admin/actions";
import ConfirmButton from "@/components/ConfirmButton";
import StatusPill from "@/components/StatusPill";
import {
  STATUSES,
  addDays,
  getDashboardData,
  isValidDate,
  listBookings,
  todayIST,
} from "@/lib/bookings";
import {
  formatDateLong,
  formatDateShort,
  formatINR,
  formatTime,
  initials,
} from "@/lib/format";

export const dynamic = "force-dynamic";

const actionButton =
  "rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-ink-soft transition hover:border-gold hover:text-gold-dark";

function StatusActions({ booking }) {
  const id = <input type="hidden" name="id" value={booking.id} />;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {booking.status === "pending" && (
        <>
          <form action={setStatusAction}>
            {id}
            <input type="hidden" name="status" value="confirmed" />
            <button type="submit" className="rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-white hover:bg-ink-soft">
              Confirm
            </button>
          </form>
          <form action={setStatusAction}>
            {id}
            <input type="hidden" name="status" value="cancelled" />
            <button type="submit" className={actionButton}>
              Decline
            </button>
          </form>
        </>
      )}

      {booking.status === "confirmed" && (
        <>
          <form action={setStatusAction}>
            {id}
            <input type="hidden" name="status" value="completed" />
            <button type="submit" className="rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-white hover:bg-ink-soft">
              Mark done
            </button>
          </form>
          <form action={setStatusAction}>
            {id}
            <input type="hidden" name="status" value="cancelled" />
            <button type="submit" className={actionButton}>
              Cancel
            </button>
          </form>
        </>
      )}

      {booking.status === "cancelled" && (
        <form action={deleteAction}>
          {id}
          <ConfirmButton
            message={`Permanently delete ${booking.id} for ${booking.name}? This cannot be undone.`}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </ConfirmButton>
        </form>
      )}
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function BookingRow({ booking }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-t border-line/80 px-4 py-4 first:border-t-0 sm:px-5">
      <div className="flex min-w-0 flex-1 gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-xs font-semibold text-ink-soft">
          {initials(booking.name)}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold">{booking.name}</p>
            <StatusPill status={booking.status} />
          </div>
          <p className="mt-0.5 text-sm text-ink-soft">{booking.serviceName}</p>
          <p className="mt-1 text-xs text-muted">
            {formatDateShort(booking.date)} · {formatTime(booking.time)} ·{" "}
            {booking.duration} min · {formatINR(booking.price)} ·{" "}
            {booking.id}
          </p>
          <p className="mt-1 text-xs text-muted">
            <a href={`tel:${booking.phone}`} className="hover:text-gold-dark">
              {booking.phone}
            </a>
            {booking.email ? ` · ${booking.email}` : ""}
          </p>
          {booking.notes && (
            <p className="mt-2 rounded-lg bg-sand/50 px-3 py-2 text-xs leading-relaxed text-ink-soft">
              “{booking.notes}”
            </p>
          )}
        </div>
      </div>
      <div className="sm:pt-1">
        <StatusActions booking={booking} />
      </div>
    </div>
  );
}

export default async function AdminDashboardPage({ searchParams }) {
  const params = await searchParams;
  const dateParam = typeof params?.date === "string" ? params.date : "";
  const statusParam = typeof params?.status === "string" ? params.status : "";

  const date = isValidDate(dateParam) ? dateParam : todayIST();
  const status = STATUSES.includes(statusParam) ? statusParam : "";

  const [dashboard, bookings] = await Promise.all([
    getDashboardData(),
    listBookings({ date, status }),
  ]);

  const dayValue = bookings
    .filter((booking) => booking.status !== "cancelled")
    .reduce((total, booking) => total + booking.price, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Appointments</h1>
        <p className="mt-1 text-sm text-muted">
          {formatDateLong(dashboard.today)} · confirm new requests and keep the
          day moving.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today" value={dashboard.todayCount} hint="Bookings on the books" />
        <StatCard label="Pending requests" value={dashboard.pendingCount} hint="Waiting for a call" />
        <StatCard label="Next 7 days" value={dashboard.weekCount} hint="Upcoming appointments" />
        <StatCard
          label="This month"
          value={formatINR(dashboard.monthValue)}
          hint="Confirmed + completed"
        />
      </div>

      <section className="rounded-2xl border border-line bg-white">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em]">
            New requests
          </h2>
          <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-ink-soft">
            {dashboard.pending.length}
          </span>
        </div>
        {dashboard.pending.length === 0 ? (
          <p className="border-t border-line/80 px-5 py-6 text-sm text-muted">
            No pending requests. New online bookings will appear here.
          </p>
        ) : (
          <div className="border-t border-line/80">
            {dashboard.pending.slice(0, 6).map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.1em]">
              Day schedule
            </h2>
            <span className="text-xs text-muted">
              {bookings.length} booking{bookings.length === 1 ? "" : "s"} ·{" "}
              {formatINR(dayValue)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin?date=${addDays(date, -1)}`}
              className="rounded-lg border border-line px-2.5 py-1.5 text-xs hover:border-gold"
              aria-label="Previous day"
            >
              ←
            </Link>
            <Link
              href={`/admin?date=${addDays(date, 1)}`}
              className="rounded-lg border border-line px-2.5 py-1.5 text-xs hover:border-gold"
              aria-label="Next day"
            >
              →
            </Link>
          </div>
        </div>

        <form
          method="get"
          className="flex flex-wrap items-end gap-3 border-t border-line/80 bg-[#fbfaf8] px-5 py-4"
        >
          <div>
            <label className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              defaultValue={date}
              className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm"
            >
              <option value="">All</option>
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value[0].toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white hover:bg-ink-soft">
            Apply
          </button>
          <Link href="/admin" className="pb-2 text-xs text-muted hover:text-ink">
            Today
          </Link>
        </form>

        {bookings.length === 0 ? (
          <p className="border-t border-line/80 px-5 py-8 text-sm text-muted">
            No appointments match this day and filter.
          </p>
        ) : (
          <div className="border-t border-line/80">
            {bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>

      <p className="text-xs text-muted">
        Showing times in IST. Bookings are stored in{" "}
        <code className="rounded bg-white px-1 py-0.5">data/bookings.json</code> on
        the server.
      </p>
    </div>
  );
}

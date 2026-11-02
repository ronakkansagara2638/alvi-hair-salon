# The Alvi Family Salon

Website for The Alvi Family Salon, Sector 21, Nerul, Navi Mumbai — with online
appointment booking and a staff dashboard.

Built with Next.js (App Router) and React. Styling is Tailwind CSS v4. There is
no separate backend service: booking APIs and the office dashboard run on
Next.js server routes and server actions (Node.js). Bookings are stored in
MongoDB Atlas when `MONGODB_URI` is set, and in a local JSON file otherwise.

## Run locally

```bash
npm install
npm run dev
```

- Website: http://localhost:3000
- Booking: http://localhost:3000/book
- Staff dashboard: http://localhost:3000/admin

## Staff dashboard login

Copy `.env.example` to `.env.local` and set `ADMIN_PASSWORD` before going live:

```bash
ADMIN_PASSWORD=your-strong-password
```

Without a `.env.local` the password falls back to `alvi@2026`. The session is a
signed, http-only cookie that lasts 12 hours; changing `ADMIN_PASSWORD` logs
everyone out.

The dashboard shows today's count, pending requests, the next 7 days and the
month's confirmed value, plus a per-day schedule where you can confirm,
decline, complete or delete appointments.

## How booking works

- Slots run every 30 minutes from 10:00 am, last start depends on service
  length, and the salon closes at 8:00 pm IST.
- Two appointments can run at the same time; a slot is marked unavailable once
  that is reached.
- Requests are created as `pending` and are confirmed by the salon team.
- Bookings can be made up to 30 days ahead and not in the past (all times IST).
- Each booking gets a reference like `ALV-7KQ2M`.

Locally, with no `MONGODB_URI`, bookings live in `data/bookings.json`, created
automatically and git-ignored. To start fresh, stop the server and delete that
file. `src/lib/store.js` is the only storage boundary — everything else calls
its four functions (`listRecords`, `insertRecord`, `setRecordStatus`,
`removeRecord`).

## Editing content

- **Contact details, hours, map link** — `src/lib/site.js`
  (the phone number and email there are placeholders, replace them).
- **Services, prices, durations** — `src/lib/services.js`.
- **Salon hours / slot rules** — `OPEN_MINUTES`, `CLOSE_MINUTES`, `CAPACITY` and
  `BOOKING_WINDOW_DAYS` at the top of `src/lib/bookings.js`.
- **Photos** — remote Unsplash URLs in `src/app/(site)/page.js`; replace with
  the salon's own photos in `public/` for production.

## Deploying to Vercel

Vercel's file system is read-only and resets on every deploy, so the site needs
MongoDB Atlas for storage. The local JSON file keeps working for `npm run dev`.

1. Create a free MongoDB Atlas cluster (M0), add a database user, and allow
   access from Vercel — network access `0.0.0.0/0` is the simplest option.
2. Import this folder into Vercel (or run `npx vercel`).
3. In **Project → Settings → Environment Variables** add, for Production,
   Preview and Development:
   - `MONGODB_URI` — the `mongodb+srv://…` connection string
   - `ADMIN_PASSWORD` — a strong password for `/admin`
4. Deploy. Open the site, make a test booking, and confirm it appears at
   `/admin`. Then delete the test booking.

The first booking creates the `bookings` collection automatically. The booking
reference is also the document `_id`, so duplicates are rejected by the database.

Any other Node host works too (`npm run build && npm start`), with either
storage.

import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Staff login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }) {
  if (await isAdmin()) redirect("/admin");

  const params = await searchParams;
  const hasError = params?.error === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-serif text-2xl">The Alvi</p>
          <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-gold-dark">
            Family Salon
          </p>
        </div>

        <form action={loginAction} className="card mt-8 p-7">
          <h1 className="font-serif text-2xl">Staff login</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage appointment requests.
          </p>

          <label className="label mt-6" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="field"
            autoComplete="current-password"
            required
            autoFocus
          />

          {hasError && (
            <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              Incorrect password. Please try again.
            </p>
          )}

          <button type="submit" className="btn btn-gold mt-6 w-full">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Set <code className="rounded bg-sand px-1 py-0.5">ADMIN_PASSWORD</code> in
          your environment to change this password.
        </p>
      </div>
    </div>
  );
}

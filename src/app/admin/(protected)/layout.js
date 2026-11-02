import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { isAdmin } from "@/lib/auth";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#f6f4f1]">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-serif text-sm text-cream">
              A
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">{site.name}</p>
              <p className="text-xs text-muted">Appointment dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-muted hover:text-ink">
              View website
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-ink-soft hover:border-gold hover:text-gold-dark"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
    </div>
  );
}

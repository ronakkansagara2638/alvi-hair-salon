"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  checkPassword,
  isAdmin,
  sessionCookie,
} from "@/lib/auth";
import {
  BookingError,
  deleteBooking,
  updateBookingStatus,
} from "@/lib/bookings";

export async function loginAction(formData) {
  const password = formData.get("password");

  if (!checkPassword(password)) {
    redirect("/admin/login?error=1");
  }

  const cookie = sessionCookie();
  const store = await cookies();
  store.set(cookie.name, cookie.value, cookie.options);
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

export async function setStatusAction(formData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  try {
    await updateBookingStatus(id, status);
  } catch (error) {
    if (!(error instanceof BookingError)) throw error;
  }

  revalidatePath("/admin");
}

export async function deleteAction(formData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  try {
    await deleteBooking(id);
  } catch (error) {
    if (!(error instanceof BookingError)) throw error;
  }

  revalidatePath("/admin");
}

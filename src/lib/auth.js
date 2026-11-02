import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "alvi_admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "alvi@2026";

function sessionToken(password) {
  return crypto
    .createHmac("sha256", "alvi-salon-admin-session")
    .update(password)
    .digest("hex");
}

export async function isAdmin() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === sessionToken(ADMIN_PASSWORD);
}

export function sessionCookie() {
  return {
    name: ADMIN_COOKIE,
    value: sessionToken(ADMIN_PASSWORD),
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12,
    },
  };
}

export function checkPassword(candidate) {
  const expected = Buffer.from(ADMIN_PASSWORD);
  const given = Buffer.from(String(candidate || ""));
  if (expected.length !== given.length) return false;
  return crypto.timingSafeEqual(expected, given);
}

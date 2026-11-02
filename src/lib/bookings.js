import crypto from "node:crypto";
import { getService } from "./services";
import {
  insertRecord,
  listRecords,
  removeRecord,
  setRecordStatus,
} from "./store";

export const OPEN_MINUTES = 10 * 60; // 10:00 am
export const CLOSE_MINUTES = 20 * 60; // 8:00 pm
export const SLOT_STEP = 30;
export const CAPACITY = 2; // appointments that may run at the same time
export const BOOKING_WINDOW_DAYS = 30;
export const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export class BookingError extends Error {}

/* ---------------------------------- time ---------------------------------- */

function istParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type) => parts.find((part) => part.type === type)?.value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function todayIST() {
  return istParts().date;
}

function nowMinutesIST() {
  return istParts().minutes;
}

export function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().slice(0, 10) === value;
}

export function addDays(dateStr, days) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

export function slotTimes(duration) {
  const slots = [];
  for (let start = OPEN_MINUTES; start + duration <= CLOSE_MINUTES; start += SLOT_STEP) {
    slots.push(minutesToTime(start));
  }
  return slots;
}

/* --------------------------------- helpers -------------------------------- */

function overlaps(booking, start, end) {
  const bookingStart = timeToMinutes(booking.time);
  const bookingEnd = bookingStart + (booking.duration || 0);
  return bookingStart < end && bookingEnd > start;
}

/* ------------------------------- validation ------------------------------- */

function cleanText(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalisePhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function validateDetails({ name, phone, email, notes }) {
  const cleanName = cleanText(name, 60);
  if (cleanName.length < 2) {
    throw new BookingError("Please enter your full name.");
  }

  const cleanPhone = normalisePhone(phone);
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    throw new BookingError("Please enter a valid 10-digit Indian mobile number.");
  }

  const cleanEmail = cleanText(email, 120);
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new BookingError("Please enter a valid email address, or leave it blank.");
  }

  return {
    name: cleanName,
    phone: cleanPhone,
    email: cleanEmail,
    notes: cleanText(notes, 300),
  };
}

function validateSchedule(date, time, service) {
  if (!isValidDate(date)) {
    throw new BookingError("Please choose a valid date.");
  }

  const today = todayIST();
  if (date < today) {
    throw new BookingError("That date has already passed. Please pick another day.");
  }
  if (date > addDays(today, BOOKING_WINDOW_DAYS)) {
    throw new BookingError(
      `Appointments can be booked up to ${BOOKING_WINDOW_DAYS} days in advance.`
    );
  }

  if (!slotTimes(service.duration).includes(time)) {
    throw new BookingError("That time is not available for this service.");
  }

  if (date === today && timeToMinutes(time) <= nowMinutesIST()) {
    throw new BookingError("That time has already passed. Please pick a later slot.");
  }
}

/* -------------------------------- bookings -------------------------------- */

export async function listBookings({ date, status } = {}) {
  const bookings = await listRecords();
  return bookings
    .filter((booking) => (date ? booking.date === date : true))
    .filter((booking) => (status ? booking.status === status : true))
    .sort((a, b) =>
      a.date === b.date
        ? a.time.localeCompare(b.time)
        : a.date.localeCompare(b.date)
    );
}

export async function getAvailability(date, serviceId) {
  const service = getService(serviceId);
  if (!service || !isValidDate(date)) {
    throw new BookingError("Please choose a service and date first.");
  }

  const today = todayIST();
  const bookings = (await listRecords()).filter(
    (booking) => booking.date === date && booking.status !== "cancelled"
  );

  const isPastDate = date < today;
  const now = nowMinutesIST();

  return slotTimes(service.duration).map((time) => {
    const start = timeToMinutes(time);
    const end = start + service.duration;
    const taken = bookings.filter((booking) => overlaps(booking, start, end)).length;
    const inPast = date === today && start <= now;
    return {
      time,
      available: !isPastDate && !inPast && taken < CAPACITY,
    };
  });
}

function makeReference(bookings) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const bytes = crypto.randomBytes(5);
    let suffix = "";
    for (const byte of bytes) suffix += alphabet[byte % alphabet.length];
    const reference = `ALV-${suffix}`;
    if (!bookings.some((booking) => booking.id === reference)) return reference;
  }
  throw new BookingError("Could not create a booking reference. Please try again.");
}

export async function createBooking(input) {
  const service = getService(input?.serviceId);
  if (!service) {
    throw new BookingError("Please choose a service.");
  }

  const details = validateDetails(input || {});
  const date = String(input.date || "");
  const time = String(input.time || "");
  validateSchedule(date, time, service);

  const bookings = await listRecords();
  const active = bookings.filter(
    (booking) => booking.date === date && booking.status !== "cancelled"
  );

  const start = timeToMinutes(time);
  const end = start + service.duration;
  const taken = active.filter((booking) => overlaps(booking, start, end)).length;
  if (taken >= CAPACITY) {
    throw new BookingError("That slot was just taken. Please choose another time.");
  }

  const duplicate = active.find(
    (booking) => booking.phone === details.phone && booking.time === time
  );
  if (duplicate) {
    throw new BookingError(
      "You already have an appointment at this time. Please call us to change it."
    );
  }

  const now = new Date().toISOString();
  const booking = {
    id: makeReference(bookings),
    serviceId: service.id,
    serviceName: service.name,
    duration: service.duration,
    price: service.price,
    date,
    time,
    ...details,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  try {
    await insertRecord(booking);
  } catch (error) {
    // Duplicate booking reference — the unique id rejected it.
    if (error?.code === 11000) {
      throw new BookingError("Please try again.");
    }
    throw error;
  }

  return booking;
}

export async function updateBookingStatus(id, status) {
  if (!STATUSES.includes(status)) {
    throw new BookingError("Unknown booking status.");
  }

  const booking = await setRecordStatus(id, status);
  if (!booking) throw new BookingError("Booking not found.");
  return booking;
}

export async function deleteBooking(id) {
  const removed = await removeRecord(id);
  if (!removed) throw new BookingError("Booking not found.");
}

export async function getDashboardData() {
  const today = todayIST();
  const bookings = await listRecords();
  const active = bookings.filter((booking) => booking.status !== "cancelled");

  const pending = bookings
    .filter((booking) => booking.status === "pending")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const upcoming = active
    .filter(
      (booking) =>
        booking.status !== "completed" &&
        `${booking.date}${booking.time}` >= `${today}00:00`
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 5);

  const weekEnd = addDays(today, 7);
  const month = today.slice(0, 7);

  return {
    today,
    todayCount: active.filter((booking) => booking.date === today).length,
    pendingCount: pending.length,
    weekCount: active.filter(
      (booking) => booking.date >= today && booking.date <= weekEnd
    ).length,
    monthValue: active
      .filter(
        (booking) =>
          booking.date.slice(0, 7) === month &&
          (booking.status === "confirmed" || booking.status === "completed")
      )
      .reduce((total, booking) => total + (booking.price || 0), 0),
    pending,
    upcoming,
  };
}

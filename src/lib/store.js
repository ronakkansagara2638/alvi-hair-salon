import { promises as fs } from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";

// Bookings live in MongoDB Atlas when MONGODB_URI is set (required on Vercel,
// where the file system is read-only and reset on every deploy). Locally, with
// no URI, they fall back to a JSON file so `npm run dev` works with no setup.
export const usingDatabase = Boolean(process.env.MONGODB_URI);

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

/* ------------------------------ file backend ------------------------------ */

// Serialise read-modify-write cycles so two simultaneous bookings cannot
// overwrite each other's file contents.
let queue = Promise.resolve();
function withLock(task) {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
}

async function readFile() {
  try {
    const raw = await fs.readFile(BOOKINGS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeFile(bookings) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tempFile = `${BOOKINGS_FILE}.tmp`;
  await fs.writeFile(tempFile, `${JSON.stringify(bookings, null, 2)}\n`);
  await fs.rename(tempFile, BOOKINGS_FILE);
}

/* ----------------------------- mongo backend ------------------------------ */

// Cached on globalThis so warm serverless invocations reuse one connection
// instead of opening a pool per request.
function mongoClient() {
  if (!globalThis.__alviMongoClient) {
    const client = new MongoClient(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    });
    globalThis.__alviMongoClient = client.connect().catch((error) => {
      globalThis.__alviMongoClient = null;
      throw error;
    });
  }
  return globalThis.__alviMongoClient;
}

async function collection() {
  const client = await mongoClient();
  const db = client.db(process.env.MONGODB_DB || "alvi-salon");
  return db.collection("bookings");
}

// `_id` mirrors our own booking reference, so it doubles as a unique index.
function strip(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return rest;
}

/* --------------------------------- storage -------------------------------- */

export async function listRecords() {
  if (usingDatabase) {
    const docs = await (await collection()).find({}).toArray();
    return docs.map(strip);
  }
  return readFile();
}

export async function insertRecord(booking) {
  if (usingDatabase) {
    await (await collection()).insertOne({ _id: booking.id, ...booking });
    return booking;
  }

  return withLock(async () => {
    const bookings = await readFile();
    bookings.push(booking);
    await writeFile(bookings);
    return booking;
  });
}

export async function setRecordStatus(id, status) {
  const updatedAt = new Date().toISOString();

  if (usingDatabase) {
    const result = await (await collection()).findOneAndUpdate(
      { _id: id },
      { $set: { status, updatedAt } },
      { returnDocument: "after" }
    );
    // Driver v6+ returns the document, older versions wrapped it in `value`.
    return strip(result?.value ?? result);
  }

  return withLock(async () => {
    const bookings = await readFile();
    const booking = bookings.find((entry) => entry.id === id);
    if (!booking) return null;

    booking.status = status;
    booking.updatedAt = updatedAt;
    await writeFile(bookings);
    return booking;
  });
}

export async function removeRecord(id) {
  if (usingDatabase) {
    const result = await (await collection()).deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  return withLock(async () => {
    const bookings = await readFile();
    const remaining = bookings.filter((entry) => entry.id !== id);
    if (remaining.length === bookings.length) return false;
    await writeFile(remaining);
    return true;
  });
}

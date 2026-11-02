import { BookingError, createBooking } from "@/lib/bookings";

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (payload?.company) {
    // Honeypot field filled in by a bot.
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const booking = await createBooking(payload || {});
    return Response.json(
      {
        booking: {
          id: booking.id,
          serviceName: booking.serviceName,
          price: booking.price,
          duration: booking.duration,
          date: booking.date,
          time: booking.time,
          name: booking.name,
          status: booking.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof BookingError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("Failed to create booking", error);
    return Response.json(
      { error: "Something went wrong. Please call the salon to book." },
      { status: 500 }
    );
  }
}

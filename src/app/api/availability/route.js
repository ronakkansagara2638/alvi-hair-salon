import { BookingError, getAvailability, isValidDate } from "@/lib/bookings";
import { SERVICES } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || "";
  const serviceId = searchParams.get("serviceId") || "";

  if (!isValidDate(date) || !SERVICES.some((service) => service.id === serviceId)) {
    return Response.json(
      { error: "Please choose a valid service and date." },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailability(date, serviceId);
    return Response.json({ date, serviceId, slots });
  } catch (error) {
    if (error instanceof BookingError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}

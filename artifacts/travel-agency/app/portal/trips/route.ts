import { NextRequest, NextResponse } from "next/server";

const MOCK_DESTINATIONS = [
  { id: "1", name: "Santorini", country: "Greece", bookings: 142, revenue: 284000 },
  { id: "2", name: "Kyoto", country: "Japan", bookings: 118, revenue: 236000 },
  { id: "3", name: "Amalfi Coast", country: "Italy", bookings: 97, revenue: 291000 },
  { id: "4", name: "Machu Picchu", country: "Peru", bookings: 84, revenue: 168000 },
  { id: "5", name: "Bora Bora", country: "French Polynesia", bookings: 71, revenue: 426000 },
  { id: "6", name: "Patagonia", country: "Argentina", bookings: 53, revenue: 212000 },
  { id: "7", name: "Marrakech", country: "Morocco", bookings: 48, revenue: 96000 },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);
    const country = searchParams.get("country");

    let destinations = MOCK_DESTINATIONS;

    if (country) {
      destinations = destinations.filter((d) =>
        d.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    const paginated = destinations.slice(offset, offset + limit);

    return NextResponse.json({
      destinations: paginated,
      total: destinations.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[GET /api/trips]", error);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name?: string;
      country?: string;
      departureDate?: string;
      returnDate?: string;
    };

    const { name, country, departureDate, returnDate } = body;

    if (!name || !country || !departureDate || !returnDate) {
      return NextResponse.json(
        { error: "Missing required fields: name, country, departureDate, returnDate" },
        { status: 400 }
      );
    }

    const newTrip = {
      id: crypto.randomUUID(),
      name,
      country,
      departureDate,
      returnDate,
      bookings: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ trip: newTrip }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/trips]", error);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}

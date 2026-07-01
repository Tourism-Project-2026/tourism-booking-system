import { NextRequest, NextResponse } from "next/server";

type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";

const MOCK_BOOKINGS = [
  {
    id: "a1b2c3d4-0001",
    clientName: "Elena Vasquez",
    destination: "Santorini, Greece",
    departureDate: "2025-08-14",
    returnDate: "2025-08-24",
    status: "confirmed" as BookingStatus,
    amount: 6800,
    passengers: 2,
  },
  {
    id: "a1b2c3d4-0002",
    clientName: "Marcus Chen",
    destination: "Kyoto, Japan",
    departureDate: "2025-09-02",
    returnDate: "2025-09-16",
    status: "confirmed" as BookingStatus,
    amount: 9400,
    passengers: 2,
  },
  {
    id: "a1b2c3d4-0003",
    clientName: "Amara Okonkwo",
    destination: "Amalfi Coast, Italy",
    departureDate: "2025-07-28",
    returnDate: "2025-08-07",
    status: "pending" as BookingStatus,
    amount: 12500,
    passengers: 4,
  },
  {
    id: "a1b2c3d4-0004",
    clientName: "Thomas Renner",
    destination: "Machu Picchu, Peru",
    departureDate: "2025-10-11",
    returnDate: "2025-10-21",
    status: "confirmed" as BookingStatus,
    amount: 7200,
    passengers: 2,
  },
  {
    id: "a1b2c3d4-0005",
    clientName: "Sophia Laurent",
    destination: "Bora Bora, French Polynesia",
    departureDate: "2025-11-03",
    returnDate: "2025-11-10",
    status: "pending" as BookingStatus,
    amount: 18900,
    passengers: 2,
  },
  {
    id: "a1b2c3d4-0006",
    clientName: "David Kim",
    destination: "Patagonia, Argentina",
    departureDate: "2025-03-15",
    returnDate: "2025-03-29",
    status: "completed" as BookingStatus,
    amount: 8700,
    passengers: 3,
  },
  {
    id: "a1b2c3d4-0007",
    clientName: "Nadia Petrov",
    destination: "Marrakech, Morocco",
    departureDate: "2025-06-01",
    returnDate: "2025-06-08",
    status: "cancelled" as BookingStatus,
    amount: 3200,
    passengers: 2,
  },
  {
    id: "a1b2c3d4-0008",
    clientName: "Carlos Mendoza",
    destination: "Santorini, Greece",
    departureDate: "2025-09-20",
    returnDate: "2025-09-30",
    status: "confirmed" as BookingStatus,
    amount: 7400,
    passengers: 2,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);
    const status = searchParams.get("status") as BookingStatus | null;
    const clientName = searchParams.get("clientName");

    let bookings = MOCK_BOOKINGS;

    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }
    if (clientName) {
      bookings = bookings.filter((b) =>
        b.clientName.toLowerCase().includes(clientName.toLowerCase())
      );
    }

    const paginated = bookings.slice(offset, offset + limit);

    return NextResponse.json({
      bookings: paginated,
      total: bookings.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[GET /api/bookings]", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      clientName?: string;
      destination?: string;
      departureDate?: string;
      returnDate?: string;
      passengers?: number;
      amount?: number;
    };

    const { clientName, destination, departureDate, returnDate, passengers, amount } = body;

    if (!clientName || !destination || !departureDate || !returnDate || !passengers || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = {
      id: crypto.randomUUID(),
      clientName,
      destination,
      departureDate,
      returnDate,
      status: "pending" as BookingStatus,
      amount,
      passengers,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/bookings]", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

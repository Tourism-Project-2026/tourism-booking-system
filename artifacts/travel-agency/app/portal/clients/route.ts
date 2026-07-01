import { NextRequest, NextResponse } from "next/server";

const MOCK_CLIENTS = [
  {
    id: "c001",
    name: "Elena Vasquez",
    email: "elena.vasquez@email.com",
    phone: "+1-555-0101",
    country: "United States",
    totalBookings: 4,
    totalSpent: 28400,
    loyaltyTier: "gold",
    joinedAt: "2022-03-15",
    lastBookingAt: "2025-07-01",
  },
  {
    id: "c002",
    name: "Marcus Chen",
    email: "marcus.chen@email.com",
    phone: "+1-555-0102",
    country: "United States",
    totalBookings: 7,
    totalSpent: 61200,
    loyaltyTier: "platinum",
    joinedAt: "2021-08-22",
    lastBookingAt: "2025-06-28",
  },
  {
    id: "c003",
    name: "Amara Okonkwo",
    email: "amara.o@email.com",
    phone: "+44-20-7946-0958",
    country: "United Kingdom",
    totalBookings: 2,
    totalSpent: 18700,
    loyaltyTier: "silver",
    joinedAt: "2024-01-10",
    lastBookingAt: "2025-07-10",
  },
  {
    id: "c004",
    name: "Thomas Renner",
    email: "t.renner@email.de",
    phone: "+49-30-1234567",
    country: "Germany",
    totalBookings: 5,
    totalSpent: 42100,
    loyaltyTier: "gold",
    joinedAt: "2022-11-05",
    lastBookingAt: "2025-05-14",
  },
  {
    id: "c005",
    name: "Sophia Laurent",
    email: "sophia.laurent@email.fr",
    phone: "+33-1-23-45-67-89",
    country: "France",
    totalBookings: 3,
    totalSpent: 31400,
    loyaltyTier: "gold",
    joinedAt: "2023-06-20",
    lastBookingAt: "2025-07-15",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);
    const tier = searchParams.get("tier");
    const search = searchParams.get("search");

    let clients = MOCK_CLIENTS;

    if (tier) {
      clients = clients.filter((c) => c.loyaltyTier === tier);
    }
    if (search) {
      const q = search.toLowerCase();
      clients = clients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    const paginated = clients.slice(offset, offset + limit);

    return NextResponse.json({
      clients: paginated,
      total: clients.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("[GET /api/clients]", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name?: string;
      email?: string;
      phone?: string;
      country?: string;
    };

    const { name, email, phone, country } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Missing required fields: name, email" },
        { status: 400 }
      );
    }

    const client = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone ?? null,
      country: country ?? null,
      totalBookings: 0,
      totalSpent: 0,
      loyaltyTier: "standard",
      joinedAt: new Date().toISOString().split("T")[0],
      lastBookingAt: null,
    };

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/clients]", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

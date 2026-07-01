import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trips } from "@/db/schema";
import type { NewTrip } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const rows = await db.select().from(trips).orderBy(desc(trips.created_at)).limit(limit).offset(offset);

    return NextResponse.json({ trips: rows, limit, offset });
  } catch (error) {
    console.error("[GET /portal/trips]", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name?: string;
      destination?: string;
      description?: string;
      start_date?: string;
      end_date?: string;
      price_per_person?: number;
      status?: string;
      capacity?: number;
    };

    if (!body.name?.trim() || !body.destination?.trim()) {
      return NextResponse.json(
        { error: "name and destination are required" },
        { status: 400 }
      );
    }

    const newTrip: NewTrip = {
      name: body.name.trim(),
      destination: body.destination.trim(),
      description: body.description?.trim() ?? null,
      start_date: body.start_date?.trim() ?? null,
      end_date: body.end_date?.trim() ?? null,
      price_per_person: body.price_per_person ?? null,
      status: body.status ?? "Upcoming",
      capacity: body.capacity ?? null,
    };

    const [inserted] = await db.insert(trips).values(newTrip).returning();
    return NextResponse.json({ trip: inserted }, { status: 201 });
  } catch (error) {
    console.error("[POST /portal/trips]", error);
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}

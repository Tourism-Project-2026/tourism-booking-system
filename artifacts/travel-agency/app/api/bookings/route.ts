import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/db/schema";
import type { NewBooking } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const rows = await db.select().from(bookings).limit(limit).offset(offset);

    return NextResponse.json({
      bookings: rows,
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
      client_name?: string;
      phone?: string;
      destination_description?: string;
      trip_period?: string;
    };

    const { client_name, phone, destination_description, trip_period } = body;

    if (!client_name?.trim()) {
      return NextResponse.json(
        { error: "client_name is required" },
        { status: 400 }
      );
    }

    const newBooking: NewBooking = {
      client_name: client_name.trim(),
      phone: phone?.trim() ?? null,
      destination_description: destination_description?.trim() ?? null,
      trip_period: trip_period?.trim() ?? null,
      status: "New",
    };

    const [inserted] = await db.insert(bookings).values(newBooking).returning();

    return NextResponse.json({ booking: inserted }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/bookings]", error);
    return NextResponse.json(
      { error: "Failed to save booking" },
      { status: 500 }
    );
  }
}

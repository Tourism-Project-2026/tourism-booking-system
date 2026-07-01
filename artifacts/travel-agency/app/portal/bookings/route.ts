import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, clients } from "@/db/schema";
import type { NewBooking } from "@/db/schema";
import { desc, or, eq, ilike } from "drizzle-orm";

function sanitize(value: string, maxLength = 500): string {
  return value
    .trim()
    .replace(/[<>]/g, "")       // strip HTML angle brackets
    .replace(/\0/g, "")          // strip null bytes
    .slice(0, maxLength);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const rows = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.created_at))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ bookings: rows, limit, offset });
  } catch (error) {
    console.error("[GET /portal/bookings]", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      client_name?: string;
      phone?: string;
      destination_description?: string;
      trip_period?: string;
      notes?: string;
    };

    const { client_name, phone, destination_description, trip_period, notes } = body;

    // Validate all four required fields
    const missing: string[] = [];
    if (!client_name?.trim())             missing.push("client_name");
    if (!phone?.trim())                   missing.push("phone");
    if (!destination_description?.trim()) missing.push("destination_description");
    if (!trip_period?.trim())             missing.push("trip_period");

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Sanitize all inputs
    const cleanName        = sanitize(client_name!, 200);
    const cleanPhone       = sanitize(phone!, 50);
    const cleanDestination = sanitize(destination_description!, 500);
    const cleanPeriod      = sanitize(trip_period!, 200);
    const cleanNotes       = notes?.trim() ? sanitize(notes, 2000) : null;

    const newBooking: NewBooking = {
      client_name: cleanName,
      phone: cleanPhone,
      destination_description: cleanDestination,
      trip_period: cleanPeriod,
      notes: cleanNotes,
      status: "New",
    };

    const [inserted] = await db.insert(bookings).values(newBooking).returning();

    // Auto-register client if not already in the clients table
    try {
      const condition = or(
        eq(clients.phone, cleanPhone),
        ilike(clients.name, cleanName)
      );
      const existing = await db
        .select({ id: clients.id })
        .from(clients)
        .where(condition)
        .limit(1);

      if (existing.length === 0) {
        await db.insert(clients).values({ name: cleanName, phone: cleanPhone });
      }
    } catch (clientErr) {
      // Never fail the booking if client auto-registration has an issue
      console.error("[POST /portal/bookings] client auto-register:", clientErr);
    }

    return NextResponse.json({ booking: inserted }, { status: 201 });
  } catch (error) {
    console.error("[POST /portal/bookings]", error);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }
}

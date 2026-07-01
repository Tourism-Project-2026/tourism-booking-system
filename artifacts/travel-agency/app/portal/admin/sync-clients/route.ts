import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, clients } from "@/db/schema";
import { or, eq, ilike } from "drizzle-orm";

// One-time backfill: creates a client record for every booking that has no matching client.
export async function POST() {
  try {
    const allBookings = await db.select().from(bookings);
    let created = 0;
    let skipped = 0;

    for (const booking of allBookings) {
      const nameVal = booking.client_name;
      const phoneVal = booking.phone;

      const condition = phoneVal
        ? or(eq(clients.phone, phoneVal), ilike(clients.name, nameVal))
        : ilike(clients.name, nameVal);

      const existing = await db.select({ id: clients.id }).from(clients).where(condition).limit(1);

      if (existing.length === 0) {
        await db.insert(clients).values({ name: nameVal, phone: phoneVal ?? null });
        created++;
      } else {
        skipped++;
      }
    }

    return NextResponse.json({
      total: allBookings.length,
      created,
      skipped,
      message: `Created ${created} new client record(s) from ${allBookings.length} bookings`,
    });
  } catch (error) {
    console.error("[POST /portal/admin/sync-clients]", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

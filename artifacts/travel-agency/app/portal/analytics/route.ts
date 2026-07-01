import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, clients, trips } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const [bookingTotal, clientTotal, tripTotal, statusRows, recentRows] = await Promise.all([
      db.select({ total: sql<number>`count(*)::int` }).from(bookings),
      db.select({ total: sql<number>`count(*)::int` }).from(clients),
      db.select({ total: sql<number>`count(*)::int` }).from(trips),
      db
        .select({
          status: bookings.status,
          count: sql<number>`count(*)::int`,
        })
        .from(bookings)
        .groupBy(bookings.status),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(bookings)
        .where(sql`created_at >= now() - interval '30 days'`),
    ]);

    const totalBookings = bookingTotal[0]?.total ?? 0;
    const totalClients = clientTotal[0]?.total ?? 0;
    const totalTrips = tripTotal[0]?.total ?? 0;
    const recentBookings = recentRows[0]?.count ?? 0;

    const statusMap: Record<string, number> = {};
    for (const row of statusRows) {
      statusMap[row.status] = row.count;
    }

    return NextResponse.json({
      stats: {
        totalBookings,
        totalClients,
        totalTrips,
        recentBookings,
        newBookings: statusMap["New"] ?? 0,
        confirmedBookings: statusMap["Confirmed"] ?? 0,
        completedBookings: statusMap["Completed"] ?? 0,
        cancelledBookings: statusMap["Cancelled"] ?? 0,
      },
      statusBreakdown: statusRows,
    });
  } catch (error) {
    console.error("[GET /portal/analytics]", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

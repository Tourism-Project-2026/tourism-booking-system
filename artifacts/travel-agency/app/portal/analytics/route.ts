import { NextRequest, NextResponse } from "next/server";

const MONTHLY_DATA = [
  { month: "Jan", bookings: 34, revenue: 142000 },
  { month: "Feb", bookings: 41, revenue: 178000 },
  { month: "Mar", bookings: 38, revenue: 164000 },
  { month: "Apr", bookings: 55, revenue: 231000 },
  { month: "May", bookings: 62, revenue: 284000 },
  { month: "Jun", bookings: 71, revenue: 318000 },
  { month: "Jul", bookings: 89, revenue: 412000 },
  { month: "Aug", bookings: 94, revenue: 445000 },
  { month: "Sep", bookings: 78, revenue: 356000 },
  { month: "Oct", bookings: 66, revenue: 298000 },
  { month: "Nov", bookings: 52, revenue: 236000 },
  { month: "Dec", bookings: 43, revenue: 198000 },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()), 10);

    const totalBookings = MONTHLY_DATA.reduce((sum, m) => sum + m.bookings, 0);
    const totalRevenue = MONTHLY_DATA.reduce((sum, m) => sum + m.revenue, 0);

    const currentMonth = new Date().getMonth();
    const prevMonthBookings = MONTHLY_DATA[Math.max(0, currentMonth - 1)]?.bookings ?? 0;
    const currMonthBookings = MONTHLY_DATA[currentMonth]?.bookings ?? 0;
    const bookingsTrend =
      prevMonthBookings > 0
        ? Math.round(((currMonthBookings - prevMonthBookings) / prevMonthBookings) * 100)
        : 0;

    const prevMonthRevenue = MONTHLY_DATA[Math.max(0, currentMonth - 1)]?.revenue ?? 0;
    const currMonthRevenue = MONTHLY_DATA[currentMonth]?.revenue ?? 0;
    const revenueTrend =
      prevMonthRevenue > 0
        ? Math.round(((currMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
        : 0;

    return NextResponse.json({
      year,
      stats: {
        totalBookings,
        totalRevenue,
        activeTrips: 23,
        totalClients: 847,
        bookingsTrend,
        revenueTrend,
        tripsTrend: 8,
        clientsTrend: 14,
      },
      monthly: MONTHLY_DATA,
    });
  } catch (error) {
    console.error("[GET /api/analytics]", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

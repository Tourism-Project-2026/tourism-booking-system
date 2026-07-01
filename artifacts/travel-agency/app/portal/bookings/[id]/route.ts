import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id, 10);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const [deleted] = await db
      .delete(bookings)
      .where(eq(bookings.id, bookingId))
      .returning();
    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /portal/bookings/:id]", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = parseInt(id, 10);
    if (isNaN(bookingId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json() as { status?: string; notes?: string };
    const updates: Record<string, string> = {};
    if (body.status) updates.status = body.status;
    if (body.notes !== undefined) updates.notes = body.notes;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const [updated] = await db
      .update(bookings)
      .set(updates)
      .where(eq(bookings.id, bookingId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error("[PATCH /portal/bookings/:id]", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

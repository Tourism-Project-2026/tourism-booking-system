import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trips } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id, 10);
    if (isNaN(tripId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const [deleted] = await db
      .delete(trips)
      .where(eq(trips.id, tripId))
      .returning();
    if (!deleted) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /portal/trips/:id]", error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}

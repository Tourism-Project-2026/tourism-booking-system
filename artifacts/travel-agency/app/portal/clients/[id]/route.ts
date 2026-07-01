import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = parseInt(id, 10);
    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const [deleted] = await db
      .delete(clients)
      .where(eq(clients.id, clientId))
      .returning();
    if (!deleted) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /portal/clients/:id]", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}

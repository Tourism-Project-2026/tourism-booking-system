import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clients } from "@/db/schema";
import type { NewClient } from "@/db/schema";
import { desc, ilike, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);
    const search = searchParams.get("search")?.trim();

    let rows;
    if (search) {
      rows = await db
        .select()
        .from(clients)
        .where(
          or(
            ilike(clients.name, `%${search}%`),
            ilike(clients.email, `%${search}%`),
            ilike(clients.phone, `%${search}%`)
          )
        )
        .orderBy(desc(clients.created_at))
        .limit(limit)
        .offset(offset);
    } else {
      rows = await db.select().from(clients).orderBy(desc(clients.created_at)).limit(limit).offset(offset);
    }

    return NextResponse.json({ clients: rows, limit, offset });
  } catch (error) {
    console.error("[GET /portal/clients]", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name?: string;
      email?: string;
      phone?: string;
      country?: string;
      notes?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const newClient: NewClient = {
      name: body.name.trim(),
      email: body.email?.trim() ?? null,
      phone: body.phone?.trim() ?? null,
      country: body.country?.trim() ?? null,
      notes: body.notes?.trim() ?? null,
    };

    const [inserted] = await db.insert(clients).values(newClient).returning();
    return NextResponse.json({ client: inserted }, { status: 201 });
  } catch (error) {
    console.error("[POST /portal/clients]", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}

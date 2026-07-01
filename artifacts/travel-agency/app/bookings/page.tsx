"use client";

import { useEffect, useState, useCallback } from "react";
import type { Booking } from "@/db/schema";

const STATUSES = ["New", "Confirmed", "Completed", "Cancelled"];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  New: { bg: "rgba(0,180,216,0.12)", text: "var(--color-accent)" },
  Confirmed: { bg: "rgba(16,185,129,0.12)", text: "var(--color-success)" },
  Completed: { bg: "rgba(124,143,163,0.12)", text: "var(--color-text-secondary)" },
  Cancelled: { bg: "rgba(239,68,68,0.12)", text: "var(--color-danger)" },
};

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS["New"];
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.text}30`,
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        padding: "2px 8px",
        borderRadius: "3px",
      }}
    >
      {status.toUpperCase()}
    </span>
  );
}

function StatusDropdown({
  bookingId,
  current,
  onUpdate,
}: {
  bookingId: number;
  current: string;
  onUpdate: (id: number, status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function select(s: string) {
    if (s === current) { setOpen(false); return; }
    setLoading(true);
    setOpen(false);
    try {
      const res = await fetch(`/portal/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: s }),
      });
      if (res.ok) onUpdate(bookingId, s);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        style={{
          background: "none",
          border: "none",
          cursor: loading ? "wait" : "pointer",
          padding: 0,
        }}
      >
        <StatusBadge status={current} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 50,
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: "6px",
            overflow: "hidden",
            minWidth: "130px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}
        >
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => select(s)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: s === current ? "var(--color-border-subtle)" : "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 14px",
                color: STATUS_COLORS[s]?.text ?? "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.07em",
              }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingsPage() {
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/portal/bookings?limit=100");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { bookings: Booking[] };
      setBookingsList(data.bookings ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function handleStatusUpdate(id: number, status: string) {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }

  const filtered = filter === "All" ? bookingsList : bookingsList.filter((b) => b.status === filter);

  const counts: Record<string, number> = { All: bookingsList.length };
  for (const s of STATUSES) counts[s] = bookingsList.filter((b) => b.status === s).length;

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Admin &rsaquo; Bookings
        </p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
          All Bookings
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.82rem", marginTop: "0.25rem" }}>
          {bookingsList.length} total &mdash; click a status badge to update it
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "5px 14px",
              borderRadius: "4px",
              border: `1px solid ${filter === s ? "var(--color-accent)" : "var(--color-border)"}`,
              background: filter === s ? "var(--color-accent-glow)" : "var(--color-surface)",
              color: filter === s ? "var(--color-accent)" : "var(--color-text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.07em",
              cursor: "pointer",
            }}
          >
            {s.toUpperCase()} {counts[s] !== undefined && <span style={{ opacity: 0.6 }}>({counts[s]})</span>}
          </button>
        ))}
        <button
          onClick={() => void load()}
          style={{
            marginLeft: "auto",
            padding: "5px 14px",
            borderRadius: "4px",
            border: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            cursor: "pointer",
          }}
        >
          ↻ REFRESH
        </button>
      </div>

      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            LOADING...
          </div>
        ) : error ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            ERROR: {error}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
            NO BOOKINGS FOUND
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["ID", "Client", "Phone", "Destination", "Trip Period", "Notes", "Status", "Created"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.12em",
                      color: "var(--color-text-muted)",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      background: "var(--color-surface-raised)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr
                  key={b.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border-subtle)" : "none",
                    background: i % 2 === 1 ? "rgba(14,20,25,0.4)" : "none",
                  }}
                >
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
                    #{b.id}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "var(--color-text-primary)", fontWeight: 500 }}>
                    {b.client_name}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                    {b.phone ?? "—"}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.78rem", color: "var(--color-text-secondary)", maxWidth: "200px" }}>
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {b.destination_description ?? "—"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.78rem", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
                    {b.trip_period ?? "—"}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.75rem", color: "var(--color-text-muted)", maxWidth: "220px" }}>
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={b.notes ?? ""}>
                      {b.notes ?? "—"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <StatusDropdown bookingId={b.id} current={b.status} onUpdate={handleStatusUpdate} />
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                    {new Date(b.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

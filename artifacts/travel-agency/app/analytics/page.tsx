"use client";

import { useEffect, useState, useCallback } from "react";

type Stats = {
  totalBookings: number;
  totalClients: number;
  totalTrips: number;
  recentBookings: number;
  newBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
};

type StatusRow = { status: string; count: number };

function StatTile({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: `1px solid ${accent ? "var(--color-accent)30" : "var(--color-border)"}`,
        borderRadius: "8px",
        padding: "1.25rem 1.5rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.15em",
          color: accent ? "var(--color-accent)" : "var(--color-text-muted)",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: accent ? "var(--color-accent)" : "var(--color-text-primary)",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "0.4rem" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

const STATUS_PALETTE: Record<string, { bar: string; label: string }> = {
  New: { bar: "var(--color-accent)", label: "New" },
  Confirmed: { bar: "var(--color-success)", label: "Confirmed" },
  Completed: { bar: "var(--color-text-secondary)", label: "Completed" },
  Cancelled: { bar: "var(--color-danger)", label: "Cancelled" },
};

function StatusBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div style={{ width: "90px", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--color-text-secondary)", textAlign: "right", flexShrink: 0 }}>
        {label}
      </div>
      <div style={{ flex: 1, height: "8px", background: "var(--color-border)", borderRadius: "4px", overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: "4px",
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <div style={{ width: "48px", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--color-text-primary)", textAlign: "right", flexShrink: 0 }}>
        {count} <span style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}>({pct}%)</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/portal/analytics");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { stats: Stats; statusBreakdown: StatusRow[] };
      setStats(data.stats);
      setStatusBreakdown(data.statusBreakdown ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Admin &rsaquo; Analytics
          </p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--color-text-primary)" }}>
            Analytics Overview
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.82rem", marginTop: "0.25rem" }}>
            Live totals from your database
          </p>
        </div>
        <button
          onClick={() => void load()}
          style={{
            padding: "8px 16px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "5px",
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            cursor: "pointer",
          }}
        >
          ↻ REFRESH
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
          LOADING...
        </div>
      ) : error ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
          ERROR: {error}
        </div>
      ) : stats ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <StatTile label="Total Bookings" value={stats.totalBookings} sub="all time" accent />
            <StatTile label="Total Clients" value={stats.totalClients} sub="registered" />
            <StatTile label="Total Trips" value={stats.totalTrips} sub="on record" />
            <StatTile label="Recent Bookings" value={stats.recentBookings} sub="last 30 days" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                Bookings by Status
              </p>
              {stats.totalBookings === 0 ? (
                <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.72rem", textAlign: "center", padding: "2rem 0" }}>
                  NO BOOKINGS YET
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {["New", "Confirmed", "Completed", "Cancelled"].map((s) => {
                    const row = statusBreakdown.find((r) => r.status === s);
                    const palette = STATUS_PALETTE[s] ?? { bar: "var(--color-border)", label: s };
                    return (
                      <StatusBar
                        key={s}
                        label={palette.label}
                        count={row?.count ?? 0}
                        max={stats.totalBookings}
                        color={palette.bar}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                Status Counts
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "New", value: stats.newBookings, color: "var(--color-accent)" },
                  { label: "Confirmed", value: stats.confirmedBookings, color: "var(--color-success)" },
                  { label: "Completed", value: stats.completedBookings, color: "var(--color-text-secondary)" },
                  { label: "Cancelled", value: stats.cancelledBookings, color: "var(--color-danger)" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    style={{
                      background: "var(--color-surface-raised)",
                      border: "1px solid var(--color-border-subtle)",
                      borderRadius: "6px",
                      padding: "1rem",
                    }}
                  >
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                      {label}
                    </p>
                    <p style={{ fontSize: "1.6rem", fontWeight: 700, color, lineHeight: 1 }}>{value}</p>
                    {stats.totalBookings > 0 && (
                      <p style={{ fontSize: "0.65rem", color: "var(--color-text-muted)", marginTop: "0.25rem", fontFamily: "var(--font-mono)" }}>
                        {Math.round((value / stats.totalBookings) * 100)}%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

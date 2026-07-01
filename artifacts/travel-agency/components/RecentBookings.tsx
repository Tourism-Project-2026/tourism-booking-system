"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking } from "@/hooks/useDashboard";

const STATUS_STYLES: Record<
  Booking["status"],
  { label: string; color: string; bg: string }
> = {
  confirmed: {
    label: "Confirmed",
    color: "var(--color-success)",
    bg: "rgba(16,185,129,0.1)",
  },
  pending: {
    label: "Pending",
    color: "var(--color-warning)",
    bg: "rgba(245,158,11,0.1)",
  },
  cancelled: {
    label: "Cancelled",
    color: "var(--color-danger)",
    bg: "rgba(239,68,68,0.1)",
  },
  completed: {
    label: "Completed",
    color: "var(--color-text-muted)",
    bg: "var(--color-surface-raised)",
  },
};

interface RecentBookingsProps {
  bookings: Booking[];
  isLoading?: boolean;
}

export function RecentBookings({ bookings, isLoading }: RecentBookingsProps) {
  return (
    <div
      className="rounded-lg border flex flex-col"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.12em",
          }}
        >
          Recent Bookings
        </h2>
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{
            color: "var(--color-accent)",
            backgroundColor: "var(--color-accent-glow)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {bookings.length} records
        </span>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 rounded animate-pulse"
              style={{ backgroundColor: "var(--color-surface-raised)" }}
            />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div
          className="flex-1 flex items-center justify-center py-12 text-xs"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
        >
          NO_RECORDS_FOUND
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                {["ID", "Client", "Destination", "Departure", "Passengers", "Amount", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left font-medium uppercase tracking-wider first:pl-4"
                      style={{
                        color: "var(--color-text-muted)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => {
                const s = STATUS_STYLES[booking.status];
                return (
                  <tr
                    key={booking.id}
                    className="transition-colors"
                    style={{
                      borderBottom:
                        idx < bookings.length - 1
                          ? "1px solid var(--color-border-subtle)"
                          : "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "var(--color-surface-raised)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
                    >
                      #{booking.id.slice(0, 8)}
                    </td>
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {booking.clientName}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {booking.destination}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}
                    >
                      {formatDate(booking.departureDate)}
                    </td>
                    <td
                      className="px-4 py-3 text-center"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {booking.passengers}
                    </td>
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}
                    >
                      {formatCurrency(booking.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          color: s.color,
                          backgroundColor: s.bg,
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.65rem",
                        }}
                      >
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

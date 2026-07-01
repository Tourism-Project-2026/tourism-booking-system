"use client";

import { MapPin, TrendingUp } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { Destination } from "@/hooks/useDashboard";

interface PopularDestinationsProps {
  destinations: Destination[];
  isLoading?: boolean;
}

export function PopularDestinations({
  destinations,
  isLoading,
}: PopularDestinationsProps) {
  const maxBookings = Math.max(...destinations.map((d) => d.bookings), 1);

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
          Popular Destinations
        </h2>
        <MapPin size={12} style={{ color: "var(--color-text-muted)" }} />
      </div>

      <div className="p-4 flex flex-col gap-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded animate-pulse"
                style={{ backgroundColor: "var(--color-surface-raised)" }}
              />
            ))
          : destinations.length === 0
            ? (
              <p
                className="text-xs py-6 text-center"
                style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
              >
                NO_DATA
              </p>
            )
            : destinations.map((dest, idx) => {
                const pct = Math.round((dest.bookings / maxBookings) * 100);
                return (
                  <div key={dest.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="shrink-0 text-xs font-medium"
                          style={{
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-mono)",
                            width: "1.2rem",
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p
                            className="font-medium truncate text-xs"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {dest.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)", fontSize: "0.65rem" }}
                          >
                            {dest.country}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p
                          className="text-xs font-medium"
                          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }}
                        >
                          {formatCurrency(dest.revenue)}
                        </p>
                        <p
                          className="flex items-center justify-end gap-0.5"
                          style={{ color: "var(--color-text-muted)", fontSize: "0.65rem", fontFamily: "var(--font-mono)" }}
                        >
                          <TrendingUp size={9} />
                          {formatNumber(dest.bookings)} bookings
                        </p>
                      </div>
                    </div>
                    <div
                      className="h-0.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--color-border)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            idx === 0
                              ? "var(--color-accent)"
                              : "var(--color-border-subtle)",
                          opacity: idx === 0 ? 1 : 0.6 + idx * 0.05,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
      </div>
    </div>
  );
}

"use client";

import {
  CalendarCheck,
  DollarSign,
  Map,
  Users,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { StatCard, StatCardSkeleton } from "@/components/StatCard";
import { RecentBookings } from "@/components/RecentBookings";
import { PopularDestinations } from "@/components/PopularDestinations";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function DashboardShell() {
  const { stats, recentBookings, popularDestinations, isLoading, error, refresh } =
    useDashboard();

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Operations Overview
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors"
          style={{
            color: "var(--color-text-secondary)",
            borderColor: "var(--color-border)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--color-surface-raised)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          }}
        >
          <RefreshCw size={11} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded border text-xs"
          style={{
            backgroundColor: "rgba(239,68,68,0.08)",
            borderColor: "rgba(239,68,68,0.3)",
            color: "var(--color-danger)",
          }}
        >
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Failed to load dashboard data</p>
            <p
              className="mt-0.5"
              style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)" }}
            >
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Bookings"
              value={formatNumber(stats?.totalBookings ?? 0)}
              trend={stats?.bookingsTrend}
              icon={CalendarCheck}
              accent
            />
            <StatCard
              label="Total Revenue"
              value={formatCurrency(stats?.totalRevenue ?? 0)}
              trend={stats?.revenueTrend}
              icon={DollarSign}
            />
            <StatCard
              label="Active Trips"
              value={formatNumber(stats?.activeTrips ?? 0)}
              trend={stats?.tripsTrend}
              icon={Map}
            />
            <StatCard
              label="Total Clients"
              value={formatNumber(stats?.totalClients ?? 0)}
              trend={stats?.clientsTrend}
              icon={Users}
            />
          </>
        )}
      </div>

      {/* Separator */}
      <div
        className="flex items-center gap-3 text-xs"
        style={{ color: "var(--color-text-muted)" }}
      >
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border-subtle)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
          ACTIVITY_FEED
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border-subtle)" }} />
      </div>

      {/* Bottom section: Bookings table + Destinations sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <RecentBookings bookings={recentBookings} isLoading={isLoading} />
        <PopularDestinations
          destinations={popularDestinations}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

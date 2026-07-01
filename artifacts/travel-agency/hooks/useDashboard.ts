"use client";

import { useState, useEffect, useCallback } from "react";

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeTrips: number;
  totalClients: number;
  bookingsTrend: number;
  revenueTrend: number;
  tripsTrend: number;
  clientsTrend: number;
}

export interface Booking {
  id: string;
  clientName: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  amount: number;
  passengers: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  bookings: number;
  revenue: number;
  imageUrl?: string;
}

export interface AnalyticsData {
  month: string;
  bookings: number;
  revenue: number;
}

interface DashboardData {
  stats: DashboardStats | null;
  recentBookings: Booking[];
  popularDestinations: Destination[];
  analytics: AnalyticsData[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useDashboard(): DashboardData {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [analyticsRes, bookingsRes, destinationsRes] = await Promise.all([
        fetch("/portal/analytics"),
        fetch("/portal/bookings?limit=8"),
        fetch("/portal/trips?limit=5"),
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json() as {
          stats: DashboardStats;
          monthly: AnalyticsData[];
        };
        setStats(data.stats);
        setAnalytics(data.monthly);
      }
      if (bookingsRes.ok) {
        const data = await bookingsRes.json() as { bookings: Booking[] };
        setRecentBookings(data.bookings);
      }
      if (destinationsRes.ok) {
        const data = await destinationsRes.json() as { destinations: Destination[] };
        setPopularDestinations(data.destinations);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    stats,
    recentBookings,
    popularDestinations,
    analytics,
    isLoading,
    error,
    refresh: fetchData,
  };
}

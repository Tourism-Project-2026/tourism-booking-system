import { Suspense } from "react";
import { StatCard } from "@/components/StatCard";
import { RecentBookings } from "@/components/RecentBookings";
import { PopularDestinations } from "@/components/PopularDestinations";
import { DashboardShell } from "@/components/DashboardShell";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <DashboardShell />
  );
}

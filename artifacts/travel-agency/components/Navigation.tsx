"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  Globe,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const guestNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "Trips", icon: Map },
];

const adminNavItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "Trips", icon: Map },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

interface NavigationProps {
  isAdmin: boolean;
}

export function Navigation({ isAdmin }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = isAdmin ? adminNavItems : guestNavItems;

  async function handleLogout() {
    await fetch("/portal/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex items-center h-14 gap-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-7 h-7 rounded flex items-center justify-center"
              style={{
                backgroundColor: "var(--color-accent-glow)",
                border: "1px solid var(--color-accent)",
              }}
            >
              <Globe size={14} style={{ color: "var(--color-accent)" }} />
            </div>
            <span
              className="text-sm font-semibold tracking-widest uppercase"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.18em",
              }}
            >
              Travel Portal
            </span>
          </Link>

          <div className="w-px h-5" style={{ backgroundColor: "var(--color-border)" }} />

          <nav className="flex items-center gap-6 flex-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all duration-150",
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  )}
                  style={isActive ? { backgroundColor: "var(--color-accent-glow)" } : {}}
                >
                  <Icon size={13} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {isAdmin ? (
            <div className="flex items-center gap-3">
              <button
                className="relative w-7 h-7 flex items-center justify-center rounded transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
                aria-label="Notifications"
              >
                <Bell size={14} />
                <span
                  className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              </button>
              <Link
                href="/settings"
                className="w-7 h-7 flex items-center justify-center rounded transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <Settings size={14} />
              </Link>
              <div
                className="flex items-center gap-2 pl-3 border-l"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: "var(--color-accent-glow)",
                    color: "var(--color-accent)",
                    border: "1px solid var(--color-accent)",
                  }}
                >
                  A
                </div>
                <span
                  className="text-xs hidden sm:block"
                  style={{
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  admin
                </span>
                <button
                  onClick={() => void handleLogout()}
                  title="Sign out"
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:text-[var(--color-danger)]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

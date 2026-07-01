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
            <button
              onClick={() => void handleLogout()}
              style={{
                padding: "5px 16px",
                background: "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                color: "var(--color-text-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-danger)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-danger)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
              }}
            >
              LOGOUT
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

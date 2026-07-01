import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  accent?: boolean;
}

export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon: Icon,
  accent = false,
}: StatCardProps) {
  const trendDir =
    trend === undefined ? null : trend > 0 ? "up" : trend < 0 ? "down" : "flat";

  return (
    <div
      className="rounded-lg p-4 border relative overflow-hidden"
      style={{
        backgroundColor: accent
          ? "var(--color-accent-glow)"
          : "var(--color-surface)",
        borderColor: accent ? "var(--color-accent)" : "var(--color-border)",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 20px, white 20px, white 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, white 20px, white 21px)",
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-2"
            style={{
              color: accent ? "var(--color-accent)" : "var(--color-text-muted)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.12em",
            }}
          >
            {label}
          </p>
          <p
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            {value}
          </p>
          {trendDir !== null && trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trendDir === "up" && (
                <TrendingUp
                  size={11}
                  style={{ color: "var(--color-success)" }}
                />
              )}
              {trendDir === "down" && (
                <TrendingDown
                  size={11}
                  style={{ color: "var(--color-danger)" }}
                />
              )}
              {trendDir === "flat" && (
                <Minus size={11} style={{ color: "var(--color-text-muted)" }} />
              )}
              <span
                className="text-xs"
                style={{
                  color:
                    trendDir === "up"
                      ? "var(--color-success)"
                      : trendDir === "down"
                        ? "var(--color-danger)"
                        : "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {trend > 0 ? "+" : ""}
                {trend}%{trendLabel ? ` ${trendLabel}` : " vs last month"}
              </span>
            </div>
          )}
        </div>
        <div
          className="shrink-0 w-9 h-9 rounded flex items-center justify-center"
          style={{
            backgroundColor: accent
              ? "rgba(0,180,216,0.2)"
              : "var(--color-surface-raised)",
            color: accent ? "var(--color-accent)" : "var(--color-text-muted)",
          }}
        >
          <Icon size={16} />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div
      className="rounded-lg p-4 border animate-pulse"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="h-3 w-20 rounded mb-3"
        style={{ backgroundColor: "var(--color-surface-raised)" }}
      />
      <div
        className="h-7 w-28 rounded mb-2"
        style={{ backgroundColor: "var(--color-surface-raised)" }}
      />
      <div
        className="h-3 w-16 rounded"
        style={{ backgroundColor: "var(--color-surface-raised)" }}
      />
    </div>
  );
}

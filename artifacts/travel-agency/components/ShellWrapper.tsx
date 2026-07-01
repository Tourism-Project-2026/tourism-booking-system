"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-background)" }}>
      <Navigation />
      <main className="flex-1 px-6 py-6 max-w-screen-2xl mx-auto w-full">
        {children}
      </main>
      <footer
        className="px-6 py-3 text-xs border-t"
        style={{
          color: "var(--color-text-muted)",
          borderColor: "var(--color-border-subtle)",
        }}
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <span style={{ fontFamily: "var(--font-mono)" }}>
            TRAVEL/PORTAL v0.1.0
          </span>
          <span>
            {new Date().getFullYear()} &mdash; Internal Use Only
          </span>
        </div>
      </footer>
    </div>
  );
}

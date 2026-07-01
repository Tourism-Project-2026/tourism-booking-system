import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: {
    default: "Horizon Travel — Agency Dashboard",
    template: "%s | Horizon Travel",
  },
  description: "Internal operations dashboard for Horizon Travel Agency.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
                HORIZON/TRAVEL v0.1.0
              </span>
              <span>
                {new Date().getFullYear()} &mdash; Internal Use Only
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Travel Portal — Agency Dashboard",
    template: "%s | Travel Portal",
  },
  description: "Your gateway to unforgettable journeys.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const isAdmin = token ? await verifySession(token) : false;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div
          className="min-h-screen flex flex-col"
          style={{ backgroundColor: "var(--color-background)" }}
        >
          <Navigation isAdmin={isAdmin} />
          <main className="flex-1 px-6 py-6 pb-12 max-w-screen-2xl mx-auto w-full">
            {children}
          </main>
          <footer
            className="px-6 py-3 text-xs border-t"
            style={{
              color: "var(--color-text-muted)",
              borderColor: "var(--color-border-subtle)",
            }}
          >
            <div className="max-w-screen-2xl mx-auto flex items-center justify-center">
              <span>Travel Portal &copy; 2026</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

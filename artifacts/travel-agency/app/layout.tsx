import type { Metadata } from "next";
import "./globals.css";
import { ShellWrapper } from "@/components/ShellWrapper";

export const metadata: Metadata = {
  title: {
    default: "Travel Portal — Agency Dashboard",
    template: "%s | Travel Portal",
  },
  description: "Your gateway to unforgettable journeys.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ShellWrapper>{children}</ShellWrapper>
      </body>
    </html>
  );
}

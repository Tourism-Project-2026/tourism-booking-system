import { BookingForm } from "@/components/BookingForm";

export const metadata = {
  title: "New Booking",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-start gap-8 pt-6 pb-12">
      {/* Page header */}
      <div className="w-full max-w-xl text-center">
        <p
          className="text-xs font-medium uppercase tracking-widest mb-2"
          style={{
            color: "var(--color-accent)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.2em",
          }}
        >
          Travel Portal
        </p>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Your Gateway to Unforgettable Journeys
        </h1>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Fill in the details below, and our team will review your request and
          confirm your trip within 24 hours. We are here to make your travel
          planning seamless and stress-free.
        </p>
      </div>

      {/* Thin accent rule */}
      <div
        className="w-12 h-px"
        style={{ backgroundColor: "var(--color-accent)" }}
      />

      {/* Booking form — centered, fixed width */}
      <div className="w-full max-w-xl">
        <BookingForm />
      </div>

      {/* Footnote */}
      <p
        className="text-xs text-center"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
        }}
      >
        STATUS_DEFAULT → New &nbsp;·&nbsp; All submissions are reviewed by an
        agent
      </p>
    </div>
  );
}

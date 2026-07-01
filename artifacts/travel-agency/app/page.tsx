import { BookingForm } from "@/components/BookingForm";

export const metadata = {
  title: "New Booking",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center pt-10 pb-16">

      {/* Page header */}
      <div className="w-full max-w-lg text-center">
        <p
          className="text-sm font-semibold uppercase mb-3"
          style={{
            color: "var(--color-accent)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.32em",
          }}
        >
          Travel Portal
        </p>

        <h1
          className="text-4xl font-semibold tracking-tight leading-snug"
          style={{ color: "var(--color-text-primary)" }}
        >
          Your Gateway to Unforgettable Journeys
        </h1>

        <p
          className="mt-4 text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Fill in the details below, and our team will review your request and
          confirm your trip within 24&nbsp;hours. We are here to make your
          travel planning seamless and stress-free.
        </p>
      </div>

      {/* Accent rule */}
      <div
        className="w-10 h-px mt-10 mb-10"
        style={{ backgroundColor: "var(--color-accent)" }}
      />

      {/* Booking form */}
      <div className="w-full max-w-lg">
        <BookingForm />
      </div>

      {/* Footnote */}
      <p
        className="mt-8 text-center"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.06em",
        }}
      >
        STATUS_DEFAULT → New &nbsp;·&nbsp; All submissions are reviewed by an agent
      </p>
    </div>
  );
}

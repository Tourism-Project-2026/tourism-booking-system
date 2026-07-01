import { BookingForm } from "@/components/BookingForm";

export const metadata = {
  title: "New Booking",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center pt-12 pb-16">
      {/*
        Single max-w-xl column — everything inside shares the same width,
        so heading text and form are inherently aligned.
      */}
      <div className="w-full max-w-xl flex flex-col items-center text-center">

        {/* Brand label */}
        <p
          className="text-xs font-bold uppercase"
          style={{
            color: "var(--color-accent)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.35em",
            marginBottom: "1.25rem",
          }}
        >
          Travel Portal
        </p>

        {/* Main heading — one size down from before so it sits proportionally */}
        <h1
          className="text-3xl font-semibold tracking-tight leading-tight"
          style={{
            color: "var(--color-text-primary)",
            marginBottom: "1.25rem",
          }}
        >
          Your Gateway to Unforgettable Journeys
        </h1>

        {/* Description — muted, relaxed line-height */}
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "var(--color-text-muted)",
            marginBottom: "2.5rem",
          }}
        >
          Fill in the details below, and our team will review your request and
          confirm your trip within 24&nbsp;hours. We are here to make your
          travel planning seamless and stress-free.
        </p>

        {/* Accent rule */}
        <div
          className="w-8 h-px"
          style={{
            backgroundColor: "var(--color-accent)",
            marginBottom: "2.5rem",
          }}
        />

        {/* Form — full width of the shared column */}
        <div className="w-full text-left">
          <BookingForm />
        </div>

        {/* Footnote */}
        <p
          className="mt-8"
          style={{
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.06em",
          }}
        >
          STATUS_DEFAULT → New &nbsp;·&nbsp; All submissions are reviewed by an agent
        </p>
      </div>
    </div>
  );
}

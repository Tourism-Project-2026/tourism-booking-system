import { BookingForm } from "@/components/BookingForm";

export const metadata = {
  title: "New Booking",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center pb-16" style={{ paddingTop: "6rem" }}>
      {/*
        Single max-w-xl column — everything inside shares the same width,
        so heading text and form are inherently aligned.
      */}
      <div className="w-full max-w-xl flex flex-col items-center text-center">

        {/* Main heading */}
        <h1
          className="text-3xl font-semibold tracking-tight leading-tight"
          style={{
            color: "var(--color-accent)",
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

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface BookingFormData {
  client_name: string;
  phone: string;
  destination_description: string;
  trip_period: string;
}

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  type = "text",
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-widest"
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--color-accent)", marginLeft: "0.25rem" }}>
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded px-3 py-2 text-sm outline-none transition-all duration-150"
        style={{
          backgroundColor: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-sans)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-accent)";
          e.currentTarget.style.boxShadow = "0 0 0 2px var(--color-accent-glow)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

type FormState = "idle" | "submitting" | "success" | "error";

interface BookingFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function BookingForm({ onSuccess, className }: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>({
    client_name: "",
    phone: "",
    destination_description: "",
    trip_period: "",
  });
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function setField(key: keyof BookingFormData) {
    return (value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      setState("success");
      setForm({ client_name: "", phone: "", destination_description: "", trip_period: "" });
      onSuccess?.();

      setTimeout(() => setState("idle"), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed");
      setState("error");
    }
  }

  const isSubmitting = state === "submitting";

  return (
    <div
      className={cn("rounded-lg border p-5", className)}
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Header */}
      <div className="mb-5">
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.12em",
          }}
        >
          New Booking
        </h2>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--color-text-muted)", fontSize: "0.7rem" }}
        >
          Fill in the details below to register a new booking.
        </p>
      </div>

      {/* Success banner */}
      {state === "success" && (
        <div
          className="mb-4 flex items-center gap-2 rounded px-3 py-2 text-xs"
          style={{
            backgroundColor: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "var(--color-success)",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)" }}>✓</span>
          Booking submitted successfully.
        </div>
      )}

      {/* Error banner */}
      {state === "error" && (
        <div
          className="mb-4 flex items-center gap-2 rounded px-3 py-2 text-xs"
          style={{
            backgroundColor: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "var(--color-danger)",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)" }}>✕</span>
          {errorMsg || "Something went wrong."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          id="client_name"
          label="Name"
          value={form.client_name}
          onChange={setField("client_name")}
          placeholder="Full name"
          required
          disabled={isSubmitting}
        />
        <Field
          id="phone"
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={setField("phone")}
          placeholder="+1 555 000 0000"
          disabled={isSubmitting}
        />
        <Field
          id="destination_description"
          label="Destination"
          value={form.destination_description}
          onChange={setField("destination_description")}
          placeholder="e.g. Santorini, Greece"
          disabled={isSubmitting}
        />
        <Field
          id="trip_period"
          label="Trip Period"
          value={form.trip_period}
          onChange={setField("trip_period")}
          placeholder="e.g. Aug 14 – Aug 24, 2025"
          disabled={isSubmitting}
        />

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: "var(--color-border-subtle)" }}
        />

        <button
          type="submit"
          disabled={isSubmitting || !form.client_name.trim()}
          className="w-full rounded px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-150"
          style={{
            backgroundColor:
              isSubmitting || !form.client_name.trim()
                ? "var(--color-surface-raised)"
                : "var(--color-accent)",
            color:
              isSubmitting || !form.client_name.trim()
                ? "var(--color-text-muted)"
                : "#000",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.12em",
            cursor:
              isSubmitting || !form.client_name.trim()
                ? "not-allowed"
                : "pointer",
            border: "none",
          }}
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}

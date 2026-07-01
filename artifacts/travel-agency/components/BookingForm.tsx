"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface BookingFormData {
  client_name: string;
  phone: string;
  destination_description: string;
  trip_period: string;
  notes: string;
}

interface FieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  onInteract?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  pattern?: string;
  title?: string;
}

function Field({
  label,
  id,
  value,
  onChange,
  onInteract,
  placeholder = "",
  required = false,
  disabled = false,
  type = "text",
  pattern,
  title,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
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
        onChange={(e) => {
          onChange(e.target.value);
          onInteract?.();
        }}
        onFocus={onInteract}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        pattern={pattern}
        title={title}
        className="w-full rounded px-3 py-2 text-sm outline-none transition-all duration-150"
        style={{
          backgroundColor: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-sans)",
        }}
        onFocus={(e) => {
          onInteract?.();
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

interface TextareaFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  onInteract?: () => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

function TextareaField({
  label,
  id,
  value,
  onChange,
  onInteract,
  placeholder = "",
  disabled = false,
  rows = 3,
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        style={{
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onInteract?.();
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded px-3 py-2 text-sm outline-none transition-all duration-150 resize-none"
        style={{
          backgroundColor: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.6,
        }}
        onFocus={(e) => {
          onInteract?.();
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

const EMPTY_FORM: BookingFormData = {
  client_name: "",
  phone: "",
  destination_description: "",
  trip_period: "",
  notes: "",
};

export function BookingForm({ onSuccess, className }: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>(EMPTY_FORM);
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function setField(key: keyof BookingFormData) {
    return (value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  }

  function dismissSuccess() {
    if (state === "success") setState("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/portal/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
          const data = await res.json() as { error?: string };
          message = data.error ?? message;
        } catch { /* empty body — use status fallback */ }
        throw new Error(message);
      }

      setState("success");
      setForm(EMPTY_FORM);
      onSuccess?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed");
      setState("error");
    }
  }

  const isSubmitting = state === "submitting";
  const canSubmit =
    !isSubmitting &&
    form.client_name.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.destination_description.trim() !== "" &&
    form.trip_period.trim() !== "";

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

      {/* Success banner — stays until user interacts with the form */}
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
          Booking submitted — your team will be in touch within 24 hours.
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
          {errorMsg || "Something went wrong. Please try again."}
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} noValidate className="flex flex-col gap-4">
        <Field
          id="client_name"
          label="Name"
          value={form.client_name}
          onChange={setField("client_name")}
          onInteract={dismissSuccess}
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
          onInteract={dismissSuccess}
          placeholder="e.g. +374 91 000000"
          required
          disabled={isSubmitting}
          pattern="[0-9+\-\s()]+"
          title="Enter a valid international phone number"
        />
        <Field
          id="destination_description"
          label="Destination"
          value={form.destination_description}
          onChange={setField("destination_description")}
          onInteract={dismissSuccess}
          placeholder="e.g. Santorini, Greece"
          required
          disabled={isSubmitting}
        />
        <Field
          id="trip_period"
          label="Trip Period"
          value={form.trip_period}
          onChange={setField("trip_period")}
          onInteract={dismissSuccess}
          placeholder="e.g. Aug 14 – Aug 24, 2025"
          required
          disabled={isSubmitting}
        />
        <TextareaField
          id="notes"
          label="Notes (optional)"
          value={form.notes}
          onChange={setField("notes")}
          onInteract={dismissSuccess}
          placeholder="Special requests, dietary requirements, accessibility needs…"
          disabled={isSubmitting}
          rows={3}
        />

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: "var(--color-border-subtle)" }}
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-150"
          style={{
            backgroundColor: canSubmit ? "var(--color-accent)" : "var(--color-surface-raised)",
            color: canSubmit ? "#000" : "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.12em",
            cursor: canSubmit ? "pointer" : "not-allowed",
            border: "none",
          }}
        >
          {isSubmitting ? "Sending…" : "Submit"}
        </button>

        <p
          style={{
            fontSize: "0.62rem",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            textAlign: "center",
            marginTop: "-8px",
          }}
        >
          Fields marked <span style={{ color: "var(--color-accent)" }}>*</span> are required
        </p>
      </form>
    </div>
  );
}

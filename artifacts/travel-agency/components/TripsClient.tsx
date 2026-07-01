"use client";

import { useEffect, useState, useCallback } from "react";
import type { Trip } from "@/db/schema";

const STATUS_ORDER: Record<string, number> = { Active: 0, Upcoming: 1, Completed: 2 };

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Upcoming: { bg: "rgba(245,158,11,0.12)", text: "var(--color-warning)" },
  Active: { bg: "rgba(16,185,129,0.12)", text: "var(--color-success)" },
  Completed: { bg: "rgba(124,143,163,0.12)", text: "var(--color-text-secondary)" },
};

type FormData = {
  name: string;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price_per_person: string;
  status: string;
  capacity: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  destination: "",
  description: "",
  start_date: "",
  end_date: "",
  price_per_person: "",
  status: "Upcoming",
  capacity: "",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          color: "var(--color-text-muted)",
          textTransform: "uppercase",
          marginBottom: "5px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: "4px",
  color: "var(--color-text-primary)",
  fontSize: "0.82rem",
  outline: "none",
};

interface TripsClientProps {
  isAdmin: boolean;
}

export function TripsClient({ isAdmin }: TripsClientProps) {
  const [tripsList, setTripsList] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/portal/trips?limit=100");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { trips: Trip[] };
      setTripsList(data.trips ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function setField(key: keyof FormData) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Are you sure you want to delete trip "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/portal/trips/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setTripsList((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Failed to delete trip. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/portal/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price_per_person: form.price_per_person
            ? parseInt(form.price_per_person, 10)
            : undefined,
          capacity: form.capacity ? parseInt(form.capacity, 10) : undefined,
        }),
      });
      const data = (await res.json()) as { trip?: Trip; error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setTripsList((prev) => [data.trip!, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div>
          <p
            style={{
              color: "var(--color-accent)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            {isAdmin ? "Admin \u203a Trips" : "Trips"}
          </p>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            Trips
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.82rem",
              marginTop: "0.25rem",
            }}
          >
            {tripsList.length} trip{tripsList.length !== 1 ? "s" : ""} on record
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{
              padding: "8px 18px",
              background: showForm ? "var(--color-surface)" : "var(--color-accent)",
              border: `1px solid ${showForm ? "var(--color-border)" : "transparent"}`,
              borderRadius: "5px",
              color: showForm ? "var(--color-text-secondary)" : "#000",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.07em",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {showForm ? "CANCEL" : "+ ADD TRIP"}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <form
          onSubmit={(e) => void handleSubmit(e)}
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "var(--color-accent)",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              New Trip
            </p>
          </div>

          <Field label="Trip Name *">
            <input
              required
              value={form.name}
              onChange={setField("name")}
              placeholder="Santorini Escape"
              style={inputStyle}
            />
          </Field>
          <Field label="Destination *">
            <input
              required
              value={form.destination}
              onChange={setField("destination")}
              placeholder="Santorini, Greece"
              style={inputStyle}
            />
          </Field>
          <Field label="Start Date">
            <input
              value={form.start_date}
              onChange={setField("start_date")}
              placeholder="Aug 14, 2026"
              style={inputStyle}
            />
          </Field>
          <Field label="End Date">
            <input
              value={form.end_date}
              onChange={setField("end_date")}
              placeholder="Aug 24, 2026"
              style={inputStyle}
            />
          </Field>
          <Field label="Price Per Person ($)">
            <input
              type="number"
              min="0"
              value={form.price_per_person}
              onChange={setField("price_per_person")}
              placeholder="2500"
              style={inputStyle}
            />
          </Field>
          <Field label="Capacity">
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={setField("capacity")}
              placeholder="20"
              style={inputStyle}
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={setField("status")}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option>Upcoming</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </Field>
          <Field label="Description">
            <input
              value={form.description}
              onChange={setField("description")}
              placeholder="Short description..."
              style={inputStyle}
            />
          </Field>

          {formError && (
            <div
              style={{
                gridColumn: "1 / -1",
                color: "var(--color-danger)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
              }}
            >
              ERROR: {formError}
            </div>
          )}

          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "9px 24px",
                background: submitting ? "var(--color-border)" : "var(--color-accent)",
                border: "none",
                borderRadius: "5px",
                color: "#000",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.07em",
                fontWeight: 700,
                cursor: submitting ? "wait" : "pointer",
              }}
            >
              {submitting ? "SAVING..." : "SAVE TRIP"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div
          style={{
            padding: "4rem",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
          }}
        >
          LOADING...
        </div>
      ) : error ? (
        <div
          style={{
            padding: "4rem",
            textAlign: "center",
            color: "var(--color-danger)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
          }}
        >
          ERROR: {error}
        </div>
      ) : tripsList.length === 0 ? (
        <div
          style={{
            padding: "4rem",
            textAlign: "center",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            border: "1px dashed var(--color-border)",
            borderRadius: "8px",
          }}
        >
          {isAdmin
            ? "NO TRIPS YET — ADD YOUR FIRST TRIP ABOVE"
            : "NO TRIPS AVAILABLE AT THIS TIME"}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {[...tripsList].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)).map((trip) => {
            const colors =
              STATUS_COLORS[trip.status] ?? STATUS_COLORS["Upcoming"];
            return (
              <div
                key={trip.id}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {trip.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--color-text-secondary)",
                        marginTop: "2px",
                      }}
                    >
                      {trip.destination}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                    <span
                      style={{
                        background: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.text}30`,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: "3px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {trip.status.toUpperCase()}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={() => void handleDelete(trip.id, trip.name)}
                        style={{
                          padding: "2px 8px",
                          background: "none",
                          border: "1px solid var(--color-danger)",
                          borderRadius: "3px",
                          color: "var(--color-danger)",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.07em",
                          cursor: "pointer",
                          opacity: 0.7,
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.7"; }}
                      >
                        DELETE
                      </button>
                    )}
                  </div>
                </div>

                {trip.description && (
                  <p
                    style={{
                      fontSize: "0.77rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {trip.description}
                  </p>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    marginTop: "0.25rem",
                  }}
                >
                  {trip.start_date && (
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.1em",
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                        }}
                      >
                        Dates
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-text-secondary)",
                          marginTop: "2px",
                        }}
                      >
                        {trip.start_date}
                        {trip.end_date ? ` → ${trip.end_date}` : ""}
                      </p>
                    </div>
                  )}
                  {trip.price_per_person && (
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.1em",
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                        }}
                      >
                        Price / Person
                      </p>
                      <p
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--color-accent)",
                          marginTop: "2px",
                          fontWeight: 600,
                        }}
                      >
                        ${trip.price_per_person.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {trip.capacity && (
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.58rem",
                          letterSpacing: "0.1em",
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                        }}
                      >
                        Capacity
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-text-secondary)",
                          marginTop: "2px",
                        }}
                      >
                        {trip.capacity} seats
                      </p>
                    </div>
                  )}
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.58rem",
                        letterSpacing: "0.1em",
                        color: "var(--color-text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Added
                    </p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--color-text-muted)",
                        marginTop: "2px",
                      }}
                    >
                      {new Date(trip.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

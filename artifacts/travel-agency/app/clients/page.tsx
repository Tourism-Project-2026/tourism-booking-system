"use client";

import { useEffect, useState, useCallback } from "react";
import type { Client } from "@/db/schema";

type FormData = { name: string; email: string; phone: string; country: string; notes: string; };
const EMPTY: FormData = { name: "", email: "", phone: "", country: "", notes: "" };

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 12px",
  background: "var(--color-background)",
  border: "1px solid var(--color-border)",
  borderRadius: "4px", color: "var(--color-text-primary)",
  fontSize: "0.82rem", outline: "none",
};

function FieldBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "5px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `hsl(${hue},40%,22%)`, border: `1px solid hsl(${hue},40%,32%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: `hsl(${hue},60%,70%)`, fontFamily: "var(--font-mono)", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function DeleteClientButton({ id, onDelete }: { id: number; onDelete: (id: number) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function doDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/portal/clients/${id}`, { method: "DELETE" });
      if (res.ok) onDelete(id);
    } finally { setDeleting(false); setConfirming(false); }
  }

  if (confirming) {
    return (
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <button onClick={() => void doDelete()} disabled={deleting}
          style={{ padding: "2px 8px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "3px", color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", cursor: deleting ? "wait" : "pointer" }}>
          {deleting ? "…" : "YES"}
        </button>
        <button onClick={() => setConfirming(false)}
          style={{ padding: "2px 8px", background: "none", border: "1px solid var(--color-border)", borderRadius: "3px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", cursor: "pointer" }}>
          NO
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} title="Delete client"
      style={{ background: "none", border: "1px solid transparent", borderRadius: "4px", color: "var(--color-text-muted)", cursor: "pointer", padding: "2px 6px", fontSize: "0.8rem", lineHeight: 1 }}
      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-danger)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "none"; }}
    >
      ✕
    </button>
  );
}

export default function ClientsPage() {
  const [clientList, setClientList] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async (q?: string) => {
    setLoading(true); setError(null);
    try {
      const url = q ? `/portal/clients?search=${encodeURIComponent(q)}&limit=100` : "/portal/clients?limit=100";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as { clients: Client[] };
      setClientList(data.clients ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to load"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  function setField(key: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSubmitting(true); setFormError(null);
    try {
      const res = await fetch("/portal/clients", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { client?: Client; error?: string };
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setClientList((prev) => [data.client!, ...prev]);
      setForm(EMPTY); setShowForm(false);
    } catch (err) { setFormError(err instanceof Error ? err.message : "Failed"); }
    finally { setSubmitting(false); }
  }

  function handleDelete(id: number) {
    setClientList((prev) => prev.filter((c) => c.id !== id));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault(); void load(search);
  }

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <p style={{ color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Admin &rsaquo; Clients</p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--color-text-primary)" }}>Clients</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.82rem", marginTop: "0.25rem" }}>{clientList.length} client{clientList.length !== 1 ? "s" : ""} registered</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          style={{ padding: "8px 18px", background: showForm ? "var(--color-surface)" : "var(--color-accent)", border: `1px solid ${showForm ? "var(--color-border)" : "transparent"}`, borderRadius: "5px", color: showForm ? "var(--color-text-secondary)" : "#000", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.07em", cursor: "pointer", fontWeight: 600 }}>
          {showForm ? "CANCEL" : "+ ADD CLIENT"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={(e) => void handleSubmit(e)}
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--color-accent)", textTransform: "uppercase", marginBottom: "1rem" }}>New Client</p>
          </div>
          <FieldBox label="Full Name *"><input required value={form.name} onChange={setField("name")} placeholder="Jane Smith" style={inputStyle} /></FieldBox>
          <FieldBox label="Email"><input type="email" value={form.email} onChange={setField("email")} placeholder="jane@example.com" style={inputStyle} /></FieldBox>
          <FieldBox label="Phone"><input value={form.phone} onChange={setField("phone")} placeholder="+1 555 000 0000" style={inputStyle} /></FieldBox>
          <FieldBox label="Country"><input value={form.country} onChange={setField("country")} placeholder="United States" style={inputStyle} /></FieldBox>
          <FieldBox label="Notes"><input value={form.notes} onChange={setField("notes")} placeholder="VIP, preferences, etc." style={inputStyle} /></FieldBox>
          {formError && <div style={{ gridColumn: "1 / -1", color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>ERROR: {formError}</div>}
          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={submitting}
              style={{ padding: "9px 24px", background: submitting ? "var(--color-border)" : "var(--color-accent)", border: "none", borderRadius: "5px", color: "#000", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.07em", fontWeight: 700, cursor: submitting ? "wait" : "pointer" }}>
              {submitting ? "SAVING…" : "SAVE CLIENT"}
            </button>
          </div>
        </form>
      )}

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or phone…"
          style={{ ...inputStyle, flex: 1, maxWidth: "360px" }} />
        <button type="submit"
          style={{ padding: "8px 16px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "4px", color: "var(--color-accent)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", cursor: "pointer" }}>
          SEARCH
        </button>
        {search && (
          <button type="button" onClick={() => { setSearch(""); void load(); }}
            style={{ padding: "8px 14px", background: "none", border: "1px solid var(--color-border)", borderRadius: "4px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.68rem", cursor: "pointer" }}>
            CLEAR
          </button>
        )}
      </form>

      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>LOADING…</div>
        ) : error ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-danger)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>ERROR: {error}</div>
        ) : clientList.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>NO CLIENTS FOUND</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["Client", "Email", "Phone", "Country", "Notes", "Joined", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.12em", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 500, background: "var(--color-surface-raised)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientList.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < clientList.length - 1 ? "1px solid var(--color-border-subtle)" : "none", background: i % 2 === 1 ? "rgba(14,20,25,0.4)" : "none" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Avatar name={c.name} />
                      <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--color-text-primary)" }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>{c.email ?? "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>{c.phone ?? "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>{c.country ?? "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.75rem", color: "var(--color-text-muted)", maxWidth: "200px" }}>
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.notes ?? "—"}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                    {new Date(c.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "12px 10px", textAlign: "center" }}>
                    <DeleteClientButton id={c.id} onDelete={handleDelete} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

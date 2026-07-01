"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/bookings";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "var(--color-background)",
    border: "1px solid var(--color-border)",
    borderRadius: "5px",
    color: "var(--color-text-primary)",
    fontSize: "0.88rem",
    outline: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-background)",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "var(--color-accent-glow)",
              border: "1px solid var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
            }}
          >
            <Globe size={20} style={{ color: "var(--color-accent)" }} />
          </div>
          <h1
            style={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "0.4rem",
            }}
          >
            Admin Access
          </h1>
          <p
            style={{
              fontSize: "0.82rem",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.05em",
            }}
          >
            TRAVEL PORTAL — STAFF ONLY
          </p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.1rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            {error && (
              <p
                style={{
                  color: "var(--color-danger)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.04em",
                }}
              >
                ERROR: {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "11px",
                background: loading ? "var(--color-border)" : "var(--color-accent)",
                border: "none",
                borderRadius: "5px",
                color: "#000",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "0.25rem",
              }}
            >
              <Lock size={13} />
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </div>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
          }}
        >
          <a
            href="/"
            style={{ color: "var(--color-accent)", textDecoration: "none" }}
          >
            ← Back to booking form
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

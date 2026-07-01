"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error" | "unconfigured">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const redirectTo = searchParams.get("from") ?? "/bookings";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.status === 503) {
        setState("unconfigured");
        return;
      }

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setErrorMsg(data.error ?? "Incorrect password.");
        setState("error");
        setPassword("");
        return;
      }

      // Successful login — navigate to original destination
      router.push(redirectTo);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setState("error");
    }
  }

  const isLoading = state === "loading";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-background)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "10px",
          padding: "2.25rem 2rem",
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 800,
              color: "#000",
              fontFamily: "var(--font-mono)",
              letterSpacing: "-0.02em",
              flexShrink: 0,
            }}
          >
            TP
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-text-primary)",
              fontWeight: 600,
            }}
          >
            Travel Portal
          </span>
        </div>

        <h1
          style={{
            fontSize: "1.15rem",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            marginBottom: "0.35rem",
          }}
        >
          Admin Sign-in
        </h1>
        <p
          style={{
            fontSize: "0.78rem",
            color: "var(--color-text-muted)",
            marginBottom: "1.75rem",
            lineHeight: 1.5,
          }}
        >
          Enter the admin password to access the portal.
        </p>

        {/* Unconfigured notice */}
        {state === "unconfigured" && (
          <div
            style={{
              marginBottom: "1.25rem",
              padding: "10px 14px",
              borderRadius: "6px",
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "var(--color-warning)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              lineHeight: 1.5,
            }}
          >
            ⚠ ADMIN_PASSWORD is not configured on this server.
            Add it to your Secrets to activate protection.
          </div>
        )}

        {/* Error banner */}
        {state === "error" && (
          <div
            style={{
              marginBottom: "1.25rem",
              padding: "10px 14px",
              borderRadius: "6px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "var(--color-danger)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
            }}
          >
            ✕ {errorMsg}
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "9px 12px",
                background: "var(--color-surface-raised)",
                border: `1px solid ${state === "error" ? "rgba(239,68,68,0.5)" : "var(--color-border)"}`,
                borderRadius: "5px",
                color: "var(--color-text-primary)",
                fontSize: "0.9rem",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
                e.currentTarget.style.boxShadow = "0 0 0 2px var(--color-accent-glow)";
                if (state === "error") setState("idle");
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            style={{
              width: "100%",
              padding: "10px",
              background: isLoading || !password ? "var(--color-surface-raised)" : "var(--color-accent)",
              color: isLoading || !password ? "var(--color-text-muted)" : "#000",
              border: "none",
              borderRadius: "5px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              fontWeight: 700,
              textTransform: "uppercase",
              cursor: isLoading || !password ? "not-allowed" : "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p
          style={{
            marginTop: "1.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--color-text-muted)",
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          SESSION · 8H · HTTPONLY COOKIE
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

"use client";

import { ChevronRight, Waves, KeyRound, Info } from "lucide-react";
import { FormEvent, useState } from "react";
import { login } from "@/lib/api";

interface LoginScreenProps {
  /** Callback invoked after successful authentication. */
  onAuthenticated: () => void;
}

/**
 * Full-screen authentication boundary for the operations command center.
 *
 * Renders a branded sign-in form with email/password fields, accessible
 * labels, autocomplete hints for credential managers, and an inline
 * error display with `role="alert"` for screen-reader announcements.
 *
 * A decorative radar animation reinforces the stadium operations theme
 * without interfering with accessibility (it respects `prefers-reduced-motion`).
 */
export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [email, setEmail] = useState("administrator@arenamind.local");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleUseDemo = () => {
    setEmail("administrator@arenamind.local");
    setPassword("MxgUGVqZuB5rG8kqrGA-Zg");
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      onAuthenticated();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to sign in"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main id="main" className="login-shell">
      {/* Decorative radar animation — hidden from assistive technology */}
      <div className="login-radar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span />
      </div>

      <section className="login-panel" aria-labelledby="login-title">
        {/* Branding */}
        <div className="brand login-brand">
          <span className="brandmark">
            <Waves />
          </span>
          <div>
            <strong>ArenaMind</strong>
            <small>Secure operations access</small>
          </div>
        </div>

        <p className="eyebrow">STADIUM OPERATIONS CENTER</p>
        <h1 id="login-title">Command sign in</h1>
        <p className="login-copy">
          Use your assigned venue identity. Access and actions are recorded for
          operational accountability.
        </p>

        {/* Sign-in form */}
        <form onSubmit={submit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button disabled={busy}>
            {busy ? "Authenticating…" : "Enter command center"}
            <ChevronRight />
          </button>
        </form>

        <div style={{ marginTop: "24px", borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)", lineHeight: "1.4", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
            <KeyRound style={{ width: "14px", height: "14px", color: "var(--cyan)" }} /> Deployed Demo Credentials:
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px", background: "rgba(0, 229, 255, 0.05)", border: "1px solid rgba(0, 229, 255, 0.15)", padding: "10px 12px", borderRadius: "8px" }}>
            <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: "1.5" }}>
              <div>Email: <code style={{ color: "#fff" }}>administrator@arenamind.local</code></div>
              <div>Password: <code style={{ color: "#fff" }}>MxgUGVqZuB5rG8kqrGA-Zg</code></div>
            </div>
            <button
              type="button"
              onClick={handleUseDemo}
              style={{
                background: "rgba(0, 229, 255, 0.1)",
                color: "var(--cyan)",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--cyan)";
                e.currentTarget.style.color = "#030712";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 229, 255, 0.1)";
                e.currentTarget.style.color = "var(--cyan)";
              }}
            >
              Autofill
            </button>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: "10px", color: "#64748b", lineHeight: "1.4", display: "flex", alignItems: "center", gap: "5px" }}>
            <Info style={{ width: "12px", height: "12px", flexShrink: 0 }} /> <em>Note: If running locally from the repository, use the passwords defined in your local <code>.env</code> file.</em>
          </p>
        </div>
      </section>
    </main>
  );
}

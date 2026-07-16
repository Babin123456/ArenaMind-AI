"use client";

import { ChevronRight, Waves } from "lucide-react";
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
            minLength={12}
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

        <div style={{ marginTop: "20px", borderTop: "1px solid var(--line)", paddingTop: "15px" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "var(--muted)", lineHeight: "1.4" }}>
            💡 <strong>Local Test Credentials:</strong>
          </p>
          <ul style={{ margin: "5px 0 0", paddingLeft: "15px", fontSize: "11px", color: "var(--muted)", lineHeight: "1.5" }}>
            <li>Email: <code>administrator@arenamind.local</code></li>
            <li>Password (with unmodified `.env`): <code>replace-with-a-strong-bootstrap-password</code></li>
            <li>Password (without `.env` fallback): <code>ChangeMe-ArenaMind-2026</code></li>
          </ul>
        </div>
      </section>
    </main>
  );
}

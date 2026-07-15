/**
 * ArenaMind API Client
 *
 * Provides typed HTTP helpers for the operations command dashboard.
 * All authenticated requests attach a short-lived JWT access token
 * obtained during login. Tokens are persisted in `sessionStorage`
 * for tab-lifetime continuity without surviving browser closure.
 */

/* ── Response types ────────────────────────────────────────── */

/** Aggregate dashboard payload returned by `GET /dashboard`. */
export type Dashboard = {
  attendance: number;
  capacity: number;
  active_incidents: number;
  gate_wait_minutes: number;
  medical_readiness: number;
  transport_status: string;
  energy_mw: number;
  water_lpm: number;
  volunteers_available: number;
  role: string;
  focus: string[];
  zones: { name: string; density: number; trend: number }[];
};

/** Structured AI copilot response from `POST /copilot/query`. */
export type CopilotAnswer = {
  summary: string;
  reasoning: string[];
  recommendations: string[];
  confidence: number;
  sources: string[];
  generated_by: string;
};

/* ── Configuration ─────────────────────────────────────────── */

/** Base URL for the ArenaMind REST API (injected at build time). */
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

/** In-memory token cache (cleared on page unload). */
let token = "";

/* ── Session helpers ───────────────────────────────────────── */

/**
 * Returns `true` if a session token exists in memory or `sessionStorage`.
 * Used to determine whether to render the login or dashboard view.
 */
export function hasSession(): boolean {
  return Boolean(
    token ||
      (typeof window !== "undefined" &&
        sessionStorage.getItem("arenamind_token"))
  );
}

/**
 * Authenticates with the API using email and password credentials.
 *
 * On success, persists the access token in both memory and
 * `sessionStorage`, and returns the authenticated user principal.
 *
 * @throws {Error} On invalid credentials or service unavailability.
 */
export async function login(email: string, password: string) {
  const response = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? "Invalid email or password"
        : "Authentication service unavailable"
    );
  }

  const result = await response.json();
  token = result.access_token;
  sessionStorage.setItem("arenamind_token", token);
  return result.user;
}

/** Clears the active session from memory and storage. */
export function logout(): void {
  token = "";
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("arenamind_token");
  }
}

/* ── Authenticated fetch ───────────────────────────────────── */

/**
 * Resolves the current access token from memory or `sessionStorage`.
 *
 * @throws {Error} If no token is available (user is not authenticated).
 */
async function authToken(): Promise<string> {
  token =
    token ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("arenamind_token") ?? ""
      : "");

  if (!token) throw new Error("Authentication required");
  return token;
}

/**
 * Sends an authenticated JSON request to the ArenaMind API.
 *
 * Automatically attaches the `Authorization: Bearer` header and
 * `Content-Type: application/json`. Callers provide a path relative
 * to the API base (e.g. `"/dashboard"` or `"/copilot/query"`).
 *
 * @template T  Expected response body type.
 * @throws {Error} On non-2xx responses.
 */
export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const access = await authToken();
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}

/* ── Fallback data ─────────────────────────────────────────── */

/**
 * Offline-safe placeholder used by React Query's `placeholderData`
 * so the dashboard renders a meaningful layout while the first
 * network request is in flight.
 *
 * In production this would be replaced by a service-worker cache
 * or persisted query state.
 */
export const fallbackDashboard: Dashboard = {
  attendance: 71_482,
  capacity: 80_241,
  active_incidents: 3,
  gate_wait_minutes: 7.4,
  medical_readiness: 96,
  transport_status: "recovering",
  energy_mw: 8.7,
  water_lpm: 1_280,
  volunteers_available: 184,
  role: "operations_manager",
  focus: ["Crowd pressure", "Cross-team coordination", "Kickoff readiness"],
  zones: [
    { name: "North Plaza", density: 87, trend: 8 },
    { name: "Gate C", density: 74, trend: -3 },
    { name: "East Concourse", density: 61, trend: 4 },
    { name: "South Transit", density: 43, trend: -6 },
  ],
};

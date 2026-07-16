"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Clock,
  Compass,
  HeartPulse,
  Leaf,
  Map,
  Activity,
  Radio,
  Search,
  Shield,
  Sun,
  Moon,
  Train,
  Users,
  Waves,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import {
  api,
  CopilotAnswer,
  Dashboard as DashboardData,
  fallbackDashboard,
  hasSession,
  logout,
} from "@/lib/api";
import {
  TRANSLATIONS,
  getNavLabel,
  type SupportedLanguage,
} from "@/lib/translations";
import { useWebSocket } from "@/hooks/use-websocket";

/* ── Extracted components ──────────────────────────────────────────── */
import { MetricCard } from "./metric-card";
import { PanelTitle } from "./panel-title";
import { Resource } from "./resource-readiness";
import { IncidentRow } from "./incident-row";
import { DomainBrief } from "./domain-brief";
import { CopilotPanel } from "./copilot-panel";
import { LoginScreen } from "./login-screen";
import { LanguageSelector } from "./language-selector";
import { CrowdChart } from "./crowd-chart";
import {
  NotificationsPanel,
  INITIAL_NOTIFICATIONS,
  type Notification,
} from "./notifications-panel";

/* ── Static data ───────────────────────────────────────────────────── */

/** Sidebar navigation items with their associated Lucide icons. */
const NAV_ITEMS = [
  [Activity,      "Overview"],
  [Map,           "Crowd intelligence"],
  [Shield,        "Security"],
  [HeartPulse,    "Medical"],
  [Users,         "Workforce"],
  [Train,         "Transportation"],
  [Leaf,          "Sustainability"],
  [Compass,       "Venue navigation"],
] as const;

/* ── Main dashboard component ──────────────────────────────────────── */

/**
 * Top-level operations command dashboard.
 *
 * Manages authentication state, fetches live dashboard data via
 * React Query, and orchestrates the sidebar navigation, KPI metrics,
 * crowd pressure chart, resource readiness, incident list, and the
 * AI copilot panel.
 *
 * When no session exists, renders the LoginScreen boundary instead.
 */
export function OperationsDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState("Overview");
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<SupportedLanguage>("en");
  const [theme, setTheme] = useState("dark");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  /* Restore session on mount */
  useEffect(() => setAuthenticated(hasSession()), []);

  /* Live WebSocket telemetry (extracted hook) */
  const { wsConnected, crowdIndex } = useWebSocket(authenticated);

  /* Live dashboard data with offline-safe fallback */
  const dashboard = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api<DashboardData>("/dashboard"),
    placeholderData: fallbackDashboard,
    enabled: authenticated,
  });

  /* AI copilot mutation (fire on form submission) */
  const copilot = useMutation({
    mutationFn: (text: string) =>
      api<CopilotAnswer>("/copilot/query", {
        method: "POST",
        body: JSON.stringify({
          query: text,
          context: {
            venue: "Arena 01",
            active_view: activeView,
            language: lang,
          },
        }),
      }),
  });

  const data = dashboard.data ?? fallbackDashboard;

  /** Submit the copilot question directly. */
  function handleAsk(text: string) {
    if (text.trim().length >= 3) {
      setQuery(text);
      copilot.mutate(text.trim());
    }
  }

  /* Theme toggle effect */
  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, [theme]);

  /* ── Authentication boundary ──────────────────────────────────── */
  if (!authenticated) {
    return <LoginScreen onAuthenticated={() => setAuthenticated(true)} />;
  }

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  /* ── Authenticated dashboard ──────────────────────────────────── */
  return (
    <div className="shell">
      {/* Skip to main content — accessibility landmark */}
      <a className="sr-only" href="#main" style={{ position: "absolute" }}>
        Skip to main content
      </a>

      {/* ── Sidebar navigation ── */}
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brandmark">
            <Waves aria-hidden="true" />
          </span>
          <div>
            <strong>ArenaMind</strong>
            <small>Operations intelligence</small>
          </div>
        </div>

        <nav>
          {NAV_ITEMS.map(([Icon, label]) => (
            <button
              className={activeView === label ? "nav active" : "nav"}
              key={label}
              onClick={() => setActiveView(label)}
              aria-current={activeView === label ? "page" : undefined}
            >
              <Icon aria-hidden="true" />
              <span>{getNavLabel(label, t)}</span>
              {label === "Security" && <b>{notifications.length}</b>}
            </button>
          ))}
        </nav>

        <div className="system">
          <span>
            <i
              aria-hidden="true"
              style={{
                background: wsConnected ? "var(--green)" : "var(--red)",
                boxShadow: wsConnected ? "0 0 8px var(--green)" : "0 0 8px var(--red)",
              }}
            />
            {wsConnected ? t.systemNominal : "Systems offline"}
          </span>
          <small>{wsConnected ? "Receiving live telemetry" : "Reconnecting to server..."}</small>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <main id="main">
        {/* Top bar with search and session controls */}
        <header className="topbar">
          <div>
            <p className="eyebrow">MATCHDAY 08 · GROUP STAGE</p>
            <h1>{t.opsCommand}</h1>
          </div>
          <div className="top-actions" style={{ position: "relative" }}>
            {/* Multilingual venue assistance (FIFA WC 2026 requirement) */}
            <LanguageSelector onLanguageChange={(code) => setLang(code as SupportedLanguage)} />
            
            {/* Dark / Light Theme Toggle */}
            <button 
              className="icon-btn" 
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </button>

            <label className="search">
              <Search aria-hidden="true" />
              <span className="sr-only">Search operations</span>
              <input placeholder="Search operations" />
            </label>

            {/* Notifications (extracted component) */}
            <NotificationsPanel
              notifications={notifications}
              isOpen={showNotifications}
              onToggle={() => setShowNotifications(!showNotifications)}
              onClear={() => setNotifications([])}
            />

            <button
              className="avatar"
              aria-label="Sign out"
              onClick={() => {
                logout();
                setAuthenticated(false);
              }}
            >
              AK
            </button>
          </div>
        </header>

        {/* Event status ribbon */}
        <section className="statusbar" aria-label="Current event status">
          <span className="live">
            <i aria-hidden="true" />
            LIVE
          </span>
          <span>Arena 01 · New York/New Jersey</span>
          <span>
            <Clock />
            19:24 local
          </span>
          <span className="phase">{t.ingressPhase}</span>
        </section>

        {/* Dashboard content */}
        <div className="content">
          {/* Decorative radar background */}
          <div className="ambient-radar" aria-hidden="true">
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <span />
          </div>

          {/* Role context strip */}
          <section className="role-strip" aria-label="Role dashboard context">
            <div>
              <span>Current workspace</span>
              <strong>{getNavLabel(activeView, t)}</strong>
            </div>
            {data.focus.map((item) => (
              <span className="focus-chip" key={item}>
                {item}
              </span>
            ))}
          </section>

          {/* KPI metric cards */}
          <section className="metrics" aria-label="Key operational metrics">
            <MetricCard
              icon={Users}
              label={t.attendance}
              value={data.attendance.toLocaleString()}
              detail={`${Math.round((data.attendance / data.capacity) * 100)}% of capacity`}
              tone="cyan"
            />
            <MetricCard
              icon={AlertTriangle}
              label={t.activeIncidents}
              value={String(data.active_incidents)}
              detail="1 requires attention"
              tone="danger"
            />
            <MetricCard
              icon={Clock}
              label={t.medianGateWait}
              value={`${data.gate_wait_minutes} min`}
              detail="1.8 min below target"
              tone="success"
            />
            <MetricCard
              icon={HeartPulse}
              label={t.medicalReadiness}
              value={`${data.medical_readiness}%`}
              detail="12 teams available"
              tone="success"
            />
          </section>

          {/* Domain brief for non-Overview views */}
          {activeView !== "Overview" && (
            <DomainBrief view={activeView} data={data} />
          )}

          {/* Main content grid */}
          <div className="grid-main">
            {/* Crowd pressure panel (extracted component) */}
            <CrowdChart crowdIndex={crowdIndex} data={data} t={t} />

            {/* AI copilot panel */}
            <CopilotPanel
              query={query}
              setQuery={setQuery}
              onAsk={handleAsk}
              state={copilot}
            />

            {/* Resource readiness panel */}
            <section className="panel resources">
              <PanelTitle
                icon={Radio}
                title="Resource Readiness"
                subtitle="Live deployment status"
              />
              <Resource icon={Shield} label="Security units" value="42 / 48" percent={88} />
              <Resource icon={HeartPulse} label="Medical teams" value="12 / 12" percent={100} />
              <Resource
                icon={Users}
                label="Volunteers"
                value={`${data.volunteers_available} available`}
                percent={77}
              />
              <Resource icon={Train} label="Transport links" value="5 / 6 normal" percent={83} />
            </section>

            {/* Priority incidents panel */}
            <section className="panel incidents">
              <PanelTitle
                icon={AlertTriangle}
                title="Priority Incidents"
                subtitle="3 active · ordered by operational risk"
                action="View all"
              />
              <IncidentRow
                severity="Critical"
                time="2m"
                title="North Plaza crowd threshold exceeded"
                meta="Zone N-04 · Unit S12 responding"
              />
              <IncidentRow
                severity="Medium"
                time="8m"
                title="Platform 2 rail service delayed"
                meta="South Transit · ETA recovery 12 min"
              />
              <IncidentRow
                severity="Low"
                time="14m"
                title="Concourse kiosk power interruption"
                meta="Level 2 East · Facilities assigned"
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

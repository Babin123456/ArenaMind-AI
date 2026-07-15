"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import {
  Activity,
  AlertTriangle,
  Bell,
  Clock,
  Compass,
  HeartPulse,
  Leaf,
  Map,
  Radio,
  Search,
  Shield,
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

/* ── Extracted components ──────────────────────────────────────────── */
import { MetricCard } from "./metric-card";
import { PanelTitle } from "./panel-title";
import { Resource } from "./resource-readiness";
import { IncidentRow } from "./incident-row";
import { DomainBrief } from "./domain-brief";
import { CopilotPanel } from "./copilot-panel";
import { LoginScreen } from "./login-screen";
import { LanguageSelector } from "./language-selector";

/* ── Static data ───────────────────────────────────────────────────── */

/**
 * Simulated crowd-pressure trend for the last 90 minutes.
 * In production this would be streamed from venue sensor aggregation.
 */
const crowdTrend = [
  { t: "18:00", v: 42 },
  { t: "18:15", v: 48 },
  { t: "18:30", v: 57 },
  { t: "18:45", v: 63 },
  { t: "19:00", v: 71 },
  { t: "19:15", v: 68 },
];

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

  /* Restore session on mount */
  useEffect(() => setAuthenticated(hasSession()), []);

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
        body: JSON.stringify({ query: text, context: { venue: "Arena 01" } }),
      }),
  });

  const data = dashboard.data ?? fallbackDashboard;

  /** Submit the copilot question (minimum 3 characters). */
  function submitCopilot(event: FormEvent) {
    event.preventDefault();
    if (query.trim().length >= 3) copilot.mutate(query.trim());
  }

  /* ── Authentication boundary ──────────────────────────────────── */
  if (!authenticated) {
    return <LoginScreen onAuthenticated={() => setAuthenticated(true)} />;
  }

  /* ── Authenticated dashboard ──────────────────────────────────── */
  return (
    <div className="shell">
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
              <span>{label}</span>
              {/* Badge for active security incidents */}
              {label === "Security" && <b>3</b>}
            </button>
          ))}
        </nav>

        <div className="system">
          <span>
            <i />
            Systems nominal
          </span>
          <small>Last sync 4 seconds ago</small>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <main id="main">
        {/* Top bar with search and session controls */}
        <header className="topbar">
          <div>
            <p className="eyebrow">MATCHDAY 08 · GROUP STAGE</p>
            <h1>Operations Command</h1>
          </div>
          <div className="top-actions">
            {/* Multilingual venue assistance (FIFA WC 2026 requirement) */}
            <LanguageSelector />
            <label className="search">
              <Search aria-hidden="true" />
              <span className="sr-only">Search operations</span>
              <input placeholder="Search operations" />
            </label>
            <button className="icon-btn" aria-label="Notifications, 3 unread">
              <Bell />
              <span>3</span>
            </button>
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
            <i />
            LIVE
          </span>
          <span>Arena 01 · New York/New Jersey</span>
          <span>
            <Clock />
            19:24 local
          </span>
          <span className="phase">Ingress · 36 min to kickoff</span>
        </section>

        {/* Dashboard content */}
        <div className="content">
          {/* Decorative radar background */}
          <div className="ambient-radar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span />
          </div>

          {/* Role context strip */}
          <section className="role-strip" aria-label="Role dashboard context">
            <div>
              <span>Current workspace</span>
              <strong>{activeView}</strong>
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
              label="Attendance"
              value={data.attendance.toLocaleString()}
              detail={`${Math.round((data.attendance / data.capacity) * 100)}% of capacity`}
              tone="cyan"
            />
            <MetricCard
              icon={AlertTriangle}
              label="Active incidents"
              value={String(data.active_incidents)}
              detail="1 requires attention"
              tone="danger"
            />
            <MetricCard
              icon={Clock}
              label="Median gate wait"
              value={`${data.gate_wait_minutes} min`}
              detail="1.8 min below target"
              tone="success"
            />
            <MetricCard
              icon={HeartPulse}
              label="Medical readiness"
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
            {/* Crowd pressure panel */}
            <section className="panel crowd">
              <PanelTitle
                icon={Activity}
                title="Crowd Pressure"
                subtitle="Sensor-fused density · last 90 minutes"
                action="Open intelligence"
              />
              <div className="chart-summary">
                <div>
                  <span>Stadium pressure index</span>
                  <strong>68</strong>
                  <small>Moderate · rising</small>
                </div>
                <div
                  className="chart"
                  aria-label="Crowd pressure rose from 42 to 68 over 90 minutes"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={crowdTrend}>
                      <defs>
                        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="#00e5ff" stopOpacity={0.35} />
                          <stop offset="1" stopColor="#00e5ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="t" tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#00e5ff"
                        fill="url(#fill)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Zone density breakdown */}
              <div className="zones">
                {data.zones.map((zone) => (
                  <div key={zone.name}>
                    <div>
                      <span>{zone.name}</span>
                      <b
                        className={
                          zone.density > 80
                            ? "critical"
                            : zone.density > 65
                              ? "warning"
                              : "normal"
                        }
                      >
                        {zone.density > 80
                          ? "High"
                          : zone.density > 65
                            ? "Elevated"
                            : "Normal"}
                      </b>
                    </div>
                    <progress
                      max={100}
                      value={zone.density}
                      aria-label={`${zone.name} density ${zone.density}%`}
                      aria-valuenow={zone.density}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                    <small>
                      {zone.density}% density · {zone.trend > 0 ? "+" : ""}
                      {zone.trend}% trend
                    </small>
                  </div>
                ))}
              </div>
            </section>

            {/* AI copilot panel */}
            <CopilotPanel
              query={query}
              setQuery={setQuery}
              submit={submitCopilot}
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

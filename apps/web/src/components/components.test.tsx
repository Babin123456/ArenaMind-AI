/**
 * ArenaMind — Extracted Component Unit Tests
 *
 * Validates rendering, props, accessibility attributes, and user
 * interactions for MetricCard, PanelTitle, IncidentRow,
 * LanguageSelector, and NotificationsPanel components in isolation.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Activity, AlertTriangle, Radio, Shield } from "lucide-react";

import { MetricCard } from "./metric-card";
import { PanelTitle } from "./panel-title";
import { IncidentRow } from "./incident-row";
import { LanguageSelector } from "./language-selector";
import {
  NotificationsPanel,
  INITIAL_NOTIFICATIONS,
} from "./notifications-panel";

/* ── MetricCard ─────────────────────────────────────────────── */
describe("MetricCard", () => {
  it("renders label, value, and detail text", () => {
    render(
      <MetricCard
        icon={Activity}
        label="Attendance"
        value="71,482"
        detail="89% of capacity"
        tone="cyan"
      />
    );
    expect(screen.getByText("Attendance")).toBeInTheDocument();
    expect(screen.getByText("71,482")).toBeInTheDocument();
    expect(screen.getByText("89% of capacity")).toBeInTheDocument();
  });

  it("applies the correct tone CSS class", () => {
    const { container } = render(
      <MetricCard
        icon={AlertTriangle}
        label="Incidents"
        value="3"
        detail="2 critical"
        tone="danger"
      />
    );
    const article = container.querySelector("article");
    expect(article?.className).toContain("danger");
  });

  it("is keyboard-focusable for screen reader navigation", () => {
    const { container } = render(
      <MetricCard
        icon={Activity}
        label="Test"
        value="0"
        detail="None"
        tone="success"
      />
    );
    const article = container.querySelector("article");
    expect(article).toHaveAttribute("tabindex", "0");
  });

  it("hides the icon from assistive technology", () => {
    const { container } = render(
      <MetricCard
        icon={Activity}
        label="Hidden icon test"
        value="1"
        detail="detail"
        tone="cyan"
      />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});

/* ── PanelTitle ─────────────────────────────────────────────── */
describe("PanelTitle", () => {
  it("renders heading and subtitle text", () => {
    render(
      <PanelTitle
        icon={Radio}
        title="Resource Readiness"
        subtitle="Live deployment status"
      />
    );
    expect(screen.getByRole("heading", { name: "Resource Readiness" })).toBeInTheDocument();
    expect(screen.getByText("Live deployment status")).toBeInTheDocument();
  });

  it("renders the action button when provided", () => {
    render(
      <PanelTitle
        icon={Radio}
        title="Test"
        subtitle="Sub"
        action="Open intelligence"
      />
    );
    expect(screen.getByRole("button", { name: /open intelligence/i })).toBeInTheDocument();
  });

  it("does not render an action button when omitted", () => {
    render(
      <PanelTitle icon={Radio} title="Test" subtitle="Sub" />
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

/* ── IncidentRow ────────────────────────────────────────────── */
describe("IncidentRow", () => {
  it("renders severity, title, and metadata", () => {
    render(
      <IncidentRow
        severity="Critical"
        time="2m"
        title="North Plaza threshold exceeded"
        meta="Zone N-04 · Unit S12 responding"
      />
    );
    expect(screen.getByText("Critical")).toBeInTheDocument();
    expect(screen.getByText("North Plaza threshold exceeded")).toBeInTheDocument();
    expect(screen.getByText("Zone N-04 · Unit S12 responding")).toBeInTheDocument();
    expect(screen.getByText("2m")).toBeInTheDocument();
  });

  it("applies the correct severity CSS class", () => {
    const { container } = render(
      <IncidentRow severity="Medium" time="5m" title="Test" meta="Meta" />
    );
    const badge = container.querySelector(".severity");
    expect(badge?.className).toContain("medium");
  });

  it("renders as an interactive button element", () => {
    render(
      <IncidentRow severity="Low" time="10m" title="Kiosk issue" meta="Level 2" />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

/* ── LanguageSelector ───────────────────────────────────────── */
describe("LanguageSelector", () => {
  it("renders with English selected by default", () => {
    render(<LanguageSelector />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("en");
  });

  it("includes all eight supported FIFA World Cup languages", () => {
    render(<LanguageSelector />);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(8);
  });

  it("calls onLanguageChange when user selects a language", () => {
    const onChange = vi.fn();
    render(<LanguageSelector onLanguageChange={onChange} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "es" } });
    expect(onChange).toHaveBeenCalledWith("es");
  });

  it("has an accessible label for screen readers", () => {
    render(<LanguageSelector />);
    expect(screen.getByLabelText(/select.*language/i)).toBeInTheDocument();
  });
});

/* ── NotificationsPanel ─────────────────────────────────────── */
describe("NotificationsPanel", () => {
  const defaultProps = {
    notifications: INITIAL_NOTIFICATIONS,
    isOpen: false,
    onToggle: vi.fn(),
    onClear: vi.fn(),
  };

  it("renders the bell button with correct unread count", () => {
    render(<NotificationsPanel {...defaultProps} />);
    expect(screen.getByLabelText(/notifications, 3 unread/i)).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not show dropdown when closed", () => {
    render(<NotificationsPanel {...defaultProps} />);
    expect(screen.queryByText("Operations Alerts")).not.toBeInTheDocument();
  });

  it("shows dropdown with alerts when open", () => {
    render(<NotificationsPanel {...defaultProps} isOpen={true} />);
    expect(screen.getByText("Operations Alerts")).toBeInTheDocument();
    expect(screen.getByText("North Plaza crowd density exceeded limit")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
  });

  it("calls onToggle when bell button is clicked", () => {
    const onToggle = vi.fn();
    render(<NotificationsPanel {...defaultProps} onToggle={onToggle} />);
    fireEvent.click(screen.getByLabelText(/notifications/i));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("calls onClear when Clear All is clicked", () => {
    const onClear = vi.fn();
    render(
      <NotificationsPanel {...defaultProps} isOpen={true} onClear={onClear} />
    );
    fireEvent.click(screen.getByText("Clear All"));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("shows empty state when no notifications exist", () => {
    render(
      <NotificationsPanel
        notifications={[]}
        isOpen={true}
        onToggle={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.getByText(/no active alerts/i)).toBeInTheDocument();
    expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
  });

  it("has aria-expanded attribute matching open state", () => {
    const { rerender } = render(<NotificationsPanel {...defaultProps} />);
    expect(screen.getByLabelText(/notifications/i)).toHaveAttribute("aria-expanded", "false");

    rerender(<NotificationsPanel {...defaultProps} isOpen={true} />);
    expect(screen.getByLabelText(/notifications/i)).toHaveAttribute("aria-expanded", "true");
  });

  it("applies severity-specific CSS classes to alert items", () => {
    const { container } = render(
      <NotificationsPanel {...defaultProps} isOpen={true} />
    );
    expect(container.querySelector(".severity-critical")).toBeInTheDocument();
    expect(container.querySelector(".severity-medium")).toBeInTheDocument();
    expect(container.querySelector(".severity-low")).toBeInTheDocument();
  });
});

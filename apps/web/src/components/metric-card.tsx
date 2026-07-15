"use client";

import type { LucideIcon } from "lucide-react";

/**
 * Visual tone applied to a metric card.
 *
 * - `cyan`    – neutral informational (e.g. attendance)
 * - `danger`  – active risk that needs attention (e.g. incidents)
 * - `success` – within healthy thresholds (e.g. medical readiness)
 */
export type MetricTone = "cyan" | "danger" | "success";

interface MetricCardProps {
  /** Lucide icon rendered in the trailing position. */
  icon: LucideIcon;
  /** Short accessible label (e.g. "Attendance"). */
  label: string;
  /** Primary numeric or textual value (e.g. "71,482"). */
  value: string;
  /** Supporting detail shown beneath the value (e.g. "89% of capacity"). */
  detail: string;
  /** Visual tone for contextual colour coding. */
  tone: MetricTone;
}

/**
 * Displays a single KPI metric within the operations dashboard.
 *
 * Cards are keyboard-focusable so operators can scan metrics with Tab.
 * The icon is decorative (`aria-hidden`) — the label conveys meaning.
 */
export function MetricCard({ icon: Icon, label, value, detail, tone }: MetricCardProps) {
  return (
    <article className={`metric ${tone}`} tabIndex={0}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
      <Icon aria-hidden="true" />
    </article>
  );
}

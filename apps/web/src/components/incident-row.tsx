"use client";

import { ChevronRight } from "lucide-react";

interface IncidentRowProps {
  /** Severity label (Critical, Medium, Low). */
  severity: string;
  /** Elapsed time since the incident was reported. */
  time: string;
  /** Short incident description. */
  title: string;
  /** Zone, responding unit, or other contextual metadata. */
  meta: string;
}

/**
 * Renders a single incident row inside the priority incidents panel.
 *
 * The severity label includes a coloured left border to give a
 * non-colour-only status cue (the text "Critical" / "Medium" / "Low"
 * is always visible alongside the colour).
 */
export function IncidentRow({ severity, time, title, meta }: IncidentRowProps) {
  return (
    <button className="incident">
      <span className={`severity ${severity.toLowerCase()}`}>{severity}</span>
      <div>
        <strong>{title}</strong>
        <small>{meta}</small>
      </div>
      <time>{time}</time>
      <ChevronRight />
    </button>
  );
}

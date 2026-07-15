"use client";

import { ChevronRight } from "lucide-react";
import type { Dashboard } from "@/lib/api";

/**
 * Content map for each operational domain.
 *
 * Keys correspond to navigation labels; each value provides a headline
 * and three priority items displayed when the operator switches context.
 */
const domainContent: Record<string, { headline: string; items: string[] }> = {
  "Crowd intelligence": {
    headline: "Predictive crowd control",
    items: [
      "North Plaza threshold exceeded",
      "Gate C recovering",
      "Relief route N-2 available",
    ],
  },
  Security: {
    headline: "Security coordination",
    items: [
      "42 units deployed",
      "Perimeter integrity normal",
      "1 critical response active",
    ],
  },
  Medical: {
    headline: "Medical readiness",
    items: [
      "12 teams available",
      "Median dispatch 2m 18s",
      "Emergency lanes protected",
    ],
  },
  Workforce: {
    headline: "Volunteer operations",
    items: [
      "184 volunteers available",
      "27 tasks due this hour",
      "6 accessibility assistants staged",
    ],
  },
  Transportation: {
    headline: "Multimodal transport",
    items: [
      "Rail Platform 2 delayed",
      "Bus hubs operating normally",
      "South pedestrian flow rising",
    ],
  },
  Sustainability: {
    headline: "Venue sustainability",
    items: [
      "Energy 8.7 MW",
      "Water 1,280 L/min",
      "Optimization guardrails active",
    ],
  },
  "Venue navigation": {
    headline: "Fan wayfinding & accessible routes",
    items: [
      "Gate D fastest entry — 4 min wait",
      "Accessible lift route via East Ramp",
      "Concourse F food court least congested",
    ],
  },
};

interface DomainBriefProps {
  /** Currently selected navigation view name. */
  view: string;
  /** Live dashboard data providing the operator's role. */
  data: Dashboard;
}

/**
 * Role-aware domain brief shown when the operator selects a non-Overview
 * navigation item.
 *
 * Displays a headline, a role-contextual tagline, and three numbered
 * priority items to orient the operator before they scan detailed panels.
 */
export function DomainBrief({ view, data }: DomainBriefProps) {
  const content = domainContent[view] ?? domainContent["Crowd intelligence"];

  return (
    <section className="domain-brief" aria-labelledby="domain-title">
      <div>
        <p className="eyebrow">ROLE-AWARE OPERATIONAL VIEW</p>
        <h2 id="domain-title">{content.headline}</h2>
        <p>
          Prioritized for {data.role.replaceAll("_", " ")} with live venue
          context.
        </p>
      </div>
      <div>
        {content.items.map((item, index) => (
          <article key={item}>
            <span>0{index + 1}</span>
            <strong>{item}</strong>
            <ChevronRight />
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Activity } from "lucide-react";
import { PanelTitle } from "./panel-title";
import type { Dashboard } from "@/lib/api";
import type { TranslationStrings } from "@/lib/translations";

/**
 * Simulated crowd-pressure trend for the last 90 minutes.
 * In production this would be streamed from venue sensor aggregation.
 */
const CROWD_TREND_DATA = [
  { t: "18:00", v: 42 },
  { t: "18:15", v: 48 },
  { t: "18:30", v: 57 },
  { t: "18:45", v: 63 },
  { t: "19:00", v: 71 },
  { t: "19:15", v: 68 },
];

/** Density-level thresholds for crowd zone severity classification. */
const DENSITY_THRESHOLDS = { critical: 80, elevated: 65 } as const;

interface CrowdChartProps {
  /** Current real-time crowd pressure index (0–100). */
  crowdIndex: number;
  /** Zone density data from the dashboard API. */
  data: Dashboard;
  /** Active translation strings for labels. */
  t: TranslationStrings;
}

/**
 * Displays the crowd-pressure chart, real-time index, and per-zone
 * density breakdown inside the operations dashboard.
 *
 * The chart renders a 90-minute pressure trend using Recharts, while
 * the zone bars use native `<progress>` elements for accessibility.
 */
export function CrowdChart({ crowdIndex, data, t }: CrowdChartProps) {
  return (
    <section className="panel crowd">
      <PanelTitle
        icon={Activity}
        title="Crowd Pressure"
        subtitle="Sensor-fused density · last 90 minutes"
        action="Open intelligence"
      />
      <div className="chart-summary">
        <div>
          <span>{t.stadiumPressure}</span>
          <strong>{crowdIndex}</strong>
          <small>
            {crowdIndex > DENSITY_THRESHOLDS.critical
              ? "Critical · High congestion"
              : crowdIndex > DENSITY_THRESHOLDS.elevated
                ? "Moderate · rising"
                : "Normal · flow steady"}
          </small>
        </div>
        <div
          className="chart"
          aria-label="Crowd pressure rose from 42 to 68 over 90 minutes"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CROWD_TREND_DATA}>
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
                  zone.density > DENSITY_THRESHOLDS.critical
                    ? "critical"
                    : zone.density > DENSITY_THRESHOLDS.elevated
                      ? "warning"
                      : "normal"
                }
              >
                {zone.density > DENSITY_THRESHOLDS.critical
                  ? "High"
                  : zone.density > DENSITY_THRESHOLDS.elevated
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
  );
}

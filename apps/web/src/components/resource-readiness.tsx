"use client";

import type { LucideIcon } from "lucide-react";

interface ResourceProps {
  /** Lucide icon identifying the resource category. */
  icon: LucideIcon;
  /** Resource label (e.g. "Security units"). */
  label: string;
  /** Current deployment status text (e.g. "42 / 48"). */
  value: string;
  /** Readiness percentage (0–100) driving the progress bar. */
  percent: number;
}

/**
 * Displays a single resource-readiness row with a labelled progress bar.
 *
 * The `<progress>` element includes `aria-valuenow`, `aria-valuemin`,
 * and `aria-valuemax` so assistive technology can announce the
 * current deployment percentage to non-sighted operators.
 */
export function Resource({ icon: Icon, label, value, percent }: ResourceProps) {
  return (
    <div className="resource">
      <Icon />
      <div>
        <span>
          {label}
          <b>{value}</b>
        </span>
        <progress
          value={percent}
          max={100}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} ${percent}% ready`}
        />
      </div>
    </div>
  );
}

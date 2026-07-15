"use client";

import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PanelTitleProps {
  /** Lucide icon displayed in the leading accent square. */
  icon: LucideIcon;
  /** Panel heading text. */
  title: string;
  /** Descriptive subtitle rendered below the heading. */
  subtitle: string;
  /** Optional trailing action button label (e.g. "Open intelligence"). */
  action?: string;
}

/**
 * Shared header strip for dashboard panels.
 *
 * Renders an icon, heading pair, and an optional trailing action button.
 * The icon is placed inside a coloured square to establish visual
 * hierarchy and reinforce the panel's operational domain.
 */
export function PanelTitle({ icon: Icon, title, subtitle, action }: PanelTitleProps) {
  return (
    <header className="panel-title">
      <div className="title-icon">
        <Icon />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && (
        <button>
          {action}
          <ChevronRight />
        </button>
      )}
    </header>
  );
}

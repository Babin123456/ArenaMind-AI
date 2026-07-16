"use client";

import { Bell } from "lucide-react";

/** Shape of an operational notification/alert. */
export interface Notification {
  id: number;
  severity: "critical" | "medium" | "low";
  text: string;
  time: string;
}

/** Initial seed notifications displayed on dashboard load. */
export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, severity: "critical", text: "North Plaza crowd density exceeded limit", time: "2m" },
  { id: 2, severity: "medium", text: "Platform 2 transit rail delay increased", time: "8m" },
  { id: 3, severity: "low", text: "Concourse kiosk power interruption resolved", time: "14m" },
];

interface NotificationsPanelProps {
  /** Current list of active notifications. */
  notifications: Notification[];
  /** Whether the dropdown is currently visible. */
  isOpen: boolean;
  /** Toggle the dropdown visibility. */
  onToggle: () => void;
  /** Clear all notifications. */
  onClear: () => void;
}

/**
 * Notification bell button with an accessible dropdown panel.
 *
 * Renders an icon button with unread count badge. When expanded,
 * shows a dropdown listing operational alerts with severity-coded
 * borders and elapsed time. Includes `aria-expanded` and
 * `aria-controls` for assistive technology.
 */
export function NotificationsPanel({
  notifications,
  isOpen,
  onToggle,
  onClear,
}: NotificationsPanelProps) {
  return (
    <>
      <button
        className="icon-btn"
        aria-label={`Notifications, ${notifications.length} unread`}
        aria-expanded={isOpen}
        aria-controls="notifications-dropdown"
        onClick={onToggle}
      >
        <Bell />
        {notifications.length > 0 && <span>{notifications.length}</span>}
      </button>

      {isOpen && (
        <div
          id="notifications-dropdown"
          className="notifications-dropdown"
          role="region"
          aria-label="Operations alerts"
        >
          <div className="notifications-header">
            <strong>Operations Alerts</strong>
            {notifications.length > 0 && (
              <button className="notifications-clear" onClick={onClear}>
                Clear All
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="notifications-empty">
              No active alerts — nominal state
            </p>
          ) : (
            <div className="notifications-list">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item severity-${n.severity}`}
                >
                  <div className="notification-text">{n.text}</div>
                  <small className="notification-time">{n.time} ago</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

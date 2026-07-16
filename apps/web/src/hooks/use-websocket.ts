"use client";

import { useEffect, useState } from "react";

/**
 * Manages a reconnecting WebSocket connection for live venue telemetry.
 *
 * Establishes a WebSocket connection when `enabled` is true, parses
 * heartbeat messages for crowd-index updates, and automatically
 * reconnects after a 5-second delay on disconnection.
 *
 * @param enabled  Whether to establish the connection (typically `authenticated`).
 * @returns Object with connection status and latest crowd index.
 */
export function useWebSocket(enabled: boolean) {
  const [wsConnected, setWsConnected] = useState(false);
  const [crowdIndex, setCrowdIndex] = useState(68);

  useEffect(() => {
    if (!enabled) return;

    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    function connect() {
      const jwtToken = sessionStorage.getItem("arenamind_token") || "";
      const baseWsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
      const wsUrl = `${baseWsUrl}/operations?token=${encodeURIComponent(jwtToken)}`;

      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "heartbeat") {
            if (typeof message.crowd_index === "number") {
              setCrowdIndex(message.crowd_index);
            }
          }
        } catch (e) {
          console.error("Error parsing WebSocket message", e);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        reconnectTimeout = setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        ws?.close();
      };
    }

    connect();

    return () => {
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [enabled]);

  return { wsConnected, crowdIndex } as const;
}

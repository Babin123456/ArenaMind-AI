"use client";

import { Bot, ChevronRight } from "lucide-react";
import type { FormEvent } from "react";
import type { CopilotAnswer } from "@/lib/api";
import { PanelTitle } from "./panel-title";

/** Suggested prompts shown when the copilot is idle. */
const SUGGESTED_PROMPTS = [
  "Optimize exit flow for North Plaza after Match 14",
  "Plan route for wheelchair access from Gate C to Suite 204",
  "Verify energy optimization restrictions for medical fridges",
  "Predict transit shuttle wait times under heavy rail delay",
  "Translate concourse safety announcement to Spanish and French",
] as const;

interface CopilotPanelProps {
  /** Current query input value. */
  query: string;
  /** Setter for the query input value. */
  setQuery: (value: string) => void;
  /** Direct query submission handler. */
  onAsk: (text: string) => void;
  /** Mutation state from React Query (pending, data, error). */
  state: {
    isPending: boolean;
    data?: CopilotAnswer;
    error: Error | null;
  };
}

/**
 * AI Operations Copilot panel providing context-aware decision support.
 *
 * Operators type a natural-language question about current operations.
 * The panel renders a loading skeleton while the backend retrieves
 * evidence from approved playbooks and queries Gemini/Groq, then
 * displays a structured answer with confidence and provenance.
 *
 * Suggested prompts are shown when idle to guide operators toward
 * common operational queries.
 */
export function CopilotPanel({ query, setQuery, onAsk, state }: CopilotPanelProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onAsk(query);
  }

  return (
    <section className="panel copilot">
      <PanelTitle
        icon={Bot}
        title="AI Operations Copilot"
        subtitle="Decision support · context aware"
      />

      {/* Query input */}
      <form onSubmit={handleSubmit}>
        <label htmlFor="copilot">Ask about current operations</label>
        <div>
          <input
            id="copilot"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Where should I deploy volunteers?"
            minLength={3}
          />
          <button aria-label="Ask copilot" disabled={state.isPending}>
            <ChevronRight />
          </button>
        </div>
      </form>

      {/* Response states */}
      {state.isPending ? (
        <div className="skeleton" aria-live="polite">
          Analyzing operational context…
        </div>
      ) : state.error ? (
        <div className="answer" aria-live="polite" style={{ borderColor: "var(--red)", background: "rgba(239, 68, 68, 0.05)" }}>
          <strong style={{ color: "var(--red)" }}>Query Failed</strong>
          <p style={{ color: "#fca5a5" }}>{state.error.message}</p>
          <small style={{ color: "var(--red)", fontWeight: 700 }}>Connection or provider error</small>
        </div>
      ) : state.data ? (
        <div className="answer" aria-live="polite">
          <strong>{state.data.summary}</strong>
          <p>{state.data.reasoning[0]}</p>
          <ul>
            {state.data.recommendations.slice(0, 2).map((rec) => (
              <li key={rec}>{rec}</li>
            ))}
          </ul>
          <small>
            {Math.round(state.data.confidence * 100)}% confidence ·{" "}
            {state.data.generated_by}
          </small>
        </div>
      ) : (
        <div className="prompts">
          <span>Suggested Operational Queries</span>
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button key={prompt} onClick={() => onAsk(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

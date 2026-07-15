"use client";

import { Bot, ChevronRight } from "lucide-react";
import type { FormEvent } from "react";
import type { CopilotAnswer } from "@/lib/api";
import { PanelTitle } from "./panel-title";

/** Suggested prompts shown when the copilot is idle. */
const SUGGESTED_PROMPTS = [
  "Show overcrowded gates",
  "Predict congestion",
  "Summarize incidents",
] as const;

interface CopilotPanelProps {
  /** Current query input value. */
  query: string;
  /** Setter for the query input value. */
  setQuery: (value: string) => void;
  /** Form submission handler. */
  submit: (event: FormEvent) => void;
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
export function CopilotPanel({ query, setQuery, submit, state }: CopilotPanelProps) {
  return (
    <section className="panel copilot">
      <PanelTitle
        icon={Bot}
        title="AI Operations Copilot"
        subtitle="Decision support · context aware"
      />

      {/* Query input */}
      <form onSubmit={submit}>
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
          <span>Suggested</span>
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button key={prompt} onClick={() => setQuery(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

# 🧪 Testing Strategy

The test pyramid consists of unit tests for policies/services, API contract tests, component tests, integration tests with MongoDB/Redis, accessibility checks with axe, and Playwright critical journeys. Load tests cover dashboard reads, incident bursts, and WebSocket fan-out. Gemini/Groq evaluations measure grounding, actionability, refusal quality, provider provenance, and unsafe recommendation rate.

Commands:

```bash
cd apps/api && ../../.venv/Scripts/python -m pytest
cd apps/web && npm test
cd apps/web && npm run build
docker compose config
```

The committed suite currently includes **13 backend unit/integration tests** and **4 frontend component/accessibility tests**, covering token type enforcement, token refresh flow, unauthenticated denial, role-aware dashboards, volunteer and fan permission denial, prompt-injection refusal, retrieved-source propagation, accessible sign-in semantics, and automated axe scanning. Release gates require all critical journeys, zero serious axe violations, no high/critical dependency findings, and coverage targets of 85% domain services and 75% overall. Coverage is evidence, not a substitute for behavior-focused assertions. Provider contract tests must use recorded, sanitized fixtures in CI; live-key smoke tests belong in a protected deployment environment.

# 🔌 API Reference

Base path: `/api/v1`. Interactive OpenAPI is available at `/api/docs`.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/auth/login` | Public bootstrap | Exchange development identity for JWT |
| POST | `/auth/refresh` | Refresh token | Rotate into a new access/refresh pair |
| POST | `/users` | Administrator | Provision a MongoDB-backed role identity |
| GET | `/dashboard` | Authenticated | Aggregate live command metrics |
| GET | `/incidents` | Authenticated | List incidents by newest first |
| POST | `/incidents` | Operational roles | Create a validated incident |
| GET | `/assignments` | Authenticated | List role-filtered assignments |
| POST | `/assignments` | Operational roles | Assign a responder or volunteer task |
| POST | `/knowledge` | Admin/operations | Add an approved, embedded playbook document |
| POST | `/copilot/query` | Authenticated | Generate explainable operational guidance |
| WS | `/ws/operations` | Token required | Receive operational heartbeat/events |
| GET | `/health` | Public | Liveness status |
| GET | `/ready` | Public/internal | Verify MongoDB readiness |

Errors use HTTP status semantics. `401` indicates missing/invalid identity, `403` insufficient role, `422` invalid input, and `5xx` an unavailable dependency. Clients must use exponential backoff only for idempotent requests.

Copilot responses include `summary`, ordered `reasoning`, actionable `recommendations`, numeric `confidence`, retrieved `sources`, and `generated_by`. Prompt-control attacks are rejected before provider invocation. Consumers must show provenance and must not automatically execute recommendations.

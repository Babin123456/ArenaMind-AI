# 🏗️ ArenaMind — System Architecture

---
### 🧭 Navigation
[🏠 Home (README)](README.md) | [🏗️ Architecture](ARCHITECTURE.md) | [🚀 Deployment Guide](DEPLOYMENT.md) | [🛡️ Security Policy](SECURITY.md) | [📖 File Instructions](INSTRUCTIONS.md)
---

This document outlines the system, database, security, and integration architecture for the ArenaMind AI platform.

---

## 🗺️ System Topology

ArenaMind AI is configured as a modular monorepo, separating the Next.js presentation layers from the FastAPI business logic while maintaining strict API contracts.

```mermaid
flowchart LR
  U[Role-based users] --> E[NGINX edge proxy]
  E --> W[Next.js console]
  E --> A[FastAPI API]
  A --> P[(MongoDB)]
  A --> R[(Redis)]
  A --> O[Gemini or Groq]
  A <--> S[Venue sensors and systems]
```

---

## ⚡ 1. Backend Service Layer

The FastAPI backend routes validate incoming request schemas using Pydantic contracts and enforce security checks via the JWT/RBAC dependency layer before invoking the appropriate domain services.

```mermaid
sequenceDiagram
  actor Operator
  participant UI as Next.js
  participant API as FastAPI
  participant Auth as JWT/RBAC
  participant AI as Copilot service
  Operator->>UI: Submit operational question
  UI->>API: POST /copilot/query
  API->>Auth: Verify token and role
  API->>AI: Query plus bounded context
  AI-->>API: Structured recommendation
  API-->>UI: Validated response and provenance
```

---

## 📡 2. Real-Time WebSocket Workflows

Live operational metrics and active incident alerts are streamed in real time to all signed-in dashboards via Redis pub/sub.

```mermaid
sequenceDiagram
  participant C as Console
  participant W as WebSocket gateway
  participant R as Redis pub/sub
  participant I as Ingestion workers
  C->>W: Connect with short-lived token
  I->>R: Publish normalized event
  R-->>W: Fan-out event
  W-->>C: Typed operational update
```

---

## 🍃 3. Data Architecture

- **Primary Database**: MongoDB serves as the persistent system of record. High-importance collections (such as `users`, `incidents`, `assignments`, `audit_events`) use indexed queries for O(1) retrieval.
- **Cache Store**: Redis acts as an in-memory key-value store cache for roles and dashboard views with automatic expiration (TTL), as well as serving pub/sub channels.

---

## 🚀 4. Production Deployment Topology

The stateless Next.js web application and FastAPI backend containers are replicated horizontally behind edge load balancers, storing persistent assets in managed cloud databases.

```mermaid
flowchart TB
  CDN[WAF / CDN] --> LB[Load balancer]
  LB --> N[NGINX replicas]
  N --> WEB[Next.js replicas]
  N --> API[FastAPI replicas]
  API --> PG[(MongoDB replica set)]
  API --> REDIS[(Redis HA)]
  API --> WORKERS[Celery workers]
  WORKERS --> OBJ[(S3-compatible storage)]
```

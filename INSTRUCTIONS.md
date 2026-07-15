# 📖 ArenaMind AI — File & Folder Working Principles

This document explains the working principles and responsibilities of each file and folder in the ArenaMind AI codebase.

---

## 🏗️ Folder Structure Overview

```text
ArenaMind-AI/
├── apps/
│   ├── api/          # FastAPI Python backend (services, logic, DB access, and tests)
│   └── web/          # Next.js 15 TypeScript frontend (operations dashboard)
├── infra/            # Production Nginx reverse-proxy edge configuration
└── *.md              # Root documentation files
```

---

## ⚡ Backend Component (`apps/api`)

The backend is built with **FastAPI** and uses **Pydantic** for schema validation, **PyJWT** for token security, **pymongo** for async MongoDB access, and **redis** for caching.

### 📁 `apps/api/app/` (Application Core)
- 📌 [__init__.py](file:///d:/Projects/ArenaMind-AI/apps/api/app/__init__.py): Initializes the Python package.
- 📌 [config.py](file:///d:/Projects/ArenaMind-AI/apps/api/app/config.py): Exposes settings validated by `pydantic-settings`. Loads environment variables from the `.env` file, enforces required values in production, and validates that `AI_PROVIDER` is either `gemini` or `groq`.
- 📌 [main.py](file:///d:/Projects/ArenaMind-AI/apps/api/app/main.py): Entry point for the FastAPI server. Sets up CORS middleware, rate limiters (`slowapi`), API route registrations, startup database seeding hook, and the real-time `/ws/operations` WebSocket endpoint for incident push broadcasts.
- 📌 [schemas.py](file:///d:/Projects/ArenaMind-AI/apps/api/app/schemas.py): Contains all Pydantic request and response schemas (e.g. `IncidentCreate`, `UserCreate`, `CopilotQuery`). Enforces strict formatting validations (such as regex, minimum/maximum lengths) on incoming request payloads.
- 📌 [security.py](file:///d:/Projects/ArenaMind-AI/apps/api/app/security.py): Implements Argon2 password hashing and JWT access/refresh token generation and verification. Contains the Role-Based Access Control (RBAC) dependency logic (`require_roles`).
- 📌 [services.py](file:///d:/Projects/ArenaMind-AI/apps/api/app/services.py): The core business logic layer:
  - `MongoStore`: Manages async connection pools to MongoDB and provisions indexes.
  - `CacheService`: Handles short-lived Redis dashboard caching with graceful fallback.
  - `AuditService`: Appends immutable audit trails to MongoDB for security tracking.
  - `AuthService`: Controls password authentication and bootstrap admin account seeding.
  - `IncidentService`: Manages CRUD and status changes for operational reports.
  - `AssignmentService`: Allocates tasks to responders and filters them by role.
  - `KnowledgeService`: Hosts operational playbooks and ranks them using deterministic similarity embeddings (RAG).
  - `CopilotService`: Retrieves evidence, checks for prompt injection, calls LLM providers (Gemini/Groq), and returns advisory recommendations.

### 📁 `apps/api/tests/` (Test Suite)
- 📌 [test_api.py](file:///d:/Projects/ArenaMind-AI/apps/api/tests/test_api.py): Contains 13 unit and integration tests. Covers authentication, token refresh, RBAC, input validation (invalid categories, short fields), prompt injection rejections, and copilot structured fallbacks.
- 📌 [pytest.ini](file:///d:/Projects/ArenaMind-AI/apps/api/pytest.ini): Configures pytest options, default search directories, and async test markers.

### 📁 Configuration & Docker
- 📌 [Dockerfile](file:///d:/Projects/ArenaMind-AI/apps/api/Dockerfile): Multi-stage container build file for production-ready, minimal API images running as a non-root user.
- 📌 [requirements.txt](file:///d:/Projects/ArenaMind-AI/apps/api/requirements.txt): Lists production Python dependencies.
- 📌 [requirements-dev.txt](file:///d:/Projects/ArenaMind-AI/apps/api/requirements-dev.txt): Lists development dependencies (like `pytest` and `pytest-asyncio`).

---

## 🌐 Frontend Component (`apps/web`)

The frontend is built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind-free Vanilla CSS**.

### 📁 `apps/web/src/components/` (React Components)
- 📌 [dashboard.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/dashboard.tsx): Main dashboard shell. Handles sidebar navigation routing, fetches live operational data, hooks up WebSocket state, and organizes the panels.
- 📌 [login-screen.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/login-screen.tsx): Authentication form boundary. Captures credentials, displays form errors, and manages session storage tokens.
- 📌 [copilot-panel.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/copilot-panel.tsx): Copilot interface. Displays query inputs, loading skeletons, confidence levels, reasoning steps, recommendations, and source grounding.
- 📌 [language-selector.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/language-selector.tsx): Interactive language selection dropdown supporting 8 FIFA World Cup languages for multilingual fan assistance.
- 📌 [metric-card.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/metric-card.tsx): KPI stat cards displaying key values (attendance, active incidents, wait times) with tone-contextual styling.
- 📌 [resource-readiness.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/resource-readiness.tsx): Progress indicators for units (Security, Medical, Volunteers) with full ARIA accessibility markers.
- 📌 [incident-row.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/incident-row.tsx): Individual row items for listing active incidents with colored severity badges.
- 📌 [domain-brief.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/domain-brief.tsx): Dynamic summary blocks showing role-contextual priorities and wayfinding routes.
- 📌 [panel-title.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/panel-title.tsx): Standardized headers for panel boxes.
- 📌 [providers.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/providers.tsx): Configures the React Query client provider.
- 📌 [dashboard.test.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/components/dashboard.test.tsx): Next.js frontend vitest suite containing accessibility scans (axe-core) and component semantic tests.

### 📁 `apps/web/src/app/` (Next.js App Routing)
- 📌 [layout.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/app/layout.tsx): Top-level document template configuring Google Fonts Inter, global HTML, and metadata.
- 📌 [page.tsx](file:///d:/Projects/ArenaMind-AI/apps/web/src/app/page.tsx): Main page entry rendering the `<OperationsDashboard />` component.
- 📌 [globals.css](file:///d:/Projects/ArenaMind-AI/apps/web/src/app/globals.css): Clean, readable global CSS stylesheets detailing tokens, layout systems, sidebar, header styles, and charts.
- 📌 [motion.css](file:///d:/Projects/ArenaMind-AI/apps/web/src/app/motion.css): Holds custom visual design enhancements (animations, overlays, grids, backgrounds) separating motion behaviors from core layout.

### 📁 `apps/web/src/lib/` & `apps/web/src/test/`
- 📌 [api.ts](file:///d:/Projects/ArenaMind-AI/apps/web/src/lib/api.ts): Central API client for sending authenticated JSON requests, containing session lifecycle helpers and a mock fallback structure.
- 📌 [setup.ts](file:///d:/Projects/ArenaMind-AI/apps/web/src/test/setup.ts): Configures testing environment (e.g. extending Jest Matchers for Vitest).

---

## 🛡️ Reverse Proxy Edge (`infra`)
- 📌 [nginx.conf](file:///d:/Projects/ArenaMind-AI/infra/nginx.conf): NginX reverse-proxy configuration. Implements edge rate limits (`limit_req`), security headers (CSP, Frame-Options, XSS protections), and routing rules pointing external traffic to the frontend and backend services.

<div align="center">

![ArenaMind animated header](https://capsule-render.vercel.app/api?type=waving&color=0:09090B,45:111827,100:00E5FF&height=220&section=header&text=ArenaMind%20AI&fontColor=F8FAFC&fontSize=54&fontAlignY=35&desc=GenAI-Powered%20Smart%20Stadium%20Operations&descAlignY=57&animation=fadeIn)

[![Animated introduction](https://readme-typing-svg.demolab.com?font=Cambria&weight=700&size=22&duration=2800&pause=800&color=00E5FF&center=true&vCenter=true&width=780&lines=Stadium+intelligence+for+FIFA+World+Cup+2026;Explainable+decisions+for+safer+matchdays;Built+for+fans%2C+staff%2C+volunteers+and+responders)](https://git.io/typing-svg)

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Gemini-supported-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/Groq-supported-F55036)](https://console.groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E.svg)](LICENSE)

</div>

---
<div align="center">

### 🧭 Navigation Panel

[![Home](https://img.shields.io/badge/Home-README-09090B?style=flat-square&logo=github&logoColor=00E5FF&labelColor=111827)](README.md) [![Architecture](https://img.shields.io/badge/Architecture-Docs-09090B?style=flat-square&logo=diagrams.net&logoColor=00E5FF&labelColor=111827)](ARCHITECTURE.md) [![Deployment](https://img.shields.io/badge/Deployment-Guide-09090B?style=flat-square&logo=docker&logoColor=00E5FF&labelColor=111827)](DEPLOYMENT.md) [![Security](https://img.shields.io/badge/Security-Policy-09090B?style=flat-square&logo=dependabot&logoColor=00E5FF&labelColor=111827)](SECURITY.md) [![Instructions](https://img.shields.io/badge/Instructions-Files-09090B?style=flat-square&logo=readme&logoColor=00E5FF&labelColor=111827)](INSTRUCTIONS.md)

</div>

> 🏟️ **Hack2Skill Virtual PromptWars — Challenge 4: Smart Stadiums & Tournament Operations**

ArenaMind AI is a role-aware decision-support platform for tournament operations centers. It transforms live crowd, incident, medical, transport, workforce, and sustainability context into explainable recommendations while keeping safety-critical decisions under human control.

## 🎯 Challenge vertical

ArenaMind targets **Smart Stadiums & Tournament Operations** for FIFA World Cup 2026-scale venues. The core persona is the **Operations Manager**, supported by specialized views for security, medical, volunteers, transportation, executives, administrators, and fans.

The platform directly addresses the challenge’s high-impact criteria:

| Evaluation area | ArenaMind response |
| --- | --- |
| Problem alignment | Crowd management, navigation, accessibility, transport, sustainability, multilingual support, and real-time decisions |
| Code quality | Strict TypeScript, typed Pydantic contracts, service/repository boundaries, modular monorepo |
| Security | JWT/RBAC, constrained inputs, trusted hosts, CORS, secure headers, rate limits, non-root containers |
| Efficiency | React Query caching, bounded MongoDB queries, indexed incidents, async APIs, WebSocket updates |
| Testing | API authentication tests, CI build/test gates, documented accessibility and load strategy |
| Accessibility | Semantic HTML, visible focus, non-color status text, reduced motion, mobile layouts, large targets |

## ✨ What it does

- 🤖 **AI Operations Copilot** — reasons over operational context, returns confidence, evidence, assumptions, and ranked actions.
- 📡 **Live Command Dashboard** — crowd pressure, readiness, attendance, incidents, transport, and resources in one scan-friendly view.
- 🚨 **Incident Coordination** — validated, role-gated reporting with indexed MongoDB persistence.
- 🔐 **Production identity boundary** — Argon2 passwords, short-lived access tokens, refresh tokens, administrator provisioning, and explicit RBAC.
- 📚 **Grounded retrieval** — approved playbooks are embedded, stored in MongoDB, ranked for each question, and returned as visible sources.
- 🧭 **Role workspaces** — crowd, security, medical, workforce, transportation, sustainability, administrator, and fan priorities.
- ♿ **Inclusive Operations** — accessible interaction patterns and decision support designed for diverse fans and staff.
- 🚇 **Transport Intelligence** — surfaces service degradation and supports multimodal route decisions.
- 🌱 **Sustainability Signals** — monitors energy, water, waste, and optimization opportunities.
- 🌍 **Provider choice** — use **Groq** or **Google Gemini** through a configurable OpenAI-compatible boundary; no GPT key is required.

## 🧠 Decision logic

```mermaid
flowchart LR
  Q[Operator question] --> C[Validated venue context]
  C --> P[Safety-first prompt]
  P --> L[Gemini or Groq]
  L --> V[Pydantic output validation]
  V --> H[Human-reviewed recommendation]
  H --> A[Auditable operational action]
```

The model cannot directly execute stadium actions. It must return a structured summary, reasoning steps, recommendations, confidence score, evidence sources, and provider provenance. When no API key exists, ArenaMind labels its response as `rules-engine`; it never pretends a model produced it.

## 🚀 Quick start

### Prerequisites

- Docker Desktop with Compose
- Node.js 22+ for local frontend development
- Python 3.13+ for local API development
- A Groq or Gemini API key
- Git and a public GitHub account for challenge submission

### Approach 1: Run with Docker Compose (Recommended)

```bash
git clone https://github.com/Babin123456/ArenaMind-AI.git
cd ArenaMind-AI
copy .env.example .env
docker compose up --build
```

Configure `.env` for Groq:

```dotenv
AI_PROVIDER=groq
AI_API_KEY=your-groq-key
AI_MODEL=llama-3.3-70b-versatile
```

Or configure Gemini:

```dotenv
AI_PROVIDER=gemini
AI_API_KEY=your-gemini-key
AI_MODEL=gemini-2.5-flash
```

Open `http://localhost:8080` in your browser.

#### 🔑 Default Local Credentials
Use these credentials to sign in to the dashboard during local testing:
- **Email**: `administrator@arenamind.local`
- **Password**: `ChangeMe-ArenaMind-2026`

---

### Approach 2: Run Manually (For Active Development)

This approach runs the frontend and backend directly on your host machine to allow quick code changes and hot-reloading.

#### 🗄️ Step 1: Start MongoDB (`27017`) and Redis (`6379`)
You can start the required databases in one of two ways:

* **Method A (Recommended: Hybrid Setup)**: Use Docker to run only the databases (keeps your host machine clean and avoids installing Redis on Windows):
  ```bash
  docker compose up -d mongodb redis
  ```
* **Method B (Native Services)**:
  * **Windows**: Open an **Administrator Command Prompt** and start MongoDB: `net start MongoDB`. Start your local Redis instance (e.g., via WSL using `redis-server`).
  * **macOS**: Start services via Homebrew: `brew services start mongodb-community` and `brew services start redis`.

#### Step 2: Run the FastAPI Backend (`apps/api`)

   ```bash
   cd apps/api
   python -m venv .venv
   # On Windows Git Bash:
   source .venv/Scripts/activate
   # On Windows CMD/PowerShell:
   # .venv\Scripts\activate
   # On macOS/Linux:
   # source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

3. Run the **Next.js Frontend** (`apps/web`):

   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

> 🔐 Never commit `.env`. For complete environment configurations, secret setup details, and production guidelines, read the [Deployment Guide](DEPLOYMENT.md).

## 🏗️ Architecture

```text
ArenaMind-AI/
├── apps/web/       Next.js 15 command console
├── apps/api/       FastAPI security, services, MongoDB repository, tests
├── infra/          NGINX reverse proxy and edge controls
├── .github/        Continuous integration
└── *.md            Architecture, API, database, security and operations guides
```

MongoDB is the system of record, Redis supports coordination and live workloads, and NGINX provides the deployment edge. See [Architecture](ARCHITECTURE.md) for system, sequence, WebSocket, AI, security, and deployment diagrams.

## 📚 Documentation

| Guide | Purpose |
| --- | --- |
| [Architecture](ARCHITECTURE.md) | System boundaries, sequence flows, database design, and AI models |
| [Deployment Guide](DEPLOYMENT.md) | Localhost setup, Docker compose steps, manual setup, and cloud architectures |
| [Security Policy](SECURITY.md) | Threat model, OWASP controls, access restrictions, and vulnerability reporting |
| [File & Folder Instructions](INSTRUCTIONS.md) | Working principles and descriptions of all individual files and folders |
| [MIT License](LICENSE) | Open-source usage and liability terms |

## 🧪 Validation

```bash
cd apps/api && pytest
cd apps/web && npm test
cd apps/web && npm run build
docker compose config
```

The submission should remain below **10 MB**, public, and on **one branch**. Before submitting, verify `git branch --all`, repository visibility, secret scanning, build status, and the public repository link. Challenge rules allow a maximum of three attempts.

Current automated verification includes **13 backend security/RAG/API tests**, **4 frontend component/accessibility tests**, strict TypeScript production compilation, Compose validation, and a production dependency audit with zero known vulnerabilities at the time of verification.

## 💡 Assumptions

- Sensor and transport feeds are normalized by venue adapters before reaching this repository.
- AI output is advisory and requires authorized human confirmation.
- Production identity uses OIDC/MFA; the included bootstrap login supports local evaluation only.
- Venue-specific maps, response plans, and spectator data remain governed by the venue operator.

## 🛣️ Future scope

Privacy-preserving computer vision, venue digital twins, multilingual voice guidance, offline responder mode, RAG over approved playbooks, tournament-wide multi-venue orchestration, and audited automated playbook proposals.

## 👨‍💻 Author

Developed by **Babin Bid** for **Hack2Skill Virtual PromptWars — Challenge 4**.

- GitHub: [@Babin123456](https://github.com/Babin123456)
- LinkedIn: [babinbid123](https://www.linkedin.com/in/babinbid123)
- Email: [babinbid05@gmail.com](mailto:babinbid05@gmail.com)

## 📄 License

Released under the [MIT License](LICENSE). FIFA names describe the challenge context only; ArenaMind AI is not affiliated with or endorsed by FIFA.

<div align="center">

![ArenaMind footer](https://capsule-render.vercel.app/api?type=waving&color=0:00E5FF,55:111827,100:09090B&height=120&section=footer)

</div>

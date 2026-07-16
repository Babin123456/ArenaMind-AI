<div align="center">

![ArenaMind Security Header](https://capsule-render.vercel.app/api?type=waving&color=0:09090B,45:111827,100:EF4444&height=200&section=header&text=Security%20Policy&fontColor=F8FAFC&fontSize=48&fontAlignY=35&desc=Threat%20Model%20and%20Mitigation%20Controls&descAlignY=57&animation=fadeIn)

</div>

---
<div align="center">

### 🧭 Navigation Panel

[![Home](https://img.shields.io/badge/Home-README-09090B?style=flat-square&logo=github&logoColor=00E5FF&labelColor=111827)](README.md) [![Architecture](https://img.shields.io/badge/Architecture-Docs-09090B?style=flat-square&logo=diagrams.net&logoColor=00E5FF&labelColor=111827)](ARCHITECTURE.md) [![Deployment](https://img.shields.io/badge/Deployment-Guide-09090B?style=flat-square&logo=docker&logoColor=00E5FF&labelColor=111827)](DEPLOYMENT.md) [![Security](https://img.shields.io/badge/Security-Policy-09090B?style=flat-square&logo=dependabot&logoColor=00E5FF&labelColor=111827)](SECURITY.md) [![Instructions](https://img.shields.io/badge/Instructions-Files-09090B?style=flat-square&logo=readme&logoColor=00E5FF&labelColor=111827)](INSTRUCTIONS.md)

</div>

This document outlines the threat model, mitigation controls, and vulnerability reporting procedures for the ArenaMind AI platform.

---

## 🎛️ Security Threat & Control Flow

This diagram illustrates how ArenaMind intercepts threats at each system layer:

```mermaid
graph TD
    User([External Client Request]) --> |1. Throttling / CSP / CORS| Proxy[NginX Reverse Proxy Edge]
    Proxy --> |2. JWT / RBAC Validation| Auth[FastAPI Auth Gateway]
    Auth --> |3. Strict Pydantic Contracts| Logic[Business Services Layer]
    Logic --> |4. Prompt Injection Guard| Copilot[GenAI Copilot Service]
    Logic --> |5. Immutable Log Append| Audit[(MongoDB Audit Trail)]
```

---

## ☣️ 1. Threat Model

ArenaMind operates in high-stakes stadium environments where service availability and data integrity are paramount. The threat landscape includes:

- **Identity Theft**: Compromise of operator accounts to manipulate response actions.
- **Data Tampering**: Malicious modification of active incidents, volunteer tasks, or access routes.
- **Prompt Injection**: Overriding LLM system prompts to extract private system guidelines or generate unsafe instructions.
- **Resource Exhaustion**: Denials of Service (DDoS) aimed at degrading stadium coordination channels during critical match hours.
- **Provider Leakage**: Unintended leaks of venue-sensitive security documents or spectator details to external AI providers.

---

## 🛡️ 2. Mitigation Controls

We implement a multi-layered defense-in-depth model across the entire application stack:

### 🔐 Layer A: Identity & Authorization

- **Strict Role-Based Access Control (RBAC)**: All sensitive routes (e.g. creating incidents, assigning tasks, seeding playbooks) require explicitly verified roles (`require_roles` FastAPI dependency).
- **JWT Lifetime Controls**: Employs short-lived JWT access tokens and long-lived refresh tokens. Access tokens are kept in tab-session storage only.
- **Argon2 Hashing**: Passwords are saved as one-way cryptographically hardened hashes using the Argon2 hashing algorithm.

### 📝 Layer B: Input Safety & AI Safeguards

- **Pydantic Validation**: All request bodies undergo strict validation (regex, length limits, pattern matching) before execution.
- **Injection Rejection**: Incoming copilot queries are screened against known prompt-injection signatures (e.g., `"ignore previous instructions"`) and aborted immediately.
- **Confidence Scoring & Sourcing**: Copilot responses include provenance indicators (source tracking) and require human validation before execution.

### ⚙️ Layer C: Infrastructure Hardening

- **NginX Edge Protection**: Enforces rate limiting (`limit_req`), restricted HTTP verbs, CORS protections, and strict `Content-Security-Policy` headers.
- **Non-Root Containers**: Docker instances run under low-privilege system users (`app`) to block privilege escalation.

---

> [!WARNING]
> **Production Notice**
> The local bootstrap administrator (`administrator@arenamind.local`) is provided for dev/test verification only. A live stadium deployment must bind external identity providers (OIDC/SAML) with Multi-Factor Authentication (MFA) enabled.

---

## 📬 3. Reporting Vulnerabilities

If you identify a security issue, do not open a public GitHub Issue. Report findings privately:

> [!IMPORTANT]
> Email details to: **security@arenamind.io**
> Include the version, target component, detailed reproduction steps, and impact. We commit to acknowledging reports within 24 hours.

<div align="center">

![ArenaMind Security Footer](https://capsule-render.vercel.app/api?type=waving&color=0:EF4444,55:111827,100:09090B&height=100&section=footer)

</div>

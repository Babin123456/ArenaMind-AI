# 🛡️ Security Policy

## Threat model

Primary risks are stolen operator credentials, cross-venue data access, malicious sensor input, prompt injection, sensitive-data leakage to AI providers, denial of service, incident tampering, and compromised dependencies.

## Controls

- Short-lived signed JWTs, production OIDC/MFA, explicit role and venue authorization
- Pydantic input constraints, fixed MongoDB query shapes, and no user-controlled operators
- Output escaping by React; no raw HTML rendering
- NGINX rate limits and application-level identity quotas
- Minimal AI context, schema-constrained output, source labels, and human approval
- Immutable audit trail for incident and recommendation actions
- Restricted CORS, trusted hosts, security headers, non-root containers, pinned dependencies
- Secret manager injection and automated rotation; no credentials in source or logs

Run dependency, container, SAST, secret, and IaC scans on every release. Restrict Gemini/Groq keys by project and budget, minimize venue context sent to providers, and review provider retention/training terms. Report vulnerabilities privately to [babinbid05@gmail.com](mailto:babinbid05@gmail.com) with affected version, reproduction, and impact. Do not open public issues for undisclosed vulnerabilities.

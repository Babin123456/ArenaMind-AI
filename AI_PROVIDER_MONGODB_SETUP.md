# 🤖 Gemini, Groq & MongoDB Setup

This guide configures ArenaMind AI without GPT or PostgreSQL. The backend supports **Google Gemini** and **Groq** through their OpenAI-compatible chat-completions endpoints and stores operational incidents in **MongoDB**.

For a variable-by-variable explanation, secret-generation commands, and complete `.env` examples, start with [Environment Configuration](ENVIRONMENT_SETUP.md).

## 📋 1. Prerequisites

- Docker Desktop and Docker Compose
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) **or** a Groq key from [GroqCloud Console](https://console.groq.com/keys)
- For cloud persistence, a [MongoDB Atlas](https://www.mongodb.com/atlas) account
- Git, Node.js 22+, and Python 3.13+ for non-Docker development

Only one AI provider is active at a time. Do not place keys in source code, screenshots, issues, or commit history.

## 🔐 2. Create environment configuration

Copy the template from the repository root:

```powershell
Copy-Item .env.example .env
```

The application reads these settings:

| Variable | Required | Meaning |
|---|---:|---|
| `AI_PROVIDER` | Yes | `groq` or `gemini` |
| `AI_API_KEY` | For model output | Secret key issued by the selected provider |
| `AI_MODEL` | Yes | Provider model identifier |
| `AI_BASE_URL` | No | Custom OpenAI-compatible gateway override |
| `MONGODB_URL` | Yes | MongoDB connection URI |
| `MONGODB_DATABASE` | Yes | Database name, normally `arenamind` |
| `JWT_SECRET` | Yes | Random secret of at least 32 characters |

Generate `JWT_SECRET` with an approved password manager or secret manager. Never reuse an AI key as the JWT secret.

## ⚡ 3A. Configure Groq

1. Open [GroqCloud API Keys](https://console.groq.com/keys).
2. Create a key scoped to this project.
3. Put the following values in `.env`:

```dotenv
AI_PROVIDER=groq
AI_API_KEY=gsk_replace_with_your_key
AI_MODEL=llama-3.3-70b-versatile
AI_BASE_URL=
```

The default endpoint is `https://api.groq.com/openai/v1`. ArenaMind appends `/chat/completions`, requests JSON, validates the response with Pydantic, and labels provenance as `groq:<model>`.

## ✨ 3B. Configure Gemini

1. Open [Google AI Studio API Keys](https://aistudio.google.com/app/apikey).
2. Create a key in the intended Google Cloud project.
3. Restrict and rotate the key according to your organization’s policy.
4. Put the following values in `.env`:

```dotenv
AI_PROVIDER=gemini
AI_API_KEY=replace_with_your_gemini_key
AI_MODEL=gemini-2.5-flash
AI_BASE_URL=
```

The default OpenAI-compatible endpoint is `https://generativelanguage.googleapis.com/v1beta/openai`. ArenaMind sends the key as a bearer token. Confirm current model availability in the [Gemini API documentation](https://ai.google.dev/gemini-api/docs/openai) because model names and quotas can change.

## 🍃 4A. Use local MongoDB with Docker

The supplied Compose file starts MongoDB 8 with a persistent named volume:

```bash
docker compose up --build
```

Use these `.env` values inside Compose:

```dotenv
MONGODB_URL=mongodb://mongodb:27017
MONGODB_DATABASE=arenamind
```

The API creates the `incidents` collection on first write and creates indexes for newest-first queries and status/severity filtering during startup.

## ☁️ 4B. Use MongoDB Atlas

1. Create a dedicated Atlas project and cluster.
2. Create a least-privilege database user for the `arenamind` database.
3. Add only the API deployment’s outbound IP to the Atlas network access list. Do not use `0.0.0.0/0` in production.
4. Copy the **Drivers → Python** connection string.
5. URL-encode special characters in the username or password.
6. Set the environment:

```dotenv
MONGODB_URL=mongodb+srv://arenamind_app:encoded-password@cluster.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=arenamind
```

Store the URI in a deployment secret manager. Enable Atlas encryption, backups, auditing, alerts, and point-in-time recovery according to venue RTO/RPO requirements.

## ▶️ 5. Start and verify

```bash
docker compose config
docker compose up --build -d
docker compose ps
```

Verify service health:

```bash
curl http://localhost:8080/health
```

Open `http://localhost:8080`, ask the Copilot **“Show overcrowded gates”**, and confirm the response displays a provider label such as `groq:llama-3.3-70b-versatile` or `gemini:gemini-2.5-flash`. A `rules-engine` label means `AI_API_KEY` was not available to the API container.

## 🔄 6. Switch providers

1. Change `AI_PROVIDER`, `AI_API_KEY`, and `AI_MODEL` in the secret store or `.env`.
2. Recreate only the API service:

```bash
docker compose up -d --force-recreate api
```

3. Run a Copilot query and verify the new `generated_by` value.
4. Revoke the old key if it is no longer required.

No frontend rebuild or database migration is needed.

## 🛡️ 7. Production checklist

- [ ] API key stored in a secret manager and excluded from logs
- [ ] Provider budget, quota, and usage alerts configured
- [ ] MongoDB user limited to the ArenaMind database
- [ ] Atlas/network access restricted to deployment addresses
- [ ] TLS enabled for all external connections
- [ ] JWT bootstrap login replaced by OIDC with MFA
- [ ] AI retention and training settings approved by data governance
- [ ] Venue-sensitive data removed or minimized before model calls
- [ ] Backups restored successfully in a rehearsal
- [ ] Human approval retained for every safety-critical recommendation

## 🧰 Troubleshooting

| Symptom | Likely cause | Resolution |
|---|---|---|
| `AI_PROVIDER must be 'groq' or 'gemini'` | Unsupported spelling/provider | Set the exact lowercase provider name |
| Copilot shows `rules-engine` | Missing key in API environment | Inspect Compose environment injection and recreate `api` |
| Provider returns `401` | Invalid, revoked, or wrong-provider key | Generate a new key and match it to `AI_PROVIDER` |
| Provider returns `429` | Rate or budget limit reached | Apply backoff, review quota, or use the alternate provider |
| API startup cannot reach MongoDB | URI, DNS, allowlist, or credentials issue | Test the URI with `mongosh` from the API network |
| MongoDB authentication fails | Password contains unescaped characters | URL-encode credentials or create a new database user |

For endpoint behavior see [API.md](API.md); for security controls see [SECURITY.md](SECURITY.md); for collection/index design see [DATABASE.md](DATABASE.md).

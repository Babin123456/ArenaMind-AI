# 🔐 ArenaMind Environment Configuration Guide

This guide explains where every ArenaMind environment value comes from, how to generate secrets safely, and which values change between local Docker development and production.

> **Never commit `.env`.** ArenaMind ignores `.env` through `.gitignore`. Only `.env.example`, which contains no real secrets, should be committed.

## 🚀 Fastest local setup

From the project root, create your private environment file:

```powershell
Copy-Item .env.example .env
```

Use the following template for Docker Compose:

```dotenv
MONGODB_URL=mongodb://mongodb:27017
MONGODB_DATABASE=arenamind
REDIS_URL=redis://redis:6379/0

JWT_SECRET=replace-with-a-generated-random-secret
BOOTSTRAP_ADMIN_EMAIL=your-email@example.com
BOOTSTRAP_ADMIN_PASSWORD=replace-with-a-strong-unique-password

AI_PROVIDER=groq
AI_API_KEY=replace-with-your-groq-key
AI_MODEL=llama-3.3-70b-versatile
AI_BASE_URL=

NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

Only `JWT_SECRET`, `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`, and `AI_API_KEY` need personal values for the standard Docker setup.

## 📋 Variable reference

| Variable | Who provides it? | Secret? | Local Docker value |
|---|---|---:|---|
| `MONGODB_URL` | Docker Compose or MongoDB Atlas | Yes in production | `mongodb://mongodb:27017` |
| `MONGODB_DATABASE` | You choose it | No | `arenamind` |
| `REDIS_URL` | Docker Compose or hosted Redis provider | Yes in production | `redis://redis:6379/0` |
| `JWT_SECRET` | You generate it | **Yes** | Generated random value |
| `BOOTSTRAP_ADMIN_EMAIL` | You choose it | No | Your administrator email |
| `BOOTSTRAP_ADMIN_PASSWORD` | You generate or choose it | **Yes** | Strong unique password |
| `AI_PROVIDER` | You choose it | No | `groq` or `gemini` |
| `AI_API_KEY` | Groq or Google AI Studio | **Yes** | Provider-issued key |
| `AI_MODEL` | AI provider model catalog | No | Provider model identifier |
| `AI_BASE_URL` | ArenaMind default or custom gateway | Sometimes | Leave empty |
| `NEXT_PUBLIC_API_URL` | Your deployment address | No | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_WS_URL` | Your deployment address | No | `ws://localhost:8000/ws` |

## 🍃 MongoDB configuration

### Option A: Included Docker MongoDB

Keep these values unchanged:

```dotenv
MONGODB_URL=mongodb://mongodb:27017
MONGODB_DATABASE=arenamind
```

`mongodb` is the service name in `docker-compose.yml`. Docker’s internal DNS resolves it for the API container. Do not change it to `localhost` inside Docker because `localhost` would refer to the API container itself.

MongoDB creates the `arenamind` database automatically when ArenaMind first stores a document.

### Option B: API outside Docker with local MongoDB

When FastAPI runs directly on your computer and MongoDB runs on port 27017:

```dotenv
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=arenamind
```

### Option C: MongoDB Atlas

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a project and cluster.
3. Open **Database Access** and create a dedicated database user.
4. Grant only the permissions ArenaMind needs. Avoid using an organization owner account.
5. Open **Network Access** and allow only your deployment’s outbound IP address.
6. Open **Database → Connect → Drivers → Python**.
7. Copy the `mongodb+srv://` connection string.
8. Replace `<username>` and `<password>` with the database user credentials.

Example:

```dotenv
MONGODB_URL=mongodb+srv://arenamind_app:encoded-password@cluster0.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=arenamind
```

If the password contains characters such as `@`, `:`, `/`, `?`, or `#`, URL-encode it. PowerShell example:

```powershell
[System.Uri]::EscapeDataString('your-database-password')
```

For production, store the complete Atlas URI in a secret manager rather than a repository or screenshot.

## ⚡ Redis configuration

### Included Docker Redis

```dotenv
REDIS_URL=redis://redis:6379/0
```

### API outside Docker with local Redis

```dotenv
REDIS_URL=redis://localhost:6379/0
```

### Hosted Redis

Create a database using Redis Cloud, AWS ElastiCache, Azure Cache for Redis, Upstash, or another approved provider. Copy the connection URL from its dashboard.

Typical TLS example:

```dotenv
REDIS_URL=rediss://default:your-password@your-redis-host.example.com:6380
```

Use `rediss://` when the provider requires TLS. Never expose Redis directly to the public internet.

ArenaMind uses Redis for short-lived dashboard caching. If Redis is temporarily unavailable, the API continues using MongoDB rather than failing the request.

## 🔑 Generate `JWT_SECRET`

`JWT_SECRET` signs authentication tokens. It must be unpredictable, unique to this application, and at least 32 characters.

### PowerShell

```powershell
$bytes = New-Object byte[] 48
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

### OpenSSL

```bash
openssl rand -base64 48
```

Place the generated output in `.env` without surrounding quotes:

```dotenv
JWT_SECRET=your-generated-random-value
```

Do not reuse an API key, database password, or administrator password as `JWT_SECRET`. Rotate it separately for development, staging, and production. Rotating it signs out existing users.

## 👤 Bootstrap administrator

The bootstrap account creates the first administrator when the users collection is empty.

Choose an email you control:

```dotenv
BOOTSTRAP_ADMIN_EMAIL=babinbid05@gmail.com
```

Choose a unique password with at least 12 characters. A password manager should generate 20 or more characters containing upper- and lowercase letters, numbers, and symbols.

```dotenv
BOOTSTRAP_ADMIN_PASSWORD=replace-with-your-generated-password
```

ArenaMind hashes this password with Argon2 before storing it. The plaintext password is not written to MongoDB.

After the first production administrator signs in and provisions permanent identities, rotate or remove the bootstrap credentials from the deployment environment.

## 🤖 Groq API configuration

1. Sign in to [GroqCloud Console](https://console.groq.com/).
2. Open [API Keys](https://console.groq.com/keys).
3. Select **Create API Key**.
4. Give the key a recognizable ArenaMind project name.
5. Copy it immediately and store it in your secret manager or local `.env`.

```dotenv
AI_PROVIDER=groq
AI_API_KEY=gsk_your_generated_groq_key
AI_MODEL=llama-3.3-70b-versatile
AI_BASE_URL=
```

ArenaMind automatically uses Groq’s OpenAI-compatible base URL:

```text
https://api.groq.com/openai/v1
```

Check the Groq model catalog if `llama-3.3-70b-versatile` is not available for your account or region. Use an available JSON-capable chat model and update `AI_MODEL`.

## ✨ Gemini API configuration

1. Sign in to [Google AI Studio](https://aistudio.google.com/).
2. Open [API Keys](https://aistudio.google.com/app/apikey).
3. Select **Create API key** in the intended Google Cloud project.
4. Apply Google Cloud key restrictions and usage/budget alerts where available.
5. Copy the key into your secret manager or local `.env`.

```dotenv
AI_PROVIDER=gemini
AI_API_KEY=your-generated-gemini-key
AI_MODEL=gemini-2.5-flash
AI_BASE_URL=
```

ArenaMind automatically uses Gemini’s OpenAI-compatible base URL:

```text
https://generativelanguage.googleapis.com/v1beta/openai
```

Model availability changes over time. Confirm the current identifier in the [Gemini API model documentation](https://ai.google.dev/gemini-api/docs/models).

## 🔀 Choosing an AI provider

Only one provider is active at a time.

Groq:

```dotenv
AI_PROVIDER=groq
AI_API_KEY=your-groq-key
AI_MODEL=llama-3.3-70b-versatile
```

Gemini:

```dotenv
AI_PROVIDER=gemini
AI_API_KEY=your-gemini-key
AI_MODEL=gemini-2.5-flash
```

Restart the API after switching:

```bash
docker compose up -d --force-recreate api
```

ArenaMind displays provider provenance in Copilot responses. If `AI_API_KEY` is empty, it intentionally uses the labeled `rules-engine+routing-rag` fallback.

## 🌐 API and WebSocket addresses

For local development:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

For production behind HTTPS:

```dotenv
NEXT_PUBLIC_API_URL=https://arenamind.example.com/api/v1
NEXT_PUBLIC_WS_URL=wss://arenamind.example.com/ws
```

Use `wss://` whenever the website uses `https://`.

Variables beginning with `NEXT_PUBLIC_` are embedded into browser code. They must never contain passwords, tokens, API keys, or private connection strings. Rebuild the frontend after changing them.

## ✅ Complete local examples

### Groq with Docker

```dotenv
MONGODB_URL=mongodb://mongodb:27017
MONGODB_DATABASE=arenamind
REDIS_URL=redis://redis:6379/0
JWT_SECRET=paste-your-generated-secret
BOOTSTRAP_ADMIN_EMAIL=your-email@example.com
BOOTSTRAP_ADMIN_PASSWORD=paste-your-generated-password
AI_PROVIDER=groq
AI_API_KEY=paste-your-groq-key
AI_MODEL=llama-3.3-70b-versatile
AI_BASE_URL=
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### Gemini with MongoDB Atlas

```dotenv
MONGODB_URL=mongodb+srv://arenamind_app:encoded-password@cluster0.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=arenamind
REDIS_URL=rediss://default:redis-password@redis.example.com:6380
JWT_SECRET=paste-your-generated-secret
BOOTSTRAP_ADMIN_EMAIL=your-email@example.com
BOOTSTRAP_ADMIN_PASSWORD=paste-your-generated-password
AI_PROVIDER=gemini
AI_API_KEY=paste-your-gemini-key
AI_MODEL=gemini-2.5-flash
AI_BASE_URL=
NEXT_PUBLIC_API_URL=https://arenamind.example.com/api/v1
NEXT_PUBLIC_WS_URL=wss://arenamind.example.com/ws
```

## ▶️ Start and verify

1. Start Docker Desktop.
2. Validate the resolved configuration:

```bash
docker compose config
```

3. Start ArenaMind:

```bash
docker compose up --build
```

4. Verify the API:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/ready
```

5. Open [http://localhost:8080](http://localhost:8080).
6. Sign in using `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD`.
7. Ask Copilot **“Show overcrowded gates.”**
8. Confirm the response identifies Groq, Gemini, or the explicit rules-engine fallback.

## 🧰 Troubleshooting

| Problem | Likely reason | Resolution |
|---|---|---|
| Docker cannot connect to its engine | Docker Desktop is stopped | Start Docker Desktop and wait until the engine is ready |
| MongoDB connection refused | Wrong hostname for the execution mode | Use `mongodb` inside Docker and `localhost` outside Docker |
| Atlas authentication failure | Incorrect or unencoded credentials | URL-encode the password and verify the Atlas database user |
| Atlas server selection timeout | Network allowlist blocks the API | Add only the deployment’s outbound IP to Atlas Network Access |
| Redis connection failure | Wrong URL, port, password, or TLS scheme | Copy the provider URL and use `rediss://` when TLS is required |
| Login fails on a new database | Bootstrap values differ from the running API environment | Inspect the API environment and recreate the API container |
| Existing bootstrap password does not change | User already exists in MongoDB | Change the stored user through an admin workflow or recreate only disposable local data |
| Copilot shows rules-engine provenance | `AI_API_KEY` is empty or unavailable | Inject the correct provider key and recreate the API container |
| Provider returns `401` | Wrong, revoked, or mismatched provider key | Generate a new key and match it to `AI_PROVIDER` |
| Provider returns `429` | Quota or rate limit reached | Review provider limits, enable backoff, or switch provider |
| Browser cannot reach WebSocket | Incorrect protocol or public URL | Use `ws://` locally and `wss://` behind HTTPS |

## 🛡️ Production checklist

- [ ] `.env` is absent from Git history
- [ ] Secrets are injected by a secret manager
- [ ] Development, staging, and production use different secrets
- [ ] MongoDB uses authentication, TLS, backups, and least privilege
- [ ] Redis is private, authenticated, and encrypted
- [ ] Groq or Gemini usage limits and alerts are configured
- [ ] Provider data-retention terms are approved
- [ ] Bootstrap credentials have been rotated
- [ ] OIDC/MFA replaces bootstrap identity for tournament deployment
- [ ] `NEXT_PUBLIC_*` contains no secrets
- [ ] All services pass `/health`, `/ready`, tests, and security scans

Continue with [Gemini, Groq & MongoDB Setup](AI_PROVIDER_MONGODB_SETUP.md), [Security Policy](SECURITY.md), and [Deployment Guide](DEPLOYMENT.md).


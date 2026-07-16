from contextlib import asynccontextmanager
from datetime import UTC, datetime
import asyncio
from time import perf_counter
from uuid import uuid4
import structlog
from fastapi import Depends, FastAPI, Request, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from .config import get_settings
from .schemas import (Assignment, AssignmentCreate, CopilotQuery, CopilotResponse, Incident,
                      IncidentCreate, KnowledgeDocumentCreate, UserCreate)
from .security import (Principal, Role, TokenPair, create_token_pair, current_principal,
                       decode_token, require_roles)
from .services import assignments, auth, cache, copilot, incidents, knowledge, operations, store


@asynccontextmanager
async def lifespan(_: FastAPI):
    await store.initialize()
    await auth.seed_admin()
    await knowledge.seed()
    yield
    await cache.close()
    await store.close()


settings = get_settings()
app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan,
              docs_url="/api/docs", openapi_url="/api/openapi.json")
app.add_middleware(CORSMiddleware,
                   allow_origins=settings.origins,
                   allow_origin_regex=r"https://.*\.vercel\.app",
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
limiter = Limiter(key_func=get_remote_address, default_limits=["120/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
logger = structlog.get_logger("arenamind.api")


@app.middleware("http")
async def request_observability(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid4()))[:128]
    started = perf_counter()
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["Cache-Control"] = "no-store" if request.url.path.startswith("/api/v1/auth") else "private, no-cache"
    logger.info("request.complete", request_id=request_id, method=request.method,
                path=request.url.path, status=response.status_code,
                duration_ms=round((perf_counter() - started) * 1000, 2))
    return response


class LoginRequest(BaseModel):
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=1, max_length=128)


class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=20, max_length=4096)


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "arenamind-api", "time": datetime.now(UTC)}


@app.get("/ready")
async def ready():
    await store.db.command("ping")
    return {"status": "ready", "database": "mongodb"}


@app.post("/api/v1/auth/login", response_model=TokenPair)
@limiter.limit("10/minute")
async def login(request: Request, payload: LoginRequest):
    return await auth.authenticate(payload.email, payload.password)


@app.post("/api/v1/auth/refresh", response_model=TokenPair)
@limiter.limit("20/minute")
async def refresh(request: Request, payload: RefreshRequest):
    return create_token_pair(decode_token(payload.refresh_token, "refresh"))


@app.post("/api/v1/users", response_model=Principal, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, actor: Principal = Depends(require_roles(Role.ADMIN))):
    return await auth.create_user(payload, actor)


@app.get("/api/v1/dashboard")
async def dashboard(user: Principal = Depends(current_principal)):
    return await operations.dashboard(user)


@app.get("/api/v1/incidents", response_model=list[Incident])
async def list_incidents(_: Principal = Depends(current_principal)):
    return await incidents.list()


@app.post("/api/v1/incidents", response_model=Incident, status_code=status.HTTP_201_CREATED)
async def create_incident(payload: IncidentCreate, actor: Principal = Depends(require_roles(
        Role.ADMIN, Role.OPERATIONS, Role.SECURITY, Role.MEDICAL, Role.TRANSPORT))):
    return await incidents.create(payload, actor)


@app.get("/api/v1/assignments", response_model=list[Assignment])
async def list_assignments(user: Principal = Depends(current_principal)):
    return await assignments.list_for(user)


@app.post("/api/v1/assignments", response_model=Assignment, status_code=status.HTTP_201_CREATED)
async def create_assignment(payload: AssignmentCreate, actor: Principal = Depends(require_roles(
        Role.ADMIN, Role.OPERATIONS, Role.SECURITY, Role.MEDICAL, Role.TRANSPORT))):
    return await assignments.create(payload, actor)


@app.post("/api/v1/knowledge", status_code=status.HTTP_201_CREATED)
async def create_knowledge(payload: KnowledgeDocumentCreate,
                           actor: Principal = Depends(require_roles(Role.ADMIN, Role.OPERATIONS))):
    return await knowledge.add(payload, actor)


@app.post("/api/v1/copilot/query", response_model=CopilotResponse)
@limiter.limit("20/minute")
async def query_copilot(request: Request, payload: CopilotQuery, actor: Principal = Depends(current_principal)):
    return await copilot.answer(payload, actor)


@app.websocket("/ws/operations")
async def operations_socket(socket: WebSocket):
    # Security note: WebSocket tokens are passed via query params because
    # browsers cannot send Authorization headers during the WS handshake.
    # In production, use short-lived single-use WS tickets instead.
    token = socket.query_params.get("token", "")
    try:
        principal = decode_token(token)
    except Exception:
        await socket.close(code=4401)
        return
    await socket.accept()
    try:
        while True:
            await socket.send_json({"type": "heartbeat", "timestamp": datetime.now(UTC).isoformat(),
                                    "crowd_index": 68, "active_units": 42,
                                    "role": principal.role.value})
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        return

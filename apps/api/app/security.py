"""
ArenaMind API — Security & Identity
====================================
JWT-based authentication with role-based access control (RBAC).

The identity model uses short-lived access tokens and longer-lived
refresh tokens, both signed with HS256. Passwords are hashed with
Argon2 via ``pwdlib``. FastAPI dependency injection exposes
``current_principal`` and ``require_roles()`` for route-level
authorization.
"""

from datetime import UTC, datetime, timedelta
from enum import StrEnum
from uuid import uuid4

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
from pwdlib import PasswordHash

from .config import get_settings


class Role(StrEnum):
    """Venue roles aligned with FIFA World Cup 2026 operational structure."""
    ADMIN = "administrator"
    OPERATIONS = "operations_manager"
    SECURITY = "security_staff"
    MEDICAL = "medical_team"
    VOLUNTEER = "volunteer"
    TRANSPORT = "transportation_team"
    FAN = "fan"


class Principal(BaseModel):
    """Authenticated user identity extracted from a verified JWT."""
    id: str
    email: str
    role: Role


class TokenPair(BaseModel):
    """Access + refresh token pair returned on successful authentication."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: Principal


password_hash = PasswordHash.recommended()
bearer = HTTPBearer(auto_error=False)


def _token(principal: Principal, token_type: str, expires: timedelta) -> str:
    """Sign a JWT with the given type and expiry for the principal."""
    now = datetime.now(UTC)
    claims = {"sub": principal.id, "email": principal.email, "role": principal.role.value,
              "type": token_type, "jti": str(uuid4()), "iat": now, "exp": now + expires}
    return jwt.encode(claims, get_settings().jwt_secret, algorithm="HS256")


def create_token_pair(principal: Principal) -> TokenPair:
    """Issue a fresh access/refresh token pair for the principal."""
    settings = get_settings()
    return TokenPair(
        access_token=_token(principal, "access", timedelta(minutes=settings.access_token_minutes)),
        refresh_token=_token(principal, "refresh", timedelta(days=settings.refresh_token_days)),
        expires_in=settings.access_token_minutes * 60,
        user=principal,
    )


def decode_token(token: str, expected_type: str = "access") -> Principal:
    """Decode and validate a JWT, returning the authenticated principal."""
    try:
        claims = jwt.decode(token, get_settings().jwt_secret, algorithms=["HS256"],
                            options={"require": ["exp", "iat", "sub", "type", "jti"]})
        if claims["type"] != expected_type:
            raise ValueError("Unexpected token type")
        return Principal(id=claims["sub"], email=claims["email"], role=Role(claims["role"]))
    except (jwt.PyJWTError, KeyError, ValueError) as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token") from exc


async def current_principal(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> Principal:
    """FastAPI dependency: extract and verify the bearer token."""
    if not credentials:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Authentication required")
    return decode_token(credentials.credentials)


def require_roles(*roles: Role):
    """Factory for a FastAPI dependency that enforces role membership."""
    async def dependency(user: Principal = Depends(current_principal)) -> Principal:
        if user.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Insufficient permissions")
        return user
    return dependency

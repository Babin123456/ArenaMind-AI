"""
ArenaMind API — Configuration
==============================
Environment-driven settings using ``pydantic-settings``. Validates
AI provider choice and enforces secret rotation in production mode.
"""

from functools import lru_cache

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application-wide settings loaded from environment variables and ``.env``."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    app_name: str = "ArenaMind AI"
    environment: str = "development"
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_database: str = "arenamind"
    redis_url: str = "redis://localhost:6379/0"
    jwt_secret: str = Field(default="development-only-secret-change-me-now", min_length=32)
    access_token_minutes: int = 30
    refresh_token_days: int = 7
    bootstrap_admin_email: str = "administrator@arenamind.local"
    bootstrap_admin_password: str = Field(default="ChangeMe-ArenaMind-2026", min_length=12)
    ai_provider: str = "groq"
    ai_api_key: str | None = None
    ai_base_url: str | None = None
    ai_model: str = "llama-3.3-70b-versatile"
    allowed_origins: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:8080"

    @property
    def origins(self) -> list[str]:
        return [value.strip() for value in self.allowed_origins.split(",")]

    @property
    def provider_base_url(self) -> str:
        if self.ai_base_url:
            return self.ai_base_url.rstrip("/")
        return {
            "groq": "https://api.groq.com/openai/v1",
            "gemini": "https://generativelanguage.googleapis.com/v1beta/openai",
        }[self.ai_provider]

    @model_validator(mode="after")
    def validate_provider(self):
        self.ai_provider = self.ai_provider.lower()
        if self.ai_provider not in {"groq", "gemini"}:
            raise ValueError("AI_PROVIDER must be 'groq' or 'gemini'")
        if self.environment == "production":
            if self.jwt_secret == "development-only-secret-change-me-now":
                raise ValueError("JWT_SECRET must be rotated in production")
            if self.bootstrap_admin_password == "ChangeMe-ArenaMind-2026":
                raise ValueError("BOOTSTRAP_ADMIN_PASSWORD must be rotated in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()

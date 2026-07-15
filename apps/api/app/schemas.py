"""
ArenaMind API — Request / Response Schemas
===========================================
Pydantic models that define and validate every boundary crossing the
API surface. Field constraints (``min_length``, ``max_length``,
``pattern``, ``ge``, ``le``) enforce input safety before any
business logic executes.
"""

from datetime import datetime
from enum import StrEnum
from pydantic import BaseModel, Field


class Severity(StrEnum):
    """Incident and assignment priority levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IncidentCreate(BaseModel):
    """Validated payload for creating a new incident report."""
    title: str = Field(min_length=3, max_length=120)
    category: str = Field(pattern="^(security|medical|crowd|fire|transport)$")
    severity: Severity
    zone: str = Field(min_length=2, max_length=40)
    description: str = Field(min_length=10, max_length=2000)


class Incident(IncidentCreate):
    """Full incident record including server-assigned fields."""
    id: str
    status: str
    created_at: datetime


class UserCreate(BaseModel):
    """Administrator-submitted payload for provisioning a new user."""
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$", max_length=254)
    password: str = Field(min_length=12, max_length=128)
    display_name: str = Field(min_length=2, max_length=80)
    role: str = Field(pattern="^(administrator|operations_manager|security_staff|medical_team|volunteer|transportation_team|fan)$")


class AssignmentCreate(BaseModel):
    """Payload for creating a responder or volunteer task assignment."""
    title: str = Field(min_length=3, max_length=120)
    assignee_id: str = Field(min_length=3, max_length=80)
    zone: str = Field(min_length=2, max_length=40)
    priority: Severity
    due_at: datetime


class Assignment(AssignmentCreate):
    """Full assignment record including server-assigned fields."""
    id: str
    status: str
    created_at: datetime


class KnowledgeDocumentCreate(BaseModel):
    """Payload for ingesting a new approved playbook document."""
    title: str = Field(min_length=3, max_length=120)
    content: str = Field(min_length=30, max_length=10000)
    category: str = Field(pattern="^(crowd|security|medical|transport|accessibility|sustainability|general)$")
    version: str = Field(min_length=1, max_length=20)


class CopilotQuery(BaseModel):
    """Operator question submitted to the AI copilot."""
    query: str = Field(min_length=3, max_length=1000)
    context: dict[str, str | int | float | bool] = Field(default_factory=dict)


class CopilotResponse(BaseModel):
    """Structured, explainable AI recommendation with provenance."""
    summary: str
    reasoning: list[str]
    recommendations: list[str]
    confidence: float = Field(ge=0, le=1)
    sources: list[str]
    generated_by: str

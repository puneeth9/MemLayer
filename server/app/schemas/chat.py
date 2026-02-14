from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ChatCreate(BaseModel):
    title: Optional[str] = None


class ChatUpdate(BaseModel):
    title: str


class ChatResponse(BaseModel):
    id: UUID
    title: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

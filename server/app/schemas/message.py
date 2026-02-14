from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class MessageCreate(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: UUID
    chat_id: UUID
    user_id: UUID
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

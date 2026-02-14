from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.chat import Chat
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageResponse

router = APIRouter(prefix="/chats/{chat_id}/messages", tags=["messages"])


def _verify_chat_ownership(chat_id: UUID, current_user: User, db: Session) -> Chat:
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
    if chat.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your chat")
    return chat


@router.post("", response_model=MessageResponse)
def send_message(
    chat_id: UUID,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _verify_chat_ownership(chat_id, current_user, db)

    # Store user message
    user_msg = Message(
        chat_id=chat_id,
        user_id=current_user.id,
        role="user",
        content=payload.content,
    )
    db.add(user_msg)

    # Create assistant placeholder response
    assistant_msg = Message(
        chat_id=chat_id,
        user_id=current_user.id,
        role="assistant",
        content="Message received",
    )
    db.add(assistant_msg)

    db.commit()
    db.refresh(assistant_msg)
    return assistant_msg


@router.get("", response_model=List[MessageResponse])
def list_messages(
    chat_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _verify_chat_ownership(chat_id, current_user, db)
    return db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at.asc()).all()

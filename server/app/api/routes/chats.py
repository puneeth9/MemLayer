import logging
from datetime import datetime, timezone
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.chat import Chat
from app.schemas.chat import ChatCreate, ChatUpdate, ChatResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chats", tags=["chats"])


def _get_user_chat(chat_id: UUID, current_user: User, db: Session) -> Chat:
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
    if chat.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your chat")
    return chat


@router.post("", response_model=ChatResponse)
def create_chat(
    payload: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        title = payload.title or f"Chat {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')}"
        chat = Chat(
            user_id=current_user.id,
            title=title,
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)
        return chat
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Failed to create chat: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=List[ChatResponse])
def list_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return db.query(Chat).filter(Chat.user_id == current_user.id).order_by(Chat.created_at.desc()).all()
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to list chats: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/{chat_id}", response_model=ChatResponse)
def rename_chat(
    chat_id: UUID,
    payload: ChatUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        chat = _get_user_chat(chat_id, current_user, db)
        chat.title = payload.title
        db.commit()
        db.refresh(chat)
        return chat
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Failed to rename chat: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(
    chat_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        chat = _get_user_chat(chat_id, current_user, db)
        db.delete(chat)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error("Failed to delete chat: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

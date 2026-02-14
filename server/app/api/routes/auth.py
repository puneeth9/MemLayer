import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.schemas.user import UserCreate
from app.schemas.auth import UserLogin, TokenResponse
from app.services.auth_service import register_user, login_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    try:
        return register_user(db, payload)
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Registration failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    try:
        return login_user(db, payload)
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Login failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

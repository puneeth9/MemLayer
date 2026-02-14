from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base  # noqa: F401  — ensures all models are imported
from app.db.session import engine
from app.api.routes.auth import router as auth_router
from app.api.routes.chats import router as chats_router
from app.api.routes.messages import router as messages_router

app = FastAPI(title="Memory Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chats_router)
app.include_router(messages_router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

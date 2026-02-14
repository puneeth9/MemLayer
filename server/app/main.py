import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.db.base import Base  # noqa: F401  — ensures all models are imported
from app.db.session import engine
from app.api.routes.auth import router as auth_router
from app.api.routes.chats import router as chats_router
from app.api.routes.messages import router as messages_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Memory Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled error on %s %s: %s", request.method, request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )


app.include_router(auth_router)
app.include_router(chats_router)
app.include_router(messages_router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/memorydb")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecret")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    JWT_ALGORITHM: str = "HS256"


settings = Settings()

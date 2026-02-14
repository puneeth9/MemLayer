We are building the base backend for a **Personal Memory Agent**.

Tech stack:
- Python FastAPI
- Postgres
- SQLAlchemy
- JWT auth
- Docker

This is a multi-user system.

We are NOT implementing memory extraction yet.
We are ONLY building:

- user auth
- chat sessions
- messages
- basic chat endpoint

----------------------------------
PROJECT STRUCTURE
----------------------------------

Create this structure:

server/
  app/
    main.py
    core/
      config.py
      security.py
      deps.py
    db/
      session.py
      base.py
    models/
      user.py
      chat.py
      message.py
    schemas/
      user.py
      chat.py
      message.py
      auth.py
    api/
      routes/
        auth.py
        chats.py
        messages.py
    services/
      auth_service.py
  requirements.txt
  docker-compose.yml
  .env

----------------------------------
DEPENDENCIES
----------------------------------

Create requirements.txt:

fastapi
uvicorn
sqlalchemy
psycopg2-binary
python-dotenv
passlib[bcrypt]
python-jose
pydantic
alembic

----------------------------------
DOCKER POSTGRES
----------------------------------

docker-compose.yml:

services:
  postgres:
    image: postgres:15
    container_name: memory-agent-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: memorydb
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:

----------------------------------
ENV FILE
----------------------------------

.env:

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/memorydb
JWT_SECRET=supersecret
ACCESS_TOKEN_EXPIRE_MINUTES=10080

----------------------------------
DATABASE SETUP
----------------------------------

Use SQLAlchemy.

Create session.py:
- engine
- SessionLocal
- Base

Create base.py to import all models.

----------------------------------
MODELS
----------------------------------

User model:
id (uuid primary key)
email (unique)
password_hash
created_at

Chat model:
id (uuid primary key)
user_id (fk users.id)
title
created_at

Message model:
id (uuid primary key)
chat_id (fk chats.id)
user_id (fk users.id)
role (user | assistant)
content
created_at

Relationships:
User -> Chats
Chat -> Messages

----------------------------------
SCHEMAS
----------------------------------

UserCreate
UserLogin
TokenResponse

ChatCreate
ChatResponse

MessageCreate
MessageResponse

----------------------------------
AUTH
----------------------------------

Use JWT.

Create:
- hash_password
- verify_password
- create_access_token

Routes:

POST /auth/register
POST /auth/login

Return JWT.

----------------------------------
AUTH DEPENDENCY
----------------------------------

Create dependency:

get_current_user()

Reads JWT from header:
Authorization: Bearer token

----------------------------------
CHAT ROUTES
----------------------------------

POST /chats
Create new chat for user.

GET /chats
List user chats.

----------------------------------
MESSAGES ROUTES
----------------------------------

POST /chats/{chat_id}/messages

Flow:
- verify user owns chat
- store user message
- create assistant placeholder response:
  "Message received"
- store assistant message
- return assistant message

GET /chats/{chat_id}/messages
Return all messages in chat.

----------------------------------
MAIN APP
----------------------------------

main.py:
- create FastAPI app
- include routers
- startup event: create tables

----------------------------------
RUN
----------------------------------

Commands:

docker compose up -d
uvicorn app.main:app --reload

----------------------------------
IMPORTANT
----------------------------------

Do NOT implement:
- memory extraction
- embeddings
- ranking

This is only base system.

----------------------------------
AFTER IMPLEMENTATION
----------------------------------

Explain:
- folder structure
- auth flow
- chat flow
- how to run
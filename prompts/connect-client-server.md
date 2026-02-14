We are integrating the FastAPI backend with the React TypeScript frontend for **MemLayer**.

We need to:
- enable CORS
- standardize response schemas
- ensure JWT auth works with frontend
- make chat/message endpoints frontend-friendly

--------------------------------------
STEP 1: ENABLE CORS
--------------------------------------

In main.py:

Import:
from fastapi.middleware.cors import CORSMiddleware

Add middleware:

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

--------------------------------------
STEP 2: TOKEN RESPONSE FORMAT
--------------------------------------

Auth endpoints must return:

{
  "access_token": "<token>",
  "token_type": "bearer"
}

Ensure both:
POST /auth/register
POST /auth/login

Return this exact schema.

Create Pydantic schema:

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

--------------------------------------
STEP 3: CHAT SCHEMA
--------------------------------------

Ensure ChatResponse includes:

id: str
title: Optional[str]
created_at: datetime

--------------------------------------
STEP 4: MESSAGE SCHEMA
--------------------------------------

Ensure MessageResponse includes:

id: str
chat_id: str
user_id: str
role: str
content: str
created_at: datetime

--------------------------------------
STEP 5: CREATE CHAT DEFAULT TITLE
--------------------------------------

If title not provided:

title = f"Chat {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"

--------------------------------------
STEP 6: MESSAGE ROUTE RESPONSE
--------------------------------------

POST /chats/{chat_id}/messages

Flow:

1. store user message
2. create assistant response:
   "Message received"
3. store assistant message
4. return assistant message object

Return shape must match MessageResponse.

--------------------------------------
STEP 7: GET MESSAGES
--------------------------------------

GET /chats/{chat_id}/messages

Return messages ordered by created_at ascending.

--------------------------------------
STEP 8: ERROR HANDLING
--------------------------------------

If user tries to access another user's chat:
return 403

If chat not found:
return 404

--------------------------------------
STEP 9: STARTUP TABLE CREATION
--------------------------------------

On app startup:

Base.metadata.create_all(bind=engine)

--------------------------------------
STEP 10: TEST
--------------------------------------

Start backend:

docker compose up -d
uvicorn app.main:app --reload

Open docs:
http://localhost:8000/docs

Test:

1. register
2. login
3. create chat
4. send message
5. get messages

Ensure frontend can call all endpoints.

--------------------------------------
IMPORTANT
--------------------------------------

Do NOT implement memory logic yet.

This step is only for client integration.
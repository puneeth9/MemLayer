We are refactoring the FastAPI backend for MemLayer.

Goals:
1. Use try/except/finally in all APIs
2. Use DB transactions for multi-query operations
3. Ensure session cleanup
4. Prevent partial writes
5. Standardize error handling

-------------------------------------
STEP 1: DB SESSION PATTERN
-------------------------------------

Update db/session.py.

Create dependency:

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

-------------------------------------
STEP 2: GLOBAL ERROR HANDLER
-------------------------------------

In main.py:

Add exception handler:

from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

-------------------------------------
STEP 3: AUTH ROUTES
-------------------------------------

Wrap each route:

try:
    ...
except HTTPException:
    raise
except Exception as e:
    raise HTTPException(500, str(e))
finally:
    pass

-------------------------------------
STEP 4: TRANSACTION PATTERN
-------------------------------------

For any route with multiple DB operations:

Example:

with db.begin():
    db.add(user)
    db.add(chat)

This ensures atomicity.

-------------------------------------
STEP 5: MESSAGE ROUTE
-------------------------------------

POST /chats/{chat_id}/messages

Use transaction:

try:
    with db.begin():
        store user message
        store assistant message
except:
    rollback automatically
    raise HTTPException

-------------------------------------
STEP 6: CHAT CREATE ROUTE
-------------------------------------

Wrap in transaction.

-------------------------------------
STEP 7: LOGGING
-------------------------------------

Add logging:

import logging
logger = logging.getLogger(name)

Log errors inside except blocks.

-------------------------------------
STEP 8: RESPONSE CONSISTENCY
-------------------------------------

All errors must return:

{
  "detail": "error message"
}

-------------------------------------
STEP 9: IMPORTANT RULES
-------------------------------------

Do NOT:
- leave open sessions
- commit manually outside transaction
- swallow exceptions

Always:
- rollback on failure
- close session

-------------------------------------
STEP 10: TEST
-------------------------------------

Test:
- register
- login
- create chat
- send message

Force error to ensure rollback works.

-------------------------------------
AFTER IMPLEMENTATION
-------------------------------------

Explain:
- transaction flow
- session lifecycle
- error handling
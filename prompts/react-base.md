We are building the frontend for **MemLayer**.

Backend (FastAPI) provides:
- POST /auth/register  -> returns { access_token, token_type }
- POST /auth/login     -> returns { access_token, token_type }
- GET  /chats          -> list user chats
- POST /chats          -> create chat { title? }
- GET  /chats/{chat_id}/messages -> list messages
- POST /chats/{chat_id}/messages -> send message { content }
All protected routes require:
Authorization: Bearer <JWT>

We will build a React + TypeScript app using Vite.

--------------------------------------------
GOAL
--------------------------------------------
Create a clean, minimal, professional UI:

1) Auth pages: Register, Login
2) After login: Chats page showing list of chats + create new chat
3) Chat detail page showing messages and input to send a message
4) Loading states + spinners:
   - while fetching chats: "Loading chats..."
   - while fetching messages: "Loading messages..."
   - while sending message: disable input + "Sending..."
5) Persist JWT in localStorage
6) Use typed API client with fetch wrapper
7) Use React Router with protected routes
8) No heavy UI frameworks. Use simple CSS (or CSS modules).
9) Code should be production-quality and organized.

--------------------------------------------
SETUP
--------------------------------------------
Create folder `client/` at repo root.

Initialize Vite React TS:
- React
- TypeScript

Install dependencies:
- react-router-dom

Optional small helper:
- clsx (optional) but not required

--------------------------------------------
ENV
--------------------------------------------
Create `client/.env`:
VITE_API_URL=http://localhost:8000

All API calls should use:
const API_URL = import.meta.env.VITE_API_URL

--------------------------------------------
PROJECT STRUCTURE
--------------------------------------------
client/
  src/
    main.tsx
    App.tsx
    api/
      http.ts
      auth.ts
      chats.ts
      messages.ts
      types.ts
    auth/
      AuthContext.tsx
      RequireAuth.tsx
    pages/
      Login.tsx
      Register.tsx
      Chats.tsx
      ChatDetail.tsx
    components/
      Spinner.tsx
      Navbar.tsx
      ChatListItem.tsx
      MessageBubble.tsx
    styles/
      app.css
      forms.css
      chat.css

--------------------------------------------
API TYPES
--------------------------------------------
Create `src/api/types.ts` with interfaces:

TokenResponse:
- access_token: string
- token_type: string

Chat:
- id: string
- title: string | null
- created_at: string

Message:
- id: string
- chat_id: string
- user_id: string
- role: 'user' | 'assistant'
- content: string
- created_at: string

Requests:
RegisterRequest: { email, password }
LoginRequest: { email, password }
CreateChatRequest: { title?: string }
SendMessageRequest: { content: string }

--------------------------------------------
HTTP WRAPPER
--------------------------------------------
Create `src/api/http.ts`:

- function `request<T>(path, options)` that:
  - prefixes with API_URL
  - attaches Authorization header if token exists
  - handles JSON request/response
  - throws a friendly error with status/message
- Centralize token read from localStorage.

--------------------------------------------
AUTH
--------------------------------------------
Create AuthContext:

- holds token, isAuthenticated
- login(token)
- logout()
- load token from localStorage on init

Pages:

Register page:
- email + password inputs
- POST /auth/register
- store token
- redirect to /chats

Login page:
- email + password
- POST /auth/login
- store token
- redirect to /chats

Logout button in Navbar.

Protected routing:
- RequireAuth wrapper redirects to /login if no token.

--------------------------------------------
ROUTING
--------------------------------------------
Use react-router-dom:

Routes:
- /login -> Login
- /register -> Register
- /chats -> Chats (protected)
- /chats/:chatId -> ChatDetail (protected)
- / -> redirect:
   if authenticated -> /chats
   else -> /login

--------------------------------------------
CHATS PAGE
--------------------------------------------
Chats.tsx:

- Fetch chats on mount via GET /chats
- Show spinner while loading: "Loading chats..."
- Show list of chats in a sidebar or list card
- Button: "New chat"
  - Create chat via POST /chats
  - Title can be optional: "Chat <date/time>"
  - After creation, navigate to /chats/:id
- Each chat item shows:
  - title (or "Untitled chat")
  - created_at (small)
  - status badge not needed yet

--------------------------------------------
CHAT DETAIL PAGE
--------------------------------------------
ChatDetail.tsx:

- Fetch messages for chat via GET /chats/:chatId/messages
- Show spinner while loading: "Loading messages..."
- Render messages in a clean chat layout:
  - user messages on right
  - assistant messages on left
  - use MessageBubble component

- Input area:
  - textarea
  - Send button

Send flow:
1) Optimistic UI:
   - append user message locally immediately
2) POST /chats/:chatId/messages with { content }
3) Append assistant response returned by server
4) While sending:
   - disable input and button
   - show spinner text "Sending..."
5) On failure:
   - show error banner
   - optionally rollback optimistic message (or mark failed)

Also add a "Back to chats" link.

--------------------------------------------
SPINNER COMPONENT
--------------------------------------------
Spinner.tsx:

- Simple CSS animated spinner
- Option to pass label prop
- Used on loading and sending states

--------------------------------------------
STYLING
--------------------------------------------
Use clean minimal styling:

- light background
- centered layout
- cards with subtle shadow
- rounded corners
- good spacing
- responsive (mobile friendly)

No Tailwind unless already installed.
Prefer CSS files in styles folder.

--------------------------------------------
UX DETAILS
--------------------------------------------
- Show API error messages in a small alert banner
- Disable buttons while loading
- Keep the UI neat, not cluttered

--------------------------------------------
HOW TO RUN
--------------------------------------------
`cd client`
`npm install`
`npm run dev`

Assume backend at http://localhost:8000

--------------------------------------------
IMPORTANT
--------------------------------------------
Do not add memory features yet.
Only auth + chats + messages.

After completion, explain:
- how to run client
- where API URL is configured
- how JWT is stored
- what pages exist
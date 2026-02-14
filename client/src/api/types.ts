// ── Response types ──

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Chat {
  id: string;
  title: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// ── Request types ──

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateChatRequest {
  title?: string;
}

export interface UpdateChatRequest {
  title: string;
}

export interface SendMessageRequest {
  content: string;
}

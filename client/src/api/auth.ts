import { request } from "./http";
import type { RegisterRequest, LoginRequest, TokenResponse } from "./types";

export function register(data: RegisterRequest): Promise<TokenResponse> {
  return request<TokenResponse>("/auth/register", {
    method: "POST",
    body: data,
  });
}

export function login(data: LoginRequest): Promise<TokenResponse> {
  return request<TokenResponse>("/auth/login", {
    method: "POST",
    body: data,
  });
}

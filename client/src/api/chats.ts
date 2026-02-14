import { request } from "./http";
import type { Chat, CreateChatRequest, UpdateChatRequest } from "./types";

export function getChats(): Promise<Chat[]> {
  return request<Chat[]>("/chats");
}

export function createChat(data: CreateChatRequest): Promise<Chat> {
  return request<Chat>("/chats", {
    method: "POST",
    body: data,
  });
}

export function updateChat(chatId: string, data: UpdateChatRequest): Promise<Chat> {
  return request<Chat>(`/chats/${chatId}`, {
    method: "PATCH",
    body: data,
  });
}

export function deleteChat(chatId: string): Promise<void> {
  return request(`/chats/${chatId}`, {
    method: "DELETE",
  });
}

import { request } from "./http";
import type { Message, SendMessageRequest } from "./types";

export function getMessages(chatId: string): Promise<Message[]> {
  return request<Message[]>(`/chats/${chatId}/messages`);
}

export function sendMessage(
  chatId: string,
  data: SendMessageRequest,
): Promise<Message> {
  return request<Message>(`/chats/${chatId}/messages`, {
    method: "POST",
    body: data,
  });
}

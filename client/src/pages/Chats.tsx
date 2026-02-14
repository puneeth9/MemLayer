import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChats, createChat, updateChat, deleteChat } from "../api/chats";
import type { Chat } from "../api/types";
import Spinner from "../components/Spinner";
import ChatListItem from "../components/ChatListItem";
import "../styles/chat.css";

export default function Chats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getChats()
      .then(setChats)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load chats"))
      .finally(() => setLoading(false));
  }, []);

  async function handleRename(chatId: string, newTitle: string) {
    setError("");
    try {
      const updated = await updateChat(chatId, { title: newTitle });
      setChats((prev) => prev.map((c) => (c.id === chatId ? updated : c)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to rename chat");
    }
  }

  async function handleDelete(chatId: string) {
    setError("");
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete chat");
    }
  }

  async function handleNewChat() {
    setCreating(true);
    setError("");
    try {
      const title = `Chat ${new Date().toLocaleString()}`;
      const chat = await createChat({ title });
      navigate(`/chats/${chat.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create chat");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="app-container chats-page">
      <div className="chats-header">
        <h1>Your Chats</h1>
        <button
          className="new-chat-btn"
          onClick={handleNewChat}
          disabled={creating}
        >
          {creating ? "Creating..." : "New Chat"}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <Spinner label="Loading chats..." />
      ) : chats.length === 0 ? (
        <div className="chat-list-empty">No chats yet. Create one to get started.</div>
      ) : (
        <div className="chat-list">
          {chats.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} onRename={handleRename} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

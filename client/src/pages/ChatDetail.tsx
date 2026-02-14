import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../api/messages";
import type { Message } from "../api/types";
import Spinner from "../components/Spinner";
import MessageBubble from "../components/MessageBubble";
import "../styles/chat.css";

export default function ChatDetail() {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;
    getMessages(chatId)
      .then(setMessages)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load messages"),
      )
      .finally(() => setLoading(false));
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!chatId || !input.trim()) return;

    const content = input.trim();
    setInput("");
    setError("");
    setSending(true);

    // Optimistic: append user message immediately
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      chat_id: chatId,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const assistantMsg = await sendMessage(chatId, { content });
      // Replace optimistic user msg with nothing extra (server already stored it)
      // and append the assistant reply
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="app-container chat-detail">
      <div className="chat-detail-header">
        <Link to="/chats" className="back-link">
          &larr; Back to chats
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <Spinner label="Loading messages..." />
      ) : (
        <div className="messages-area">
          {messages.length === 0 && (
            <div className="chat-list-empty">No messages yet. Say something!</div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={sending}
          rows={1}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={sending || !input.trim()}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

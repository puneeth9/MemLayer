import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Chat } from "../api/types";

interface ChatListItemProps {
  chat: Chat;
  onRename: (chatId: string, newTitle: string) => Promise<void>;
  onDelete: (chatId: string) => Promise<void>;
}

function toLocalDate(iso: string): Date {
  if (!iso.endsWith("Z") && !iso.includes("+")) {
    return new Date(iso + "Z");
  }
  return new Date(iso);
}

export default function ChatListItem({ chat, onRename, onDelete }: ChatListItemProps) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(chat.title || "");
  const [saving, setSaving] = useState(false);

  const title = chat.title || "Untitled chat";
  const date = toLocalDate(chat.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  function handleEditClick(e: React.MouseEvent) {
    e.stopPropagation();
    setDraft(chat.title || "");
    setEditing(true);
  }

  async function handleSave(e?: React.MouseEvent) {
    e?.stopPropagation();
    const trimmed = draft.trim();
    if (!trimmed || trimmed === chat.title) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onRename(chat.id, trimmed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel(e: React.MouseEvent) {
    e.stopPropagation();
    setEditing(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.stopPropagation();
      handleSave();
    } else if (e.key === "Escape") {
      setEditing(false);
    }
  }

  async function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm(`Delete "${title}"?`)) return;
    await onDelete(chat.id);
  }

  return (
    <div className="chat-list-item" onClick={() => !editing && navigate(`/chats/${chat.id}`)}>
      {editing ? (
        <div className="chat-edit-row" onClick={(e) => e.stopPropagation()}>
          <input
            className="chat-edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={saving}
            autoFocus
          />
          <button className="chat-action-btn save" onClick={handleSave} disabled={saving}>
            {saving ? "..." : "Save"}
          </button>
          <button className="chat-action-btn cancel" onClick={handleCancel} disabled={saving}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="chat-item-info">
            <span className="chat-item-title">{title}</span>
            <span className="chat-item-date">{date}</span>
          </div>
          <div className="chat-item-actions">
            <button className="chat-action-btn" onClick={handleEditClick} title="Rename">
              &#9998;
            </button>
            <button className="chat-action-btn delete" onClick={handleDeleteClick} title="Delete">
              &#128465;
            </button>
          </div>
        </>
      )}
    </div>
  );
}

import type { Message } from "../api/types";

interface MessageBubbleProps {
  message: Message;
}

function toLocalDate(iso: string): Date {
  // Ensure the timestamp is treated as UTC if no timezone suffix present
  if (!iso.endsWith("Z") && !iso.includes("+")) {
    return new Date(iso + "Z");
  }
  return new Date(iso);
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const time = toLocalDate(message.created_at).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`message-bubble ${message.role}`}>
      <div>{message.content}</div>
      <div className="message-time">{time}</div>
    </div>
  );
}

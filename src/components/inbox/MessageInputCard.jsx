import { useState } from "react";
import {
  Smile,
  Paperclip,
  PackageCheck,
  Receipt,
  Clock,
  ArrowUp,
} from "lucide-react";

export default function MessageInputCard({ onSchedule, onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    onSend?.(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-line bg-white p-3 shadow-chip">
      {/* Row 1 — input line */}
      <div className="flex items-center gap-2">
        <Smile size={18} className="shrink-0 text-ink-muted" strokeWidth={1.75} />
        <span className="h-5 w-px shrink-0 bg-line" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message ....."
          className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-ink-heading placeholder:text-ink-muted focus:outline-none"
        />
      </div>

      {/* Row 2 — actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconBtn ariaLabel="Attachment" onClick={() => alert('Attach mock')}>
            <Paperclip size={16} className="text-ink-muted" strokeWidth={1.75} />
          </IconBtn>
          <IconBtn ariaLabel="Send package" onClick={() => alert('Shipment mock')}>
            <PackageCheck size={16} className="text-ink-muted" strokeWidth={1.75} />
          </IconBtn>
          <IconBtn ariaLabel="Invoice" onClick={() => alert('Invoice mock')}>
            <Receipt size={16} className="text-ink-muted" strokeWidth={1.75} />
          </IconBtn>
        </div>
        <div className="flex items-center gap-2">
          <IconBtn ariaLabel="Schedule message" onClick={onSchedule}>
            <Clock size={16} className="text-ink-muted" strokeWidth={1.75} />
          </IconBtn>
          <span className="h-5 w-px shrink-0 bg-line" />
          <button
            type="button"
            onClick={handleSend}
            aria-label="Send message"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cta-gradient transition-opacity hover:opacity-95"
          >
            <ArrowUp size={14} className="text-white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, ariaLabel, onClick }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-xs transition-colors hover:bg-canvas"
    >
      {children}
    </button>
  );
}

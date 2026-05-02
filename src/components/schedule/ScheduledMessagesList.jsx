import { CalendarClock } from "lucide-react";
import ScheduledMessageCard from "./ScheduledMessageCard.jsx";

export default function ScheduledMessagesList({ messages, onCreateNew }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-line bg-canvas p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-info-bg">
          <CalendarClock size={24} className="text-info" strokeWidth={1.75} />
        </span>
        <h4 className="text-[14px] font-semibold text-ink-heading">
          No scheduled messages
        </h4>
        <p className="text-[12px] font-medium text-ink-muted">
          Schedule a message to send it automatically at the right time.
        </p>
        <button
          type="button"
          onClick={onCreateNew}
          className="mt-2 rounded-button bg-cta-gradient px-4 py-2 text-[12px] font-medium text-white"
        >
          Schedule a message
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-canvas p-3">
      <header className="flex flex-col gap-1 px-1">
        <h3 className="text-[14px] font-semibold text-ink-body">
          Scheduled Messages
        </h3>
        <p className="text-[12px] font-medium text-ink-muted">
          View your scheduled messages.
        </p>
      </header>
      <div className="flex flex-col gap-3">
        {messages.map((m) => (
          <ScheduledMessageCard key={m.id} {...m} />
        ))}
      </div>
    </div>
  );
}

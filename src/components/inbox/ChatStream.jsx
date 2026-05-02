import { useEffect, useRef } from "react";
import DateChip from "./DateChip.jsx";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatStream({ messages, dateLabel = "Today" }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto py-[10px]">
      <div className="flex flex-col gap-[15px] px-5">
        <DateChip>{dateLabel}</DateChip>
        <MessageList messages={messages} />
      </div>
    </div>
  );
}

function MessageList({ messages }) {
  const groups = groupConsecutive(messages);
  return (
    <div className="flex flex-col gap-[15px]">
      {groups.map((group, gi) => (
        <div key={`g-${gi}`} className="flex flex-col gap-[5px]">
          {group.map((m, mi) => (
            <MessageBubble
              key={m.id}
              message={m}
              showMeta={mi === group.length - 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function groupConsecutive(messages) {
  const out = [];
  for (const m of messages) {
    const last = out[out.length - 1];
    if (last && last[0].from === m.from) {
      last.push(m);
    } else {
      out.push([m]);
    }
  }
  return out;
}

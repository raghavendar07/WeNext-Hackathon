import { CheckCheck } from "lucide-react";

export default function MessageBubble({
  message,
  showMeta = true,
}) {
  const isOut = message.from === "out";
  const corner = isOut
    ? "rounded-tl-xs rounded-tr-xs rounded-bl-xs" // sharp bottom-right
    : "rounded-tl-xs rounded-tr-xs rounded-br-xs"; // sharp bottom-left

  return (
    <div
      className={`flex w-full flex-col ${isOut ? "items-end" : "items-start"}`}
    >
      <div
        className={[
          "max-w-[400px] border border-line bg-white p-[10px] shadow-chip",
          "text-[14px] font-normal text-[#082310]",
          corner,
        ].join(" ")}
        style={{ lineHeight: 1.3 }}
      >
        {message.text}
      </div>
      {showMeta && message.time && (
        <div
          className={[
            "mt-1 flex items-center gap-[5px] text-[10px] font-medium text-ink-muted",
            isOut ? "justify-end" : "justify-start",
          ].join(" ")}
        >
          <span>{message.time}</span>
          {isOut && (
            <CheckCheck size={14} className="text-brand-link" strokeWidth={2} />
          )}
        </div>
      )}
    </div>
  );
}

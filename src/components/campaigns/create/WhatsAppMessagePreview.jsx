import { ArrowRight, Image as ImageIcon } from "lucide-react";
import VariableTokenText from "./VariableTokenText.jsx";

export default function WhatsAppMessagePreview({
  businessName = "Business Name",
  verifiedLabel = "Verified",
  bodyLines = [
    "Hi {{name}}, we miss you! 👋",
    "Here's an exclusive {{discount}} off your next order — just for you.",
    "Use code {{code}} at checkout. Valid until {{expiry_date}}.",
  ],
  buttons = [
    { label: "Shop Now", emoji: "🛍️", tone: "brand" },
    { label: "Unsubscribe", tone: "muted" },
  ],
  timestamp = "11:14 AM",
}) {
  return (
    <div className="rounded-md bg-canvas p-3 shadow-chip">
      {/* Header */}
      <header className="flex items-center gap-3 px-1 pb-3 pt-1">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cta-gradient text-white">
          <ArrowRight size={20} strokeWidth={2} />
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="text-[13px] font-semibold text-ink-heading">
            {businessName}
          </span>
          <span className="text-[11px] font-medium text-ink-muted">
            {verifiedLabel}
          </span>
        </div>
      </header>

      {/* Message card with speech-bubble tail */}
      <div className="relative ml-3">
        <SpeechBubbleTail />
        <article className="overflow-hidden rounded-md border border-line bg-white">
          <div className="m-2 flex h-[150px] items-center justify-center rounded-xs bg-brand-50">
            <ImageIcon size={28} className="text-brand-emerald" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2 px-3 pb-3">
            {bodyLines.map((line, i) => (
              <p
                key={i}
                className="text-[12px] leading-snug text-ink-body"
              >
                <VariableTokenText
                  text={line}
                  className={i === 0 ? "font-semibold text-ink-heading" : ""}
                />
              </p>
            ))}
          </div>
          <div className="flex flex-col">
            {buttons.map((b, i) => (
              <button
                key={i}
                type="button"
                className={[
                  "h-10 border-t border-line text-center text-[13px] font-medium",
                  b.tone === "brand" ? "text-brand-emerald" : "text-ink-muted",
                ].join(" ")}
              >
                {b.emoji && <span aria-hidden className="mr-1">{b.emoji}</span>}
                {b.label}
              </button>
            ))}
          </div>
          <div className="flex justify-end px-3 py-2">
            <span className="text-[11px] font-medium text-ink-muted">{timestamp}</span>
          </div>
        </article>
      </div>
    </div>
  );
}

function SpeechBubbleTail() {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute -left-2 top-2"
      aria-hidden="true"
    >
      <path
        d="M14 0H2C0.895 0 0 0.895 0 2V10L14 0Z"
        fill="white"
        stroke="#EDF1F7"
        strokeWidth="1"
      />
    </svg>
  );
}

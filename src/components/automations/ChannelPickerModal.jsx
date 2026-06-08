import { X, MessageSquare, Instagram, ArrowRight } from "lucide-react";

const CHANNELS = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Triggers from messages, orders, carts. Send templates, lists, flows, and media.",
    bullets: [
      "Order, cart, payment triggers",
      "WhatsApp templates & flows",
      "Higher delivery & read rates",
    ],
    iconBg: "bg-emerald-500",
    border: "hover:border-emerald-500",
    ring: "ring-emerald-100",
    Icon: MessageSquare,
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Triggers from DMs, comments, mentions, stories. Reply publicly or DM privately.",
    bullets: [
      "Comment-to-DM, story replies, @mentions",
      "Send DMs, quick replies, media",
      "Grow followers & convert engagement",
    ],
    iconBg: "bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600",
    border: "hover:border-pink-500",
    ring: "ring-pink-100",
    Icon: Instagram,
  },
];

export default function ChannelPickerModal({ onPick, onCancel }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-[14px] bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-[#E5E7EB] px-6 py-4">
          <div>
            <h2 className="text-[18px] font-semibold text-[#0F172A]">Pick a channel</h2>
            <p className="mt-0.5 text-[13px] text-[#6A6A6A]">
              Which platform should this automation run on?
            </p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-[8px] p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 p-6">
          {CHANNELS.map((c) => {
            const Icon = c.Icon;
            return (
              <button
                key={c.id}
                onClick={() => onPick(c.id)}
                className={[
                  "group flex flex-col items-start gap-3 rounded-[12px] border border-[#E5E7EB] bg-white p-5 text-left transition-all",
                  c.border,
                  "hover:shadow-md focus:outline-none focus-visible:shadow-focus",
                ].join(" ")}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-[12px] ${c.iconBg} text-white ring-4 ${c.ring}`}>
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#0F172A]">{c.name}</div>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#475569]">{c.description}</p>
                </div>
                <ul className="space-y-1 text-[11px] text-[#6A6A6A]">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex gap-1.5">
                      <span className="text-emerald-500">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[12px] font-semibold text-[#0F172A] opacity-0 transition-opacity group-hover:opacity-100">
                  Continue <ArrowRight size={12} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#FAFAF9] px-6 py-3 text-[12px] text-[#6A6A6A]">
          <span>You can change the channel later in builder settings.</span>
          <button onClick={onCancel} className="rounded-[6px] px-2 py-1 font-semibold hover:bg-white hover:text-[#0F172A]">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

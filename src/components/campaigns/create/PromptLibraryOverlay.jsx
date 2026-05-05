import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, XCircle } from "lucide-react";
import FilterChipGroup from "../FilterChipGroup.jsx";
import PromptLibraryCard from "./PromptLibraryCard.jsx";
import WhatsAppMessagePreview from "./WhatsAppMessagePreview.jsx";

const CATEGORIES = [
  { id: "all",            label: "All" },
  { id: "marketing",      label: "Marketing" },
  { id: "utility",        label: "Utility" },
  { id: "authentication", label: "Authentication" },
];

const PROMPTS = [
  {
    id: "p1",
    category: "marketing",
    hasImage: true,
    createdAt: "12:33",
    body: "Write a warm Diwali greeting for my customers from {{business}}. Personal, heartfelt opening. Then mention our special {{discount}} offer on {{product_category}}. Include a shop link and set urgency with {{expiry_date}}.",
  },
  {
    id: "p2",
    category: "marketing",
    hasImage: true,
    createdAt: "12:33",
    body: "Announce new arrivals at {{business}}. Highlight {{product_count}} fresh products with a friendly tone. End with a call to {{primary_cta}}.",
  },
  {
    id: "p3",
    category: "utility",
    createdAt: "Yesterday",
    body: "Send an order confirmation for order {{order_id}} at {{business}}. Include items, total {{amount}}, and expected delivery on {{delivery_date}}.",
  },
  {
    id: "p4",
    category: "utility",
    createdAt: "Yesterday",
    body: "Notify {{name}} that their appointment with {{agent}} is confirmed for {{appointment_time}} at {{location}}.",
  },
  {
    id: "p5",
    category: "authentication",
    createdAt: "2 days ago",
    body: "Send a one-time password to {{name}} for verifying their account. Code: {{otp}}. Valid for {{minutes}} minutes.",
  },
  {
    id: "p6",
    category: "authentication",
    createdAt: "2 days ago",
    body: "Confirm password reset for {{name}} at {{business}}. Use this link {{reset_link}} within {{minutes}} minutes.",
  },
  {
    id: "p7",
    category: "marketing",
    hasImage: false,
    createdAt: "3 days ago",
    body: "Win-back message for customers who haven't shopped in {{months}} months. Offer {{incentive}} and a friendly reminder of their favorites.",
  },
  {
    id: "p8",
    category: "marketing",
    hasImage: true,
    createdAt: "3 days ago",
    body: "Festive greeting for {{festival}} from {{business}}. Short, heartfelt, ends with a CTA to view the collection.",
  },
];

export default function PromptLibraryOverlay({ open, onClose, onPick }) {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [hoveredPrompt, setHoveredPrompt] = useState(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROMPTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (q && !p.body.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, query]);

  const previewPrompt = hoveredPrompt ?? filtered[0] ?? PROMPTS[0];

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-30 flex">
          <motion.div
            key="dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="flex-1 bg-black"
          />
          <motion.section
            key="overlay"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
            className="flex h-full w-full max-w-[1186px] flex-col overflow-hidden border-l border-line bg-white"
            role="dialog"
            aria-label="Prompt Library"
          >
            <header className="flex items-center justify-between gap-3 px-6 py-5">
              <h2 className="text-[18px] font-semibold text-ink-heading">
                Prompt Library
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close prompt library"
                className="inline-flex h-7 w-7 items-center justify-center text-ink-muted hover:text-ink-heading"
              >
                <XCircle size={20} strokeWidth={1.75} />
              </button>
            </header>

            <div className="flex flex-col gap-5 px-6 pb-5">
              <label className="flex h-10 w-full items-center gap-2 rounded-sm border border-line bg-canvas px-3">
                <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Prompts..."
                  className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-muted focus:outline-none"
                />
              </label>
              <FilterChipGroup chips={CATEGORIES} active={category} onChange={setCategory} />
            </div>

            <div className="flex min-h-0 flex-1 gap-6 overflow-hidden px-6 pb-6">
              <div className="min-w-0 flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <h3 className="text-[14px] font-semibold text-ink-heading">No prompts</h3>
                    <p className="text-[12px] font-medium text-ink-muted">
                      Try a different category or search.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {filtered.map((p) => (
                      <PromptLibraryCard
                        key={p.id}
                        prompt={p}
                        onUse={onPick}
                        onCopy={(prompt) => navigator.clipboard?.writeText(prompt.body)}
                        onHover={setHoveredPrompt}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden w-[360px] shrink-0 lg:block">
                <WhatsAppMessagePreview
                  bodyLines={[
                    "Hi {{name}}, we miss you! 👋",
                    "Here's an exclusive {{discount}} off your next order — just for you.",
                    "Use code {{code}} at checkout. Valid until {{expiry_date}}.",
                  ]}
                />
              </div>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}

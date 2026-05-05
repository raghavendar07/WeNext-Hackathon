import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import MessageCreationChooser from "./MessageCreationChooser.jsx";
import AIComposeStep from "./AIComposeStep.jsx";

const STEP_TITLES = {
  mode:    "Create Campaign",
  compose: "Compose Message",
  review:  "Review & Send",
};

export default function CreateCampaignDrawer({ open, onClose }) {
  const [step, setStep] = useState("mode");
  const [mode, setMode] = useState(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  const handleSelect = (m) => {
    setMode(m);
    setStep("compose");
  };

  const handleBack = () => {
    if (step === "compose") {
      setStep("mode");
      setMode(null);
      return;
    }
    if (step === "review") {
      setStep("compose");
      return;
    }
    onClose?.();
  };

  const handleClose = () => {
    setStep("mode");
    setMode(null);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          key="create-flow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="dialog"
          aria-modal="true"
          aria-label="Create campaign"
          className="fixed inset-0 z-50 flex flex-col bg-white"
        >
          <header className="flex items-center justify-between gap-3 border-b border-line px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                aria-label={step === "mode" ? "Close" : "Back"}
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line bg-white text-ink-body hover:bg-surface-subtle"
              >
                <ChevronLeft size={16} strokeWidth={1.75} />
              </button>
              <span className="text-[13px] font-medium text-ink-muted">
                {STEP_TITLES[step] ?? "Create Campaign"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-subtle"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto">
            {step === "mode" && (
              <MessageCreationChooser
                selected={mode}
                onSelect={handleSelect}
              />
            )}
            {step === "compose" && mode === "ai" && (
              <AIComposeStep onSubmit={() => setStep("review")} />
            )}
            {step === "compose" && mode !== "ai" && (
              <ComposeStepPlaceholder mode={mode} onContinue={() => setStep("review")} />
            )}
            {step === "review" && (
              <ReviewStepPlaceholder onSend={handleClose} />
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function ComposeStepPlaceholder({ mode, onContinue }) {
  const COPY = {
    ai:       { title: "Describe your goal",            sub: "AI will draft a first version you can refine." },
    manual:   { title: "Write your message",            sub: "A blank canvas with WhatsApp formatting and variables." },
    template: { title: "Pick a template",               sub: "Choose from your approved templates library." },
  };
  const c = COPY[mode] ?? COPY.manual;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <h2 className="text-[24px] font-semibold text-ink-heading">{c.title}</h2>
      <p className="max-w-[480px] text-[14px] font-medium text-ink-muted">{c.sub}</p>
      <button
        type="button"
        onClick={onContinue}
        className="mt-3 inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-medium text-white"
      >
        Continue
      </button>
    </div>
  );
}

function ReviewStepPlaceholder({ onSend }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <h2 className="text-[24px] font-semibold text-ink-heading">Review &amp; Send</h2>
      <p className="max-w-[480px] text-[14px] font-medium text-ink-muted">
        Confirm the audience, schedule, and final preview before sending.
      </p>
      <button
        type="button"
        onClick={onSend}
        className="mt-3 inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-medium text-white"
      >
        Send Campaign
      </button>
    </div>
  );
}

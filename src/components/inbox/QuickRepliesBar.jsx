import { useState } from "react";
import { Plus, Sparkles, X } from "lucide-react";

export default function QuickRepliesBar({ onGenerateAI }) {
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-ink-muted">
          Quick Replays :
        </span>
        <Chip>Let's do it!</Chip>
        <Chip>Let's do it!</Chip>
        <button
          type="button"
          onClick={() => setEditorOpen(true)}
          className="inline-flex items-center gap-1 rounded-xs border border-line bg-white px-2 py-1 text-[11px] font-medium text-ink-muted shadow-chip transition-colors hover:bg-canvas"
        >
          <Plus size={10} className="text-ink-muted" strokeWidth={2} />
          Add
        </button>
      </div>
      <button
        type="button"
        onClick={onGenerateAI}
        className="inline-flex items-center gap-1.5"
      >
        <Sparkles size={14} className="text-brand-emerald" strokeWidth={1.75} />
        <span className="bg-cta-gradient bg-clip-text text-[12px] font-semibold text-transparent">
          Generate AI Replay
        </span>
      </button>

      {editorOpen && (
        <QuickReplyEditor
          onCancel={() => setEditorOpen(false)}
          onSave={() => {
            setEditorOpen(false);
            alert("Saved quick reply (mock)");
          }}
        />
      )}
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-xs border border-line bg-white px-2 py-1 text-[11px] font-medium text-ink-muted shadow-chip">
      {children}
    </span>
  );
}

function QuickReplyEditor({ onCancel, onSave }) {
  const [shortcut, setShortcut] = useState("");
  const [body, setBody] = useState("");

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] rounded-md border border-line bg-white p-6 shadow-card"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-ink-heading">
              New Quick Reply
            </h3>
            <p className="text-[12px] text-ink-muted">
              Save common responses to send in one tap.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-md p-1.5 text-ink-muted hover:bg-canvas"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              Shortcut
            </span>
            <input
              type="text"
              value={shortcut}
              onChange={(e) => setShortcut(e.target.value)}
              placeholder="/thanks"
              className="h-9 w-full rounded-[6px] border border-line bg-white px-3 text-[13px] text-ink-heading placeholder:text-ink-muted focus:outline-none focus-visible:shadow-focus"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              Reply body
            </span>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Thanks for reaching out! How can I help?"
              className="w-full resize-none rounded-[6px] border border-line bg-white px-3 py-2 text-[13px] text-ink-heading placeholder:text-ink-muted focus:outline-none focus-visible:shadow-focus"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[12px] font-medium text-ink-body"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex h-10 items-center rounded-button bg-cta-gradient px-5 text-[12px] font-semibold text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

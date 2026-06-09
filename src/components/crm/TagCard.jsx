import { useEffect, useRef, useState } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2, Users, Workflow, X } from "lucide-react";

const TYPE_LABEL = {
  manual:       { label: "Manual",     bg: "bg-surface-muted", text: "text-ink-muted" },
  auto:         { label: "Auto",       bg: "bg-info-bg",       text: "text-info" },
  "rule-based": { label: "Rule-based", bg: "bg-brand-50",      text: "text-brand-emerald" },
};

const SWATCHES = [
  { id: "emerald", color: "#1EB677" },
  { id: "blue",    color: "#1877F2" },
  { id: "amber",   color: "#F59E0B" },
  { id: "violet",  color: "#7C3AED" },
  { id: "rose",    color: "#E84F87" },
];

export default function TagCard({ tag }) {
  const typeCfg = TYPE_LABEL[tag.type] ?? TYPE_LABEL.manual;
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [triggerOpen, setTriggerOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const handleContacts = () => alert(`${tag.name}: ${tag.count.toLocaleString()} contacts (mock)`);
  const handleEdit = () => setEditOpen(true);
  const handleDelete = () => alert(`Deleted tag "${tag.name}" (mock)`);
  const handleTrigger = () => setTriggerOpen(true);

  return (
    <article className="relative flex flex-col gap-3 rounded-md border border-line bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-chip">
      <header className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
          <h3 className="text-[14px] font-semibold text-ink-heading">{tag.name}</h3>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Tag actions"
            onClick={() => setMenuOpen((s) => !s)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-subtle"
          >
            <MoreHorizontal size={16} strokeWidth={1.75} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-md border border-line bg-white shadow-xl">
              <MenuItem
                icon={Users}
                label="View contacts"
                onClick={() => {
                  setMenuOpen(false);
                  handleContacts();
                }}
              />
              <MenuItem
                icon={Pencil}
                label="Edit"
                onClick={() => {
                  setMenuOpen(false);
                  handleEdit();
                }}
              />
              <MenuItem
                icon={Trash2}
                label="Delete"
                tone="danger"
                onClick={() => {
                  setMenuOpen(false);
                  handleDelete();
                }}
              />
            </div>
          )}
        </div>
      </header>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[20px] font-bold leading-none text-ink-heading">
            {tag.count.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] font-medium text-ink-muted">contacts</div>
        </div>
        <span
          className={[
            "inline-flex items-center rounded-pill px-2 py-1 text-[10px] font-semibold",
            typeCfg.bg,
            typeCfg.text,
          ].join(" ")}
        >
          {typeCfg.label}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5 border-t border-line pt-3 text-[11px] font-medium text-ink-muted">
        <li>
          Used in <span className="font-semibold text-ink-heading">{tag.automations}</span> automations
        </li>
        <li>
          Used in <span className="font-semibold text-ink-heading">{tag.campaigns}</span> campaigns
        </li>
      </ul>

      <div className="flex items-center gap-2 border-t border-line pt-3">
        <ActionBtn icon={Eye} label="Contacts" onClick={handleContacts} />
        <ActionBtn icon={Pencil} label="Edit" onClick={handleEdit} />
        <ActionBtn icon={Workflow} label="Trigger" tone="brand" onClick={handleTrigger} />
      </div>

      {editOpen && <EditTagModal tag={tag} onClose={() => setEditOpen(false)} />}
      {triggerOpen && <TriggerAutomationModal tag={tag} onClose={() => setTriggerOpen(false)} />}
    </article>
  );
}

function ActionBtn({ icon: Icon, label, tone, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-xs border border-line text-[11px] font-medium",
        tone === "brand"
          ? "border-brand-500 bg-brand-50 text-brand-emerald hover:bg-brand-100"
          : "bg-white text-ink-muted hover:bg-surface-subtle hover:text-ink-heading",
      ].join(" ")}
    >
      <Icon size={12} strokeWidth={1.75} />
      {label}
    </button>
  );
}

function MenuItem({ icon: Icon, label, onClick, tone }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium hover:bg-surface-subtle",
        tone === "danger" ? "text-danger" : "text-ink-body",
      ].join(" ")}
    >
      <Icon size={13} strokeWidth={1.75} />
      {label}
    </button>
  );
}

function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-[14px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
          <button
            onClick={onClose}
            className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function EditTagModal({ tag, onClose }) {
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);
  return (
    <Modal
      title="Edit tag"
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              alert(`Updated tag "${name}" (mock)`);
            }}
            className="inline-flex h-9 items-center rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            Save
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-heading focus:border-brand-500 focus:outline-none"
          />
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Color</span>
          <div className="flex items-center gap-2">
            {SWATCHES.map((s) => {
              const active = color === s.color;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setColor(s.color)}
                  aria-label={s.id}
                  className={[
                    "h-7 w-7 rounded-full border-2 transition-transform",
                    active ? "border-ink-heading scale-110" : "border-white",
                  ].join(" ")}
                  style={{ backgroundColor: s.color }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function TriggerAutomationModal({ tag, onClose }) {
  const [picked, setPicked] = useState(null);
  const options = [
    "Welcome series",
    "Re-engagement",
    "Upsell nudge",
    "Win-back",
  ];
  return (
    <Modal
      title={`Trigger automation for "${tag.name}"`}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-sm border border-line bg-white px-3 text-[13px] font-medium text-ink-body hover:bg-surface-subtle"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              alert(`Triggered "${picked || "(none)"}" for tag "${tag.name}" (mock)`);
            }}
            className="inline-flex h-9 items-center rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white"
          >
            Trigger
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <p className="text-[12px] font-medium text-ink-muted">Pick an automation to run on all contacts with this tag.</p>
        <div className="flex flex-col gap-1.5">
          {options.map((o) => {
            const active = picked === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => setPicked(o)}
                className={[
                  "flex h-9 items-center rounded-sm border px-3 text-left text-[13px] font-medium",
                  active
                    ? "border-brand-500 bg-brand-50 text-brand-emerald"
                    : "border-line bg-white text-ink-body hover:bg-surface-subtle",
                ].join(" ")}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

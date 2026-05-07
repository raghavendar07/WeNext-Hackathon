import { useState } from "react";
import { CheckCircle2, Play, X } from "lucide-react";
import { findTriggerById } from "./data.js";

const SAMPLE_CONTACTS = [
  { id: "c1", name: "Aisha Khan",    initial: "A" },
  { id: "c2", name: "Rahul Verma",   initial: "R" },
  { id: "c3", name: "Priya Menon",   initial: "P" },
  { id: "c4", name: "Karthik Rao",   initial: "K" },
];

export default function TestModePanel({ name, flow, onClose }) {
  const [contactId, setContactId] = useState(SAMPLE_CONTACTS[0].id);
  const [mode, setMode] = useState("dry");
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);

  const run = () => {
    if (running) return;
    setRunning(true);
    const trigger = flow.find((n) => n.kind === "trigger");
    const triggerDef = trigger ? findTriggerById(trigger.type) : null;
    const steps = [
      { kind: "ok",   text: `Trigger matched: ${triggerDef?.label ?? "—"}` },
      ...flow.filter((n) => n.kind !== "trigger").map((n) => describeStep(n, mode)),
      { kind: "done", text: mode === "dry" ? "Dry run complete — no real messages sent." : "Live run complete." },
    ].filter(Boolean);
    setLog(steps);
    setTimeout(() => setRunning(false), 400);
  };

  return (
    <aside role="dialog" aria-modal="true" className="fixed right-0 top-0 z-50 flex h-full w-[400px] flex-col border-l border-line bg-white shadow-card">
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-ink-heading">Test this automation</span>
          <span className="text-[11px] font-medium text-ink-muted">"{name}"</span>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="inline-flex h-8 w-8 items-center justify-center rounded-xs text-ink-muted hover:bg-surface-muted">
          <X size={14} />
        </button>
      </header>

      <div className="flex flex-col gap-4 overflow-y-auto p-5">
        <Field label="Contact">
          <select value={contactId} onChange={(e) => setContactId(e.target.value)} className="h-10 rounded-sm border border-line bg-white px-3 text-[12px]">
            {SAMPLE_CONTACTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Mode" hint="Dry run is recommended for first test.">
          <div className="flex flex-col gap-2 text-[12px] text-ink-body">
            <label className="inline-flex items-center gap-2">
              <input type="radio" checked={mode === "dry"} onChange={() => setMode("dry")} />
              Dry run — simulate the flow, no messages sent
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="radio" checked={mode === "live"} onChange={() => setMode("live")} />
              Live — actually run the automation on this contact
            </label>
          </div>
        </Field>

        <button type="button" onClick={run} disabled={running || flow.length === 0} className={["inline-flex h-10 items-center justify-center gap-2 rounded-button px-4 text-[12px] font-semibold text-white", running || flow.length === 0 ? "bg-cta-gradient opacity-40 cursor-not-allowed" : "bg-cta-gradient hover:opacity-90"].join(" ")}>
          <Play size={12} /> {running ? "Running…" : "Run test"}
        </button>

        {log.length > 0 && (
          <section className="flex flex-col gap-2 rounded-md border border-line bg-canvas p-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">Test log</h3>
            <ul className="flex flex-col gap-1.5">
              {log.map((entry, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] leading-snug">
                  <CheckCircle2 size={12} className={entry.kind === "skipped" ? "mt-0.5 text-ink-muted" : "mt-0.5 text-success"} />
                  <span className={entry.kind === "skipped" ? "text-ink-muted" : "text-ink-body"}>{entry.text}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </aside>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold text-ink-heading">{label}</span>
      {children}
      {hint && <span className="text-[10px] font-medium text-ink-muted">{hint}</span>}
    </label>
  );
}

function describeStep(node, mode) {
  if (node.kind === "wait") {
    return mode === "dry"
      ? { kind: "skipped", text: `Wait ${node.value ?? 5} ${node.unit ?? "minutes"} (skipped in dry run)` }
      : { kind: "ok",      text: `Waiting ${node.value ?? 5} ${node.unit ?? "minutes"}` };
  }
  if (node.type === "send_wa") {
    return mode === "dry"
      ? { kind: "ok", text: `WhatsApp message would send: "${(node.template || node.customBody || "—").slice(0, 50)}…"` }
      : { kind: "ok", text: `WhatsApp message sent` };
  }
  if (node.type === "add_tag") {
    return { kind: "ok", text: `Tag${(node.tags ?? []).length > 1 ? "s" : ""} ${(node.tags ?? []).join(", ") || "—"} would be added` };
  }
  if (node.type === "remove_tag") {
    return { kind: "ok", text: `Tag${(node.tags ?? []).length > 1 ? "s" : ""} ${(node.tags ?? []).join(", ") || "—"} would be removed` };
  }
  if (node.type === "change_stage") {
    return { kind: "ok", text: `Lead stage would change to ${node.toStage ?? "—"}` };
  }
  if (node.type === "update_field") {
    return { kind: "ok", text: `Field ${node.field ?? "—"} would update` };
  }
  if (node.kind === "branch") {
    return { kind: "ok", text: `Branch evaluated: ${node.condition ?? "—"} → ${node.yesLabel ?? "Yes"} branch chosen` };
  }
  if (node.kind === "goal") {
    return { kind: "ok", text: `Goal reached: ${node.title ?? "Completed"}` };
  }
  return { kind: "ok", text: `Step ran` };
}

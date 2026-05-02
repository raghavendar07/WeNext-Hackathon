const STATUS = {
  running: {
    label: "Running",
    bg: "bg-success-bg",
    border: "border-success-border",
    text: "text-success",
    dot: "bg-success",
  },
  paused: {
    label: "Paused",
    bg: "bg-warning-bg",
    border: "border-warning-border",
    text: "text-warning",
    dot: "bg-warning",
  },
  draft: {
    label: "Draft",
    bg: "bg-surface-muted",
    border: "border-line",
    text: "text-ink-muted",
    dot: "bg-ink-subtle",
  },
  completed: {
    label: "Completed",
    bg: "bg-info-bg",
    border: "border-info-border",
    text: "text-info",
    dot: "bg-info",
  },
  approved: {
    label: "Approved",
    bg: "bg-success-bg",
    border: "border-success-border",
    text: "text-success",
    dot: "bg-success",
  },
  pending: {
    label: "Pending",
    bg: "bg-warning-bg",
    border: "border-warning-border",
    text: "text-warning",
    dot: "bg-warning",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-danger-bg",
    border: "border-danger-border",
    text: "text-danger",
    dot: "bg-danger",
  },
};

export default function StatusPill({ status }) {
  const s = STATUS[status] ?? STATUS.draft;
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-pill border px-2 py-1 text-[11px] font-semibold",
        s.bg,
        s.border,
        s.text,
      ].join(" ")}
    >
      <span aria-hidden className={["h-1.5 w-1.5 rounded-full", s.dot].join(" ")} />
      {s.label}
    </span>
  );
}

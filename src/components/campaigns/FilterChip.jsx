export default function FilterChip({ label, icon: Icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-medium",
        "transition-colors duration-150 ease-out",
        active
          ? "border-ink-heading bg-ink-heading text-white"
          : "border-line bg-canvas text-ink-muted hover:bg-surface-subtle hover:text-ink-heading",
      ].join(" ")}
    >
      {Icon && (
        <Icon
          size={14}
          strokeWidth={1.75}
          className={active ? "text-white" : "text-ink-muted"}
          aria-hidden="true"
        />
      )}
      {label}
    </button>
  );
}

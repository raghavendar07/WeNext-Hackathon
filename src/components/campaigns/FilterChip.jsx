export default function FilterChip({ label, icon: Icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-[12px]",
        "transition-colors duration-150 ease-out",
        active
          ? "border-ink-heading bg-ink-heading font-semibold text-white"
          : "border-line bg-canvas font-medium text-ink-muted hover:bg-surface-subtle hover:text-ink-heading",
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

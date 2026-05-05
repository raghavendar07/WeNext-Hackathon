export default function SuggestionChip({ emoji, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex flex-1 items-center justify-center gap-2 rounded-pill border border-line bg-white",
        "px-5 py-2.5 text-[13px] font-medium text-ink-heading",
        "transition-all duration-150 ease-out",
        "hover:border-line-default hover:shadow-chip",
        "focus:outline-none focus-visible:shadow-focus",
      ].join(" ")}
    >
      <span aria-hidden className="text-[16px] leading-none">{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

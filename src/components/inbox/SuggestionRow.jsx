export default function SuggestionRow({ index, text, highlighted, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-start gap-2 border-b border-line px-1 pb-2 text-left",
        "transition-colors",
        highlighted ? "bg-canvas" : "hover:bg-canvas",
      ].join(" ")}
    >
      <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line bg-canvas text-[10px] font-medium text-ink-subtle">
        {index}
      </span>
      <span
        className="text-[12px] text-ink-heading"
        style={{ lineHeight: 1.5 }}
      >
        {text}
      </span>
    </button>
  );
}

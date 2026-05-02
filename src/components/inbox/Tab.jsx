import CountBadge from "./CountBadge.jsx";

export default function Tab({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "-mb-px flex items-end gap-2 border-b-2 px-[15px] pb-[10px] pt-2 text-[12px] font-semibold",
        "transition-colors duration-150 ease-out",
        active
          ? "border-[#00A63E] text-[#00A63E]"
          : "border-transparent text-ink-muted hover:text-ink-heading",
      ].join(" ")}
    >
      <span>{label}</span>
      {count !== undefined && <CountBadge value={count} />}
    </button>
  );
}

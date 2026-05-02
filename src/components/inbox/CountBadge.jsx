export default function CountBadge({ value }) {
  return (
    <span
      className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border border-line bg-white text-[10px] font-bold text-ink-muted"
      style={{ letterSpacing: "0.6px" }}
    >
      {value}
    </span>
  );
}

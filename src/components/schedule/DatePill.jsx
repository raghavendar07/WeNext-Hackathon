export default function DatePill({ children }) {
  return (
    <span className="inline-flex items-center rounded-xs border border-line bg-info-bg px-2 py-1 text-[10px] font-semibold uppercase text-ink-muted">
      {children}
    </span>
  );
}

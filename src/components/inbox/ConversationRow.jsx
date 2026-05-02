import Avatar from "./Avatar.jsx";

export { paletteFor } from "./Avatar.jsx";

export default function ConversationRow({ conversation, active, onClick }) {
  const { name, preview, time, unread, palette } = conversation;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-[60px] w-full items-center gap-[10px] p-[10px] text-left",
        "transition-colors duration-150 ease-out",
        active
          ? "rounded-[5px] border border-line shadow-[0_5px_20px_0_#EFF3F8]"
          : "hover:bg-surface-subtle",
      ].join(" ")}
    >
      <Avatar name={name} palette={palette} size={40} />
      <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[14px] font-semibold text-ink-heading">
            {name}
          </span>
          <span className="shrink-0 text-[12px] font-medium text-ink-muted">
            {time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-ink-muted">
            {preview}
          </span>
          {unread && (
            <span
              aria-label="Unread"
              className="h-3 w-3 shrink-0 rounded-full bg-cta-gradient"
            />
          )}
        </div>
      </div>
    </button>
  );
}

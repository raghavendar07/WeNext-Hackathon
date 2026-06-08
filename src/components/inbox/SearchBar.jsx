import { useState } from "react";
import { Search, Filter } from "lucide-react";

export default function SearchBar({
  placeholder = "Search conversation...",
  value,
  onChange,
  onFilter = () => alert('Filter mock'),
}) {
  const [internal, setInternal] = useState("");
  const v = value ?? internal;
  const set = onChange ?? setInternal;

  return (
    <div className="flex w-full items-center gap-[10px]">
      <label
        className={[
          "flex h-10 flex-1 cursor-text items-center gap-[5px] rounded-[8px] border border-line bg-white px-[15px]",
          "transition-colors duration-150 ease-out focus-within:border-line-strong",
        ].join(" ")}
      >
        <Search size={14} className="shrink-0 text-[#99A1AF]" strokeWidth={1.75} />
        <input
          type="text"
          value={v}
          onChange={(e) => set(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-ink-heading placeholder:text-[#99A1AF] focus:outline-none"
          style={{ letterSpacing: "0.5px" }}
        />
      </label>
      <button
        type="button"
        onClick={onFilter}
        aria-label="Filter conversations"
        className={[
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-line bg-white",
          "transition-colors duration-150 ease-out hover:bg-surface-subtle",
        ].join(" ")}
      >
        <Filter size={14} className="text-ink-muted" strokeWidth={1.75} />
      </button>
    </div>
  );
}

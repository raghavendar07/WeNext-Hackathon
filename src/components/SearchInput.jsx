import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

export default function SearchInput({
  placeholder = "Search",
  hint = "⌘K",
  value,
  onChange,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <label
      className={[
        "group flex h-9 w-full cursor-text items-center gap-[8px] rounded-[8px]",
        "border border-[#DADADA] bg-white px-[10px]",
        "transition-colors duration-150 ease-out",
        "hover:bg-[#F9FAFB]",
        "focus-within:border-[#D1D5DB] focus-within:bg-white focus-within:shadow-focus",
      ].join(" ")}
    >
      <Search
        size={16}
        strokeWidth={1.75}
        className="shrink-0 text-[#9CA3AF]"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className={[
          "min-w-0 flex-1 bg-transparent text-[12px] text-[#111827]",
          "placeholder:text-[#9CA3AF]",
          "focus:outline-none",
        ].join(" ")}
      />
      {hint && (
        <kbd
          aria-hidden="true"
          className={[
            "shrink-0 rounded-[4px] border border-[#DADADA] bg-white",
            "px-[5px] py-[1px] text-[10px] font-medium text-[#6B7280]",
          ].join(" ")}
        >
          {hint}
        </kbd>
      )}
    </label>
  );
}

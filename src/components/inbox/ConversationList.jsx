import { useState } from "react";
import ListHeader from "./ListHeader.jsx";
import TabBar from "./TabBar.jsx";
import SearchBar from "./SearchBar.jsx";
import ConversationRow from "./ConversationRow.jsx";

const TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread", count: 12 },
  { id: "agents", label: "Assigned to agents", count: 12 },
];

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
}) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  return (
    <div className="flex h-full flex-col gap-[15px] px-[15px] py-5">
      <ListHeader />

      <div className="flex flex-1 flex-col gap-[15px] overflow-hidden">
        <TabBar tabs={TABS} active={tab} onChange={setTab} />
        <SearchBar value={query} onChange={setQuery} />

        <div className="flex flex-1 flex-col gap-[5px] overflow-y-auto">
          {conversations.map((c) => (
            <ConversationRow
              key={c.id}
              conversation={c}
              active={c.id === activeId}
              onClick={() => onSelect?.(c.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

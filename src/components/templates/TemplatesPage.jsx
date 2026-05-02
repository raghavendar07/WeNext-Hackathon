import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import DropdownSelect from "../campaigns/DropdownSelect.jsx";
import FilterChipGroup from "../campaigns/FilterChipGroup.jsx";
import TemplateCard from "./TemplateCard.jsx";
import { TEMPLATE_TYPES, TYPE_ORDER } from "./templateTypes.js";

const APPROVAL_OPTIONS = [
  { id: "all",      label: "All Templates" },
  { id: "approved", label: "Approved" },
  { id: "pending",  label: "Pending" },
  { id: "rejected", label: "Rejected" },
];

const TEMPLATES = [
  {
    id: "t1",
    name: "Order Confirmation",
    type: "text",
    status: "approved",
    body: "Hi {{name}}, your order #{{order_id}} has been confirmed. We'll notify you when it ships. Thanks for shopping with us!",
    updated: "2 days ago",
  },
  {
    id: "t2",
    name: "Spring Promo Banner",
    type: "image",
    status: "approved",
    filename: "spring-promo-1080.jpg",
    updated: "5 days ago",
  },
  {
    id: "t3",
    name: "Onboarding Walkthrough",
    type: "video",
    status: "pending",
    filename: "onboarding-v2.mp4",
    updated: "1 day ago",
  },
  {
    id: "t4",
    name: "Pricing Sheet Q2",
    type: "document",
    status: "approved",
    filename: "pricing-q2.pdf",
    updated: "1 week ago",
  },
  {
    id: "t5",
    name: "Bangalore Store",
    type: "location",
    status: "approved",
    placeName: "WeNext HQ",
    address: "12 MG Road, Bengaluru 560001",
    updated: "3 weeks ago",
  },
  {
    id: "t6",
    name: "Cart Abandonment",
    type: "text",
    status: "rejected",
    body: "Hi {{name}}, you left items in your cart! Complete your purchase now and get 10% off with code SAVE10.",
    updated: "Yesterday",
  },
];

export default function TemplatesPage() {
  const [type, setType] = useState("all");
  const [approval, setApproval] = useState("all");
  const [query, setQuery] = useState("");

  const typeChips = useMemo(
    () =>
      TYPE_ORDER.map((id) => ({
        id,
        label: TEMPLATE_TYPES[id].label,
        icon: TEMPLATE_TYPES[id].icon,
      })),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (approval !== "all" && t.status !== approval) return false;
      if (q && !t.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [type, approval, query]);

  return (
    <div className="flex flex-col gap-5">
      {/* Layer 2 — Page header */}
      <header className="flex items-center justify-between gap-4 py-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-ink-heading">
            Templates Library
          </h1>
          <p className="text-[13px] font-medium text-ink-muted">
            Create and manage your reusable WhatsApp message templates
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <DropdownSelect
            value={approval}
            options={APPROVAL_OPTIONS}
            onChange={setApproval}
            ariaLabel="Filter by approval status"
          />
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-button bg-cta-gradient px-4 text-[13px] font-medium text-white shadow-[0_0_10px_rgba(1,170,154,0.3)]"
          >
            <Plus size={14} strokeWidth={2} />
            New Template
          </button>
        </div>
      </header>

      {/* Layer 3 — Type pills + search */}
      <div className="flex items-center justify-between gap-4 border-b border-line py-3">
        <FilterChipGroup chips={typeChips} active={type} onChange={setType} />
        <label className="flex h-9 w-[300px] shrink-0 items-center gap-2 rounded-sm border border-line bg-white px-3 focus-within:shadow-focus">
          <Search size={14} className="text-ink-subtle" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates..."
            className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-ink-heading placeholder:text-ink-subtle focus:outline-none"
          />
        </label>
      </div>

      {/* Templates grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <h3 className="text-[14px] font-semibold text-ink-heading">
            No templates match your filters
          </h3>
          <p className="text-[12px] font-medium text-ink-muted">
            Try a different type or search term, or create a new template.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      )}
    </div>
  );
}

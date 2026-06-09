import { useEffect } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Globe,
  Star,
  Tag,
  ShoppingBag,
  FileText,
  Image as ImageIcon,
  Bell,
  BellOff,
  UserX,
  Calendar,
  MessageSquare,
  Download,
  Edit3,
} from "lucide-react";
import Avatar from "./Avatar.jsx";

const MOCK_PROFILE = {
  email: "anita.sharma@gmail.com",
  location: "Mumbai, India",
  language: "English",
  timezone: "Asia/Kolkata · GMT+5:30",
  source: "Instagram Ad — Summer Sale",
  tags: ["VIP", "Prospect", "Order #ORD-2847"],
  lifetime: { spent: "₹24,500", orders: 7, lastOrder: "Aug 12, 2025" },
  customSince: "Jan 14, 2024",
  notes:
    "Prefers WhatsApp over email. Asked about express delivery for previous orders. Buys gift sets frequently around Diwali.",
  recentOrders: [
    { id: "ORD-2847", date: "Today",  total: "₹1,890", status: "In transit" },
    { id: "ORD-2701", date: "Aug 12", total: "₹3,250", status: "Delivered"  },
    { id: "ORD-2581", date: "Jul 02", total: "₹890",   total2: true, status: "Delivered" },
  ],
  files: [
    { name: "Invoice-2847.pdf", size: "84 KB", kind: "pdf" },
    { name: "shipping-label.png", size: "120 KB", kind: "image" },
  ],
  activity: [
    { at: "2m",  text: "Sent message: \"Can I reschedule my order…\""       },
    { at: "1h",  text: "Automation \"Delivery Status Flow\" triggered"     },
    { at: "1d",  text: "Tagged as VIP by Anita"                             },
    { at: "3d",  text: "Order ORD-2847 placed (₹1,890)"                     },
    { at: "12d", text: "Replied to campaign \"Summer Sale\""                },
  ],
};

export default function ContactProfileDrawer({ open, onClose, contact }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const p = { ...MOCK_PROFILE, ...(contact?.profile ?? {}) };
  const phone = contact?.phone ?? "+91 98765 43210";
  const name = contact?.name ?? "Contact";

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="relative h-full w-[400px] overflow-y-auto bg-white shadow-2xl"
        role="dialog"
        aria-label={`${name} profile`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F0F2F5] bg-white px-5 py-3">
          <span className="text-[13px] font-semibold text-ink-heading">Contact details</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-surface-subtle"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* Identity */}
        <div className="flex flex-col items-center gap-2 px-5 py-5 text-center">
          <Avatar name={name} palette={contact?.palette} size={72} />
          <div className="mt-1 flex items-center gap-1.5">
            <h3 className="text-[16px] font-semibold text-ink-heading">{name}</h3>
            <button
              type="button"
              onClick={() => alert("Edit name (mock)")}
              className="rounded p-1 text-ink-muted hover:bg-surface-subtle"
              aria-label="Edit"
            >
              <Edit3 size={12} />
            </button>
          </div>
          <span className="text-[12px] text-ink-muted">{phone}</span>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active now
          </span>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2 px-5 pb-4">
          <QuickAct icon={MessageSquare} label="Message" onClick={() => alert("Compose mock")} />
          <QuickAct icon={Phone} label="Call" onClick={() => alert("Calling mock")} />
          <QuickAct icon={Calendar} label="Book" onClick={() => alert("Book appointment mock")} />
          <QuickAct icon={BellOff} label="Mute" onClick={() => alert("Muted mock")} />
        </div>

        {/* Contact info */}
        <Section title="Contact info">
          <Row icon={Phone} label="Phone" value={phone} />
          <Row icon={Mail}  label="Email" value={p.email} />
          <Row icon={MapPin} label="Location" value={p.location} />
          <Row icon={Globe} label="Language / Timezone" value={`${p.language} · ${p.timezone}`} />
        </Section>

        {/* Tags */}
        <Section
          title="Tags"
          action={
            <button onClick={() => alert("Add tag mock")} className="text-[11px] font-semibold text-brand-emerald hover:underline">
              + Add
            </button>
          }
        >
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-medium text-[#334155]"
              >
                <Tag size={10} className="text-ink-muted" />
                {t}
              </span>
            ))}
          </div>
        </Section>

        {/* Customer value */}
        <Section title="Lifetime value">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Spent" value={p.lifetime.spent} />
            <Stat label="Orders" value={p.lifetime.orders} />
            <Stat label="Last order" value={p.lifetime.lastOrder} />
          </div>
          <div className="mt-2 text-[11px] text-ink-muted">
            Customer since {p.customSince} · Source: <span className="font-medium text-ink-body">{p.source}</span>
          </div>
        </Section>

        {/* Notes */}
        <Section
          title="Notes"
          action={
            <button onClick={() => alert("Edit notes mock")} className="text-[11px] font-semibold text-brand-emerald hover:underline">
              Edit
            </button>
          }
        >
          <p className="rounded-[8px] bg-amber-50/60 p-2.5 text-[12px] leading-relaxed text-[#475569]">
            {p.notes}
          </p>
        </Section>

        {/* Recent orders */}
        <Section
          title="Recent orders"
          action={
            <button onClick={() => alert("View all orders mock")} className="text-[11px] font-semibold text-brand-emerald hover:underline">
              View all
            </button>
          }
        >
          <div className="space-y-1.5">
            {p.recentOrders.map((o) => (
              <button
                key={o.id}
                onClick={() => alert(`Open order ${o.id} (mock)`)}
                className="flex w-full items-center justify-between rounded-[8px] border border-[#F0F2F5] px-2.5 py-2 text-left hover:bg-[#F9FAFB]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-emerald-50 text-emerald-700">
                    <ShoppingBag size={13} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-ink-heading">#{o.id}</div>
                    <div className="text-[11px] text-ink-muted">{o.date} · {o.status}</div>
                  </div>
                </div>
                <span className="text-[12px] font-semibold text-ink-heading">{o.total}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Files */}
        <Section title="Shared files">
          <div className="space-y-1.5">
            {p.files.map((f) => (
              <button
                key={f.name}
                onClick={() => alert(`Download ${f.name} (mock)`)}
                className="flex w-full items-center justify-between rounded-[8px] border border-[#F0F2F5] px-2.5 py-2 text-left hover:bg-[#F9FAFB]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-blue-50 text-blue-600">
                    {f.kind === "pdf" ? <FileText size={13} /> : <ImageIcon size={13} />}
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-ink-heading">{f.name}</div>
                    <div className="text-[11px] text-ink-muted">{f.size}</div>
                  </div>
                </div>
                <Download size={13} className="text-ink-muted" />
              </button>
            ))}
          </div>
        </Section>

        {/* Activity */}
        <Section title="Recent activity">
          <ul className="space-y-2">
            {p.activity.map((e, i) => (
              <li key={i} className="flex gap-2.5 text-[12px]">
                <span className="mt-1.5 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-brand-emerald" />
                <div className="flex-1">
                  <div className="text-[12px] text-ink-body">{e.text}</div>
                  <div className="text-[10px] text-ink-muted">{e.at} ago</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* Danger actions */}
        <div className="px-5 pb-6 pt-1">
          <div className="border-t border-[#F0F2F5] pt-3">
            <DangerRow icon={Bell} label="Notification settings" onClick={() => alert("Settings mock")} />
            <DangerRow icon={Star} label="Mark as priority" onClick={() => alert("Marked priority mock")} />
            <DangerRow icon={UserX} label="Block contact" danger onClick={() => confirm("Block contact?") && alert("Blocked (mock)")} />
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, action, children }) {
  return (
    <section className="border-t border-[#F0F2F5] px-5 py-3.5">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-[10px] font-semibold uppercase tracking-wide text-ink-subtle">{title}</h4>
        {action}
      </div>
      {children}
    </section>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 py-1">
      <Icon size={13} className="mt-0.5 shrink-0 text-ink-muted" strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wide text-ink-subtle">{label}</div>
        <div className="truncate text-[12px] font-medium text-ink-heading">{value}</div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-[8px] bg-[#F9FAFB] p-2 text-center">
      <div className="text-[13px] font-semibold text-ink-heading">{value}</div>
      <div className="text-[10px] text-ink-muted">{label}</div>
    </div>
  );
}

function QuickAct({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 rounded-[8px] border border-[#F0F2F5] py-2 text-[11px] font-medium text-ink-body transition-colors hover:bg-[#F9FAFB]"
    >
      <Icon size={14} strokeWidth={1.75} className="text-ink-muted" />
      {label}
    </button>
  );
}

function DangerRow({ icon: Icon, label, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between rounded-[6px] px-2 py-2 text-left text-[12px] font-medium hover:bg-[#F9FAFB]",
        danger ? "text-danger" : "text-ink-body",
      ].join(" ")}
    >
      <span className="inline-flex items-center gap-2">
        <Icon size={14} strokeWidth={1.75} />
        {label}
      </span>
    </button>
  );
}

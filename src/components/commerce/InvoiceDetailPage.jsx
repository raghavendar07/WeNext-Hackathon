import { useMemo } from "react";
import {
  ChevronLeft,
  Download,
  Send,
  MoreHorizontal,
  CheckCircle2,
  Mail,
  Bell,
} from "lucide-react";
import {
  INVOICE_STATUS_PILLS,
  formatCurrency,
  formatDate,
} from "./data.js";

const MOCK_LINES = [
  { id: 1, description: "Design retainer — June",          qty: 1, rate: 25000 },
  { id: 2, description: "Add-on social ad creatives (x4)", qty: 4, rate: 2125 },
  { id: 3, description: "Photo retouching (per image)",    qty: 6, rate: 500 },
];

const MOCK_HISTORY_BY_STATUS = {
  paid: [
    { id: 1, label: "Invoice paid in full", when: "2026-05-06 · 11:14 AM", tone: "success" },
    { id: 2, label: "Invoice sent to customer", when: "2026-05-04 · 02:18 PM", tone: "default" },
  ],
  sent: [
    { id: 1, label: "Invoice viewed by customer", when: "2026-05-04 · 04:22 PM", tone: "default" },
    { id: 2, label: "Invoice sent to customer",   when: "2026-05-04 · 02:18 PM", tone: "default" },
  ],
  overdue: [
    { id: 1, label: "Reminder sent (3 days overdue)", when: "2026-05-05 · 09:00 AM", tone: "warning" },
    { id: 2, label: "Invoice sent to customer",       when: "2026-04-22 · 02:18 PM", tone: "default" },
  ],
  draft: [
    { id: 1, label: "Draft created", when: "2026-04-18 · 02:18 PM", tone: "default" },
    { id: 2, label: "Draft updated", when: "2026-04-18 · 02:20 PM", tone: "default" },
  ],
  void: [
    { id: 1, label: "Invoice voided", when: "2026-05-02 · 10:00 AM", tone: "warning" },
    { id: 2, label: "Invoice sent",   when: "2026-05-01 · 02:18 PM", tone: "default" },
  ],
};

export default function InvoiceDetailPage({ invoice, onBack }) {
  const lines = MOCK_LINES;
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.qty * l.rate, 0), [lines]);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const pill = INVOICE_STATUS_PILLS[invoice.status] ?? INVOICE_STATUS_PILLS.draft;
  const history = MOCK_HISTORY_BY_STATUS[invoice.status] ?? MOCK_HISTORY_BY_STATUS.sent;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-line bg-white text-ink-body hover:bg-surface-subtle"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-semibold text-ink-heading">Invoice {invoice.id}</h1>
              <span className={["inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5 text-[11px] font-semibold", pill.bg, pill.text].join(" ")}>
                <span aria-hidden className={["h-1.5 w-1.5 rounded-full", pill.dot].join(" ")} />
                {pill.label}
              </span>
            </div>
            <p className="text-[13px] font-medium text-ink-muted">
              Issued {formatDate(invoice.date)} · Due {formatDate(invoice.date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert("Download PDF (mock)")}
            className="inline-flex h-10 items-center gap-2 rounded-button border border-line bg-white px-4 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle"
          >
            <Download size={14} />
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => alert("Invoice sent (mock)")}
            className="inline-flex h-10 items-center gap-2 rounded-button bg-cta-gradient px-5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            <Send size={14} />
            Send
          </button>
          <button
            type="button"
            aria-label="More actions"
            className="inline-flex h-10 w-10 items-center justify-center rounded-button border border-line bg-white text-ink-body hover:bg-surface-subtle"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-5">
        {/* Body */}
        <div className="col-span-2 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <PartyCard
              label="Bill from"
              name="WeNext Studios Pvt Ltd"
              lines={[
                "GSTIN 27ABCDE1234F1Z5",
                "WeWork Embassy TechVillage",
                "Bengaluru, KA 560103",
                "billing@wenext.in",
              ]}
            />
            <PartyCard
              label="Bill to"
              name={invoice.customer}
              lines={[
                "Acme Ventures Pvt Ltd",
                "12, Marine Drive",
                "Mumbai, MH 400020",
                `${invoice.customer.toLowerCase().replace(/\s+/g, ".")}@example.com`,
              ]}
            />
          </div>

          <Card title="Line items">
            <div className="overflow-hidden rounded-md border border-line bg-white">
              <table className="w-full text-[13px]">
                <thead className="bg-surface-subtle">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">
                    <Th>Description</Th>
                    <Th align="right">Qty</Th>
                    <Th align="right">Rate</Th>
                    <Th align="right">Amount</Th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l) => (
                    <tr key={l.id} className="border-t border-line">
                      <td className="px-4 py-3 text-ink-body">{l.description}</td>
                      <td className="px-4 py-3 text-right text-ink-body">{l.qty}</td>
                      <td className="px-4 py-3 text-right text-ink-body">{formatCurrency(l.rate)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-ink-heading">
                        {formatCurrency(l.qty * l.rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
              <h3 className="text-[12px] font-semibold uppercase tracking-wide text-ink-subtle">Payment terms</h3>
              <p className="text-[13px] text-ink-body">Net 14 — payable within 14 days of issue date.</p>
              <p className="text-[12px] text-ink-muted">Bank: HDFC · A/C 0042-9911-2207 · IFSC HDFC0000204</p>
            </div>
            <div className="flex flex-col gap-3 rounded-md border border-line bg-white p-5">
              <h3 className="text-[12px] font-semibold uppercase tracking-wide text-ink-subtle">Notes</h3>
              <p className="text-[13px] text-ink-body">
                Thanks for the continued partnership. Please include the invoice number in your transfer reference.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="flex w-[320px] flex-col gap-2 rounded-md border border-line bg-white p-5 text-[13px]">
              <TotalRow label="Subtotal" value={formatCurrency(subtotal)} />
              <TotalRow label="Tax (18% GST)" value={formatCurrency(tax)} />
              <div className="my-1 border-t border-line" />
              <TotalRow label="Total due" value={formatCurrency(total)} bold />
            </div>
          </div>
        </div>

        {/* Side */}
        <div className="flex flex-col gap-5">
          <Card title="Payment history">
            <ol className="flex flex-col rounded-md border border-line bg-white">
              {history.map((h, idx) => (
                <li
                  key={h.id}
                  className={["flex items-start gap-3 px-4 py-3", idx > 0 ? "border-t border-line" : ""].join(" ")}
                >
                  <span
                    className={[
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                      h.tone === "success"
                        ? "border-brand-emerald bg-brand-50 text-brand-emerald"
                        : h.tone === "warning"
                          ? "border-warning/40 bg-amber-50 text-warning"
                          : "border-line bg-surface-subtle text-ink-body",
                    ].join(" ")}
                  >
                    {h.tone === "success" ? <CheckCircle2 size={12} /> : <Mail size={12} />}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[12px] font-semibold text-ink-heading">{h.label}</span>
                    <span className="text-[11px] text-ink-muted">{h.when}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <button
            type="button"
            onClick={() => alert("Reminder sent (mock)")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-button border border-line bg-white px-4 text-[13px] font-semibold text-ink-body hover:bg-surface-subtle"
          >
            <Bell size={14} />
            Send reminder
          </button>

          <Card title="Quick info">
            <div className="flex flex-col gap-2 rounded-md border border-line bg-white p-4 text-[12px]">
              <InfoRow label="Invoice #" value={invoice.id} />
              <InfoRow label="Linked payment" value={invoice.paymentId ?? "—"} />
              <InfoRow label="Currency" value="INR (₹)" />
              <InfoRow label="Amount" value={formatCurrency(invoice.amount)} bold />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PartyCard({ label, name, lines }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-line bg-white p-5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-subtle">{label}</span>
      <span className="text-[14px] font-semibold text-ink-heading">{name}</span>
      <div className="flex flex-col gap-0.5 text-[12px] text-ink-body">
        {lines.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-ink-subtle">{title}</h2>
        {subtitle && <span className="text-[11px] font-medium text-ink-muted">{subtitle}</span>}
      </div>
      {children}
    </section>
  );
}

function TotalRow({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-medium text-ink-body">{label}</span>
      <span className={[bold ? "text-[15px] font-semibold text-ink-heading" : "text-[13px] text-ink-heading"].join(" ")}>
        {value}
      </span>
    </div>
  );
}

function InfoRow({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className={bold ? "font-semibold text-ink-heading" : "text-ink-body"}>{value}</span>
    </div>
  );
}

function Th({ children, align }) {
  return (
    <th className={["px-4 py-3", align === "right" ? "text-right" : "text-left"].join(" ")}>
      {children}
    </th>
  );
}

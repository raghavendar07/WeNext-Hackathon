import { useRef, useState } from "react";
import {
  Smile,
  Paperclip,
  PackageCheck,
  Receipt,
  Clock,
  ArrowUp,
  X,
  Package,
  Send,
} from "lucide-react";

const CARRIERS = ["FedEx", "DHL", "UPS", "India Post"];

export default function MessageInputCard({ onSchedule, onSend }) {
  const [text, setText] = useState("");
  const [shipmentOpen, setShipmentOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    onSend?.(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) alert(`Attached: ${file.name}`);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-line bg-white p-3 shadow-chip">
      {/* Row 1 — input line */}
      <div className="flex items-center gap-2">
        <Smile size={18} className="shrink-0 text-ink-muted" strokeWidth={1.75} />
        <span className="h-5 w-px shrink-0 bg-line" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message ....."
          className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-ink-heading placeholder:text-ink-muted focus:outline-none"
        />
      </div>

      {/* Row 2 — actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconBtn
            ariaLabel="Attachment"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={16} className="text-ink-muted" strokeWidth={1.75} />
          </IconBtn>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <IconBtn ariaLabel="Send package" onClick={() => setShipmentOpen(true)}>
            <PackageCheck size={16} className="text-ink-muted" strokeWidth={1.75} />
          </IconBtn>
          <IconBtn ariaLabel="Invoice" onClick={() => setInvoiceOpen(true)}>
            <Receipt size={16} className="text-ink-muted" strokeWidth={1.75} />
          </IconBtn>
        </div>
        <div className="flex items-center gap-2">
          <IconBtn ariaLabel="Schedule message" onClick={onSchedule}>
            <Clock size={16} className="text-ink-muted" strokeWidth={1.75} />
          </IconBtn>
          <span className="h-5 w-px shrink-0 bg-line" />
          <button
            type="button"
            onClick={handleSend}
            aria-label="Send message"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cta-gradient transition-opacity hover:opacity-95"
          >
            <ArrowUp size={14} className="text-white" strokeWidth={2} />
          </button>
        </div>
      </div>

      {shipmentOpen && (
        <ShipmentModal
          onCancel={() => setShipmentOpen(false)}
          onSend={(payload) => {
            setShipmentOpen(false);
            alert(
              `Shipment sent (mock)\nTracking: ${payload.tracking}\nCarrier: ${payload.carrier}`
            );
          }}
        />
      )}

      {invoiceOpen && (
        <InvoiceModal
          onCancel={() => setInvoiceOpen(false)}
          onSend={(payload) => {
            setInvoiceOpen(false);
            alert(
              `Invoice sent (mock)\nAmount: ${payload.amount}\nDue: ${payload.dueDate}`
            );
          }}
        />
      )}
    </div>
  );
}

function IconBtn({ children, ariaLabel, onClick }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-xs transition-colors hover:bg-canvas"
    >
      {children}
    </button>
  );
}

/* ──────────── Shipment modal ──────────── */

function ShipmentModal({ onCancel, onSend }) {
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier] = useState(CARRIERS[0]);
  const [notes, setNotes] = useState("");

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] rounded-md border border-line bg-white p-6 shadow-card"
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
              <Package size={18} strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-ink-heading">
                Send Shipment
              </h3>
              <p className="text-[12px] text-ink-muted">
                Share tracking details with the customer
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-md p-1.5 text-ink-muted hover:bg-canvas"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <Field label="Tracking number">
            <input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. 1Z999AA10123456784"
              className="h-9 w-full rounded-[6px] border border-line bg-white px-3 text-[13px] text-ink-heading placeholder:text-ink-muted focus:outline-none focus-visible:shadow-focus"
            />
          </Field>
          <Field label="Carrier">
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="h-9 w-full rounded-[6px] border border-line bg-white px-3 text-[13px] text-ink-heading focus:outline-none focus-visible:shadow-focus"
            >
              {CARRIERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Notes">
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional message..."
              className="w-full resize-none rounded-[6px] border border-line bg-white px-3 py-2 text-[13px] text-ink-heading placeholder:text-ink-muted focus:outline-none focus-visible:shadow-focus"
            />
          </Field>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[12px] font-medium text-ink-body"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSend({ tracking, carrier, notes })}
            className="inline-flex h-10 items-center gap-1.5 rounded-button bg-cta-gradient px-5 text-[12px] font-semibold text-white"
          >
            <Send size={12} strokeWidth={2} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Invoice modal ──────────── */

function InvoiceModal({ onCancel, onSend }) {
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState("");
  const [dueDate, setDueDate] = useState("");

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] rounded-md border border-line bg-white p-6 shadow-card"
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 text-amber-600">
              <Receipt size={18} strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-ink-heading">
                Send Invoice
              </h3>
              <p className="text-[12px] text-ink-muted">
                Send a payment request to this contact
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-md p-1.5 text-ink-muted hover:bg-canvas"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <Field label="Amount">
            <div className="flex h-9 items-center gap-2 rounded-[6px] border border-line bg-white px-3 focus-within:shadow-focus">
              <span className="text-[13px] font-semibold text-ink-muted">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-ink-heading placeholder:text-ink-muted focus:outline-none"
              />
            </div>
          </Field>
          <Field label="Items">
            <textarea
              rows={3}
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="e.g. 1x Premium plan, 2x Add-on..."
              className="w-full resize-none rounded-[6px] border border-line bg-white px-3 py-2 text-[13px] text-ink-heading placeholder:text-ink-muted focus:outline-none focus-visible:shadow-focus"
            />
          </Field>
          <Field label="Due date">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-9 w-full rounded-[6px] border border-line bg-white px-3 text-[13px] text-ink-heading focus:outline-none focus-visible:shadow-focus"
            />
          </Field>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center rounded-button border border-line bg-white px-4 text-[12px] font-medium text-ink-body"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSend({ amount, items, dueDate })}
            className="inline-flex h-10 items-center gap-1.5 rounded-button bg-cta-gradient px-5 text-[12px] font-semibold text-white"
          >
            <Send size={12} strokeWidth={2} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

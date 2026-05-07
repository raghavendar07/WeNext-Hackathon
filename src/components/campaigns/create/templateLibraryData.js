/**
 * Mock approved templates as returned by Meta Graph API
 *   GET /{whatsapp-business-account-id}/message_templates
 *
 * In production this is fetched + cached client-side for 5 minutes,
 * with cursor-based pagination for accounts > 25 templates.
 */
export const META_TEMPLATES = [
  {
    id: "wamtpl_001",
    name: "diwali_offer_2026",
    language: "en_US",
    category: "MARKETING",
    status: "APPROVED",
    quality_score: { score: "GREEN" },
    created_time: "2026-04-12T08:14:00Z",
    last_used_at: "2026-05-03T11:02:00Z",
    components: [
      { type: "HEADER", format: "IMAGE" },
      { type: "BODY",   text: "Hi {{1}}, Diwali is around the corner! Light up your home with {{2}} off our festive collection. Use code {{3}} at checkout. Valid until {{4}}." },
      { type: "FOOTER", text: "WeNext Retail · Delhi" },
      { type: "BUTTONS", buttons: [
        { type: "URL",         text: "Shop the Sale", url: "https://wenext.shop/diwali" },
        { type: "QUICK_REPLY", text: "Remind me later" },
      ]},
    ],
  },
  {
    id: "wamtpl_002",
    name: "order_shipped_v3",
    language: "en_US",
    category: "UTILITY",
    status: "APPROVED",
    quality_score: { score: "GREEN" },
    created_time: "2026-03-22T10:00:00Z",
    last_used_at: "2026-05-04T19:11:00Z",
    components: [
      { type: "HEADER", format: "TEXT", text: "Your order is on the way" },
      { type: "BODY",   text: "Hi {{1}}, your order #{{2}} has shipped via {{3}}. Track it any time using the link below. Estimated delivery: {{4}}." },
      { type: "BUTTONS", buttons: [
        { type: "URL", text: "Track shipment", url: "https://wenext.shop/track/{{1}}" },
      ]},
    ],
  },
  {
    id: "wamtpl_003",
    name: "otp_login",
    language: "en_US",
    category: "AUTHENTICATION",
    status: "APPROVED",
    quality_score: { score: "GREEN" },
    created_time: "2026-01-08T09:00:00Z",
    last_used_at: "2026-05-05T20:40:00Z",
    components: [
      { type: "BODY",   text: "{{1}} is your verification code. For your security, do not share this code." },
      { type: "FOOTER", text: "This code expires in 10 minutes." },
      { type: "BUTTONS", buttons: [
        { type: "QUICK_REPLY", text: "Copy code" },
      ]},
    ],
  },
  {
    id: "wamtpl_004",
    name: "winback_30d",
    language: "en_US",
    category: "MARKETING",
    status: "APPROVED",
    quality_score: { score: "YELLOW" },
    created_time: "2026-02-14T11:23:00Z",
    last_used_at: "2026-04-18T14:00:00Z",
    components: [
      { type: "HEADER", format: "TEXT", text: "We miss you, {{1}}" },
      { type: "BODY",   text: "It has been a minute since your last visit. Here is a {{2}} welcome-back voucher to make it easier to come home. Tap below to redeem." },
      { type: "BUTTONS", buttons: [
        { type: "URL", text: "Redeem now", url: "https://wenext.shop/welcome-back" },
      ]},
    ],
  },
  {
    id: "wamtpl_005",
    name: "appointment_reminder_24h",
    language: "en_US",
    category: "UTILITY",
    status: "APPROVED",
    quality_score: { score: "GREEN" },
    created_time: "2026-03-01T07:45:00Z",
    last_used_at: "2026-05-05T08:00:00Z",
    components: [
      { type: "BODY",   text: "Hi {{1}}, this is a reminder for your appointment with {{2}} tomorrow at {{3}}. Reply CANCEL to release your slot." },
      { type: "BUTTONS", buttons: [
        { type: "QUICK_REPLY", text: "Confirm" },
        { type: "QUICK_REPLY", text: "Reschedule" },
      ]},
    ],
  },
  {
    id: "wamtpl_006",
    name: "new_arrivals_weekly",
    language: "en_US",
    category: "MARKETING",
    status: "APPROVED",
    quality_score: { score: "GREEN" },
    created_time: "2026-04-29T10:10:00Z",
    last_used_at: "2026-05-05T09:30:00Z",
    components: [
      { type: "HEADER", format: "IMAGE" },
      { type: "BODY",   text: "Fresh in this week, {{1}}. Hand-picked styles in your size, ready to ship. Take a look before they're gone." },
      { type: "FOOTER", text: "Reply STOP to opt out" },
      { type: "BUTTONS", buttons: [
        { type: "URL", text: "Browse new in", url: "https://wenext.shop/new" },
      ]},
    ],
  },
  {
    id: "wamtpl_007",
    name: "payment_receipt",
    language: "en_US",
    category: "UTILITY",
    status: "APPROVED",
    quality_score: { score: "GREEN" },
    created_time: "2026-02-02T12:00:00Z",
    last_used_at: "2026-05-04T16:22:00Z",
    components: [
      { type: "HEADER", format: "DOCUMENT" },
      { type: "BODY",   text: "Hi {{1}}, here is your receipt for ₹{{2}} paid on {{3}}. Keep this for your records." },
    ],
  },
  {
    id: "wamtpl_008",
    name: "abandoned_cart",
    language: "en_US",
    category: "MARKETING",
    status: "APPROVED",
    quality_score: { score: "YELLOW" },
    created_time: "2026-03-15T13:30:00Z",
    last_used_at: "2026-05-02T10:11:00Z",
    components: [
      { type: "HEADER", format: "IMAGE" },
      { type: "BODY",   text: "{{1}}, you left {{2}} in your cart. We held it for you — finish checking out before someone else grabs it." },
      { type: "BUTTONS", buttons: [
        { type: "URL",         text: "Resume checkout", url: "https://wenext.shop/cart" },
        { type: "QUICK_REPLY", text: "Not interested" },
      ]},
    ],
  },
  {
    id: "wamtpl_009",
    name: "support_followup",
    language: "en_US",
    category: "UTILITY",
    status: "APPROVED",
    quality_score: { score: "GREEN" },
    created_time: "2026-01-28T15:05:00Z",
    last_used_at: "2026-05-05T17:49:00Z",
    components: [
      { type: "BODY",   text: "Hi {{1}}, just checking in on ticket #{{2}}. Was your issue resolved? Tap below so we can close it out." },
      { type: "BUTTONS", buttons: [
        { type: "QUICK_REPLY", text: "Yes, all good" },
        { type: "QUICK_REPLY", text: "I still need help" },
      ]},
    ],
  },
  {
    id: "wamtpl_010",
    name: "two_factor_setup",
    language: "en_US",
    category: "AUTHENTICATION",
    status: "APPROVED",
    quality_score: { score: "GREEN" },
    created_time: "2026-02-19T09:30:00Z",
    last_used_at: "2026-04-30T09:01:00Z",
    components: [
      { type: "BODY",   text: "Use code {{1}} to enable two-factor authentication on your account. Do not share this code with anyone." },
    ],
  },
  {
    id: "wamtpl_011",
    name: "review_request_post_purchase",
    language: "en_US",
    category: "MARKETING",
    status: "APPROVED",
    quality_score: { score: "GREEN" },
    created_time: "2026-04-05T14:20:00Z",
    last_used_at: "2026-05-04T12:00:00Z",
    components: [
      { type: "BODY",   text: "Hi {{1}}, hope you are loving the {{2}}. We would really appreciate a quick review — it helps other shoppers and makes our day." },
      { type: "BUTTONS", buttons: [
        { type: "URL", text: "Leave a review", url: "https://wenext.shop/review/{{2}}" },
      ]},
    ],
  },
  {
    id: "wamtpl_012",
    name: "low_stock_alert_subscriber",
    language: "en_US",
    category: "UTILITY",
    status: "APPROVED",
    quality_score: { score: "YELLOW" },
    created_time: "2026-03-30T16:10:00Z",
    last_used_at: "2026-05-01T13:33:00Z",
    components: [
      { type: "HEADER", format: "IMAGE" },
      { type: "BODY",   text: "Heads up, {{1}} — {{2}} is running low. Only a few left in your size. Lock it in before it sells out." },
      { type: "BUTTONS", buttons: [
        { type: "URL", text: "Buy now", url: "https://wenext.shop/p/{{2}}" },
      ]},
    ],
  },
];

const QUALITY_LABEL = {
  GREEN:  { label: "High",   tone: "text-success", dot: "bg-success" },
  YELLOW: { label: "Medium", tone: "text-warning", dot: "bg-warning" },
  RED:    { label: "Low",    tone: "text-danger",  dot: "bg-danger" },
};

const CATEGORY_BADGE = {
  MARKETING:      { label: "Marketing",      classes: "bg-[#F5F0FF] text-[#6D28D9] border-[#E0CFFF]" },
  UTILITY:        { label: "Utility",        classes: "bg-[#FFE9F2] text-[#BE185D] border-[#FBCFE0]" },
  AUTHENTICATION: { label: "Authentication", classes: "bg-[#E6F1FF] text-[#1D4ED8] border-[#BFDBFE]" },
};

const LANGUAGE_LABEL = {
  en_US: "English",
  hi_IN: "Hindi",
  te_IN: "Telugu",
  ta_IN: "Tamil",
  gu_IN: "Gujarati",
};

const HEADER_LABEL = {
  TEXT:     "Text",
  IMAGE:    "Image",
  VIDEO:    "Video",
  DOCUMENT: "Document",
};

export function categoryBadgeFor(category) {
  return CATEGORY_BADGE[category] ?? CATEGORY_BADGE.MARKETING;
}

export function qualityLabelFor(score) {
  return QUALITY_LABEL[score];
}

export function languageLabel(code) {
  return LANGUAGE_LABEL[code] ?? code;
}

export function headerLabel(format) {
  return HEADER_LABEL[format] ?? "None";
}

export function deriveTemplateInfo(template) {
  const components = template.components ?? [];
  const header = components.find((c) => c.type === "HEADER") ?? null;
  const body = components.find((c) => c.type === "BODY") ?? { text: "" };
  const footer = components.find((c) => c.type === "FOOTER") ?? null;
  const buttonsComponent = components.find((c) => c.type === "BUTTONS");
  const buttons = buttonsComponent?.buttons ?? [];

  const variables = [];
  const re = /\{\{\s*([^}]+?)\s*\}\}/g;
  let m;
  while ((m = re.exec(body.text)) !== null) {
    if (!variables.includes(m[1])) variables.push(m[1]);
  }

  return { header, body, footer, buttons, variables };
}

export function metaLineFor(template) {
  const info = deriveTemplateInfo(template);
  const parts = [languageLabel(template.language)];
  if (info.variables.length > 0) {
    parts.push(`${info.variables.length} variable${info.variables.length === 1 ? "" : "s"}`);
  }
  if (info.buttons.length > 0) {
    parts.push(`${info.buttons.length} button${info.buttons.length === 1 ? "" : "s"}`);
  }
  return parts.join(" • ");
}

export function formatCreatedDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelative(iso) {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const day = 86400000;
  if (diffMs < day) return "Today";
  const days = Math.round(diffMs / day);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 30) return `${Math.round(days / 7)} week${Math.round(days / 7) === 1 ? "" : "s"} ago`;
  return `${Math.round(days / 30)} mo ago`;
}

/**
 * Render a body with `{{N}}` swapped for a friendly placeholder so the
 * preview reads as a real message, not a raw template.
 */
const PLACEHOLDER_LABELS = ["Customer Name", "Order ID", "Product", "Date", "Code", "Amount"];

export function readableBody(text) {
  return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, idx) => {
    const i = Number(idx) - 1;
    const label = Number.isFinite(i) && i >= 0 && i < PLACEHOLDER_LABELS.length
      ? PLACEHOLDER_LABELS[i]
      : `Variable ${idx}`;
    return `[${label}]`;
  });
}

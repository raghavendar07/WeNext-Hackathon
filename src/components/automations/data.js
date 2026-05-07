export const NODE_KINDS = {
  trigger: { label: "TRIGGER", tone: "border-brand-emerald bg-white", pillBg: "bg-brand-50",     pillText: "text-brand-emerald" },
  action:  { label: "ACTION",  tone: "border-line bg-white",          pillBg: "bg-surface-muted", pillText: "text-ink-muted" },
  wait:    { label: "WAIT",    tone: "border-line bg-surface-subtle", pillBg: "bg-warning-bg",    pillText: "text-warning" },
  branch:  { label: "IF",      tone: "border-line bg-white",          pillBg: "bg-info-bg",       pillText: "text-info" },
  goal:    { label: "GOAL",    tone: "border-dashed border-brand-emerald bg-brand-50/30", pillBg: "bg-brand-50", pillText: "text-brand-emerald" },
};

// Tone palette per spec — 28×28 colored icon squares.
const T = {
  orange: "bg-[#FB923C] text-white",
  amber:  "bg-[#F59E0B] text-white",
  pink:   "bg-[#EC4899] text-white",
  rose:   "bg-[#F43F5E] text-white",
  cyan:   "bg-[#06B6D4] text-white",
  green:  "bg-[#1EB677] text-white",
  blue:   "bg-[#3B82F6] text-white",
  red:    "bg-[#EF4444] text-white",
  purple: "bg-[#873EFF] text-white",
  indigo: "bg-[#6366F1] text-white",
  slate:  "bg-[#94A3B8] text-white",
};

export const TRIGGERS = [
  { id: "starting_step",   icon: "🚀", label: "Starting Step",            hint: "Flow entry point",                  tone: T.orange },
  { id: "cron",            icon: "⏲️", label: "Cron Trigger",             hint: "Recurring schedule (cron)",         tone: T.amber },
  { id: "webhook",         icon: "🪝", label: "Webhook Trigger",          hint: "External API trigger",              tone: T.pink },
  { id: "campaign_button", icon: "👆", label: "Campaign Button Trigger",  hint: "Triggered by campaign button click", tone: T.rose },
  { id: "sheet_trigger",   icon: "📊", label: "Google Sheet Trigger",     hint: "Trigger on new row",                 tone: T.green },
  { id: "order_created",   icon: "🛍️", label: "Order Created",            hint: "Trigger on new order",               tone: T.green },
  { id: "order_updated",   icon: "🔄", label: "Order Updated",            hint: "Trigger on updated order",           tone: T.green },
  { id: "cart_abandoned",  icon: "🛒", label: "Abandoned Cart",           hint: "Trigger on abandoned cart",          tone: T.orange },
  { id: "new_subscriber",  icon: "🆕", label: "New Subscriber",            hint: "Trigger on new customer",            tone: T.cyan },
  { id: "order_shipped",   icon: "🚚", label: "Order Shipped",            hint: "Trigger when order ships",           tone: T.green },
  { id: "out_for_delivery",icon: "🧭", label: "Out for Delivery",         hint: "Trigger when order is out",          tone: T.green },
  { id: "order_delivered", icon: "📦", label: "Order Delivered",          hint: "Trigger when delivered",             tone: T.green },
  { id: "order_paid",      icon: "💳", label: "Order Paid",               hint: "Trigger when paid",                  tone: T.green },
  { id: "order_cancelled", icon: "❌", label: "Order Cancelled",          hint: "Trigger when cancelled",             tone: T.red },
  { id: "refund_created",  icon: "↩️", label: "Refund Created",           hint: "Trigger when refund created",        tone: T.amber },
  { id: "wa_received",     icon: "💬", label: "WhatsApp Order Received",  hint: "Trigger via WhatsApp",               tone: T.green },
  { id: "petpooja_event",  icon: "🍽️", label: "PetPooja Order Event",     hint: "Trigger on PetPooja order status",   tone: T.pink },
  // Keep these for backwards-compat with seed automations + previous specs
  { id: "form_submit",     icon: "📝", label: "Form submitted",           hint: "When someone fills a form",          tone: T.blue, deprecated: true },
  { id: "wa_keyword",      icon: "💬", label: "WhatsApp keyword",          hint: "When a contact messages a word",     tone: T.green, deprecated: true },
  { id: "date_based",      icon: "📅", label: "Date-based",                hint: "Birthday, anniversary, X-after-Y",   tone: T.purple, deprecated: true },
  { id: "manual",          icon: "✋", label: "Manual",                    hint: "Manual run from contact page",       tone: T.slate, deprecated: true },
  { id: "contact_added",   icon: "👤", label: "New contact",               hint: "Added to contacts",                  tone: T.indigo, deprecated: true },
];

export const MESSAGING = [
  { id: "send_message",   icon: "💬", label: "Send Message",     hint: "Send text message",          tone: T.green },
  { id: "send_wa",        icon: "📨", label: "Send Template",    hint: "Send ISM template",          tone: T.green },
  { id: "send_image",     icon: "🖼️", label: "Send Image",       hint: "Send image message",         tone: T.blue },
  { id: "send_video",     icon: "🎬", label: "Send Video",       hint: "Send video message",         tone: T.red },
  { id: "send_audio",     icon: "🎙️", label: "Send Audio",       hint: "Send audio message",         tone: T.purple },
  { id: "send_document",  icon: "📄", label: "Send Document",    hint: "Send document",              tone: T.slate },
  { id: "send_list",      icon: "📋", label: "Send List",        hint: "Send WhatsApp list message", tone: T.green },
  { id: "wa_flow",        icon: "🧩", label: "WhatsApp Flow",    hint: "Send interactive flow form", tone: T.green },
  { id: "send_product",   icon: "📦", label: "Send Product",     hint: "Send single product",        tone: T.orange },
  { id: "send_products",  icon: "🛍️", label: "Send Products",    hint: "Send product catalog",       tone: T.orange },
  { id: "ai_agent",       icon: "✨", label: "AI Agent",          hint: "Route to AI Agent",          tone: T.purple },
];

export const USER_INPUT = [
  { id: "user_input",       icon: "⌨️", label: "User Input",       hint: "Collect user input",   tone: T.purple },
  { id: "multiple_choice",  icon: "☑️", label: "Multiple Choice",  hint: "Present options",      tone: T.purple },
  { id: "address",          icon: "📍", label: "Address",          hint: "Request user address", tone: T.orange },
];

export const OPERATIONS = [
  { id: "send_email",         icon: "📧", label: "Send Email",          hint: "Send email notification",                tone: T.blue },
  { id: "collect_payment",    icon: "💰", label: "Collect Payment",     hint: "Collect payment via Razorpay",           tone: T.green },
  { id: "generate_invoice",   icon: "🧾", label: "Generate Invoice",    hint: "Auto-generate invoice from order",       tone: T.blue },
  { id: "petpooja_menu",      icon: "📖", label: "PetPooja Menu",       hint: "Fetch menu items from PetPooja",         tone: T.pink },
  { id: "petpooja_collect",   icon: "🛍️", label: "PetPooja Collect Order", hint: "Collect addons, order type, delivery", tone: T.pink },
  { id: "petpooja_submit",    icon: "📤", label: "PetPooja Order",      hint: "Submit order to PetPooja restaurant",    tone: T.pink },
  { id: "set_stage",          icon: "🎯", label: "Set Stage",           hint: "Update Kanban board stage",              tone: T.green },
  { id: "sheet_get",          icon: "📥", label: "Get Sheet Records",   hint: "Get records from Google Sheet",          tone: T.green },
  { id: "sheet_add",          icon: "➕", label: "Add Sheet Record",    hint: "Add row to Google Sheet",                tone: T.green },
  { id: "sheet_update",       icon: "✏️", label: "Update Sheet Record", hint: "Update row in Google Sheet",             tone: T.green },
  { id: "sheet_delete",       icon: "🗑️", label: "Delete Sheet Record", hint: "Delete row from Google Sheet",           tone: T.red },
  { id: "get_slots",          icon: "🗓️", label: "Get Slots",            hint: "Fetch available time slots",             tone: T.blue },
  { id: "book_appointment",   icon: "📅", label: "Book Appointment",    hint: "Book a selected time slot",              tone: T.green },
  { id: "get_bookings",       icon: "🔍", label: "Get Bookings",        hint: "Fetch existing bookings",                tone: T.blue },
  { id: "cancel_appointment", icon: "❎", label: "Cancel Appointment",  hint: "Cancel an existing booking",             tone: T.red },
  { id: "reschedule_appointment", icon: "🔁", label: "Reschedule Appointment", hint: "Move booking to a new time",       tone: T.amber },
];

// Backwards-compat actions referenced by older flow seeds.
export const LEGACY_ACTIONS = [
  { id: "add_tag",      icon: "🏷️", label: "Add tag",               hint: "Tag the contact",                  tone: T.amber, deprecated: true },
  { id: "remove_tag",   icon: "🏷️", label: "Remove tag",            hint: "Untag the contact",                tone: T.amber, deprecated: true },
  { id: "change_stage", icon: "👥", label: "Change lead stage",     hint: "Move to different CRM stage",      tone: T.indigo, deprecated: true },
  { id: "update_field", icon: "📊", label: "Update contact field",  hint: "Set a field value",                tone: T.indigo, deprecated: true },
];

// All actions (visible MESSAGING + USER_INPUT + OPERATIONS + legacy) so
// the rest of the app keeps working when looking up by id.
export const ACTIONS = [...MESSAGING, ...USER_INPUT, ...OPERATIONS, ...LEGACY_ACTIONS];

export const LOGIC = [
  { id: "branch",       icon: "🔀", label: "Condition",     hint: "Branch based on conditions",       tone: T.slate },
  { id: "set_variable", icon: "𝕍",  label: "Set Variable",  hint: "Store or transform values",        tone: T.slate },
  { id: "http_request", icon: "🌐", label: "HTTP Request",  hint: "Call external API",                tone: T.slate },
  { id: "set_tag",      icon: "🏷️", label: "Set Tag",       hint: "Add or remove tags",               tone: T.amber },
  { id: "wait",         icon: "⏱️", label: "Wait",          hint: "Pause the flow",                   tone: T.slate },
  { id: "goal",         icon: "🎯", label: "Goal",          hint: "Mark as completed",                tone: T.green },
];

// Visible left-rail sections (in render order). Hidden deprecated items
// stay in TRIGGERS/ACTIONS for lookup but are filtered out of the palette.
export const PALETTE_SECTIONS = [
  { id: "triggers",   label: "Triggers",         hint: "Start a flow",            kind: "trigger", items: TRIGGERS.filter((t) => !t.deprecated) },
  { id: "messaging",  label: "Messaging",        hint: "Send messages",            kind: "action",  items: MESSAGING },
  { id: "user_input", label: "User Input",       hint: "Collect from user",       kind: "action",  items: USER_INPUT },
  { id: "operations", label: "Operations",       hint: "Take actions",             kind: "action",  items: OPERATIONS },
  { id: "logic",      label: "Logic & Control",  hint: "Control flow",             kind: "logic",   items: LOGIC },
];

// Helper: resolve kind for a logic item when adding to canvas.
export function kindForLogicId(id) {
  if (id === "wait") return "wait";
  if (id === "branch") return "branch";
  if (id === "goal") return "goal";
  return "action"; // set_variable / http_request / set_tag render as actions
}

const node = (kind, type, props = {}) => ({ id: `n-${Math.random().toString(36).slice(2, 8)}`, kind, type, ...props });

// Three example flow scaffolds for empty state. NOT templates — just starting structures.
export const EXAMPLE_FLOWS = [
  {
    id: "ex-welcome",
    name: "Welcome a new lead",
    icon: "👋",
    iconTone: { bg: "bg-brand-50", text: "text-brand-emerald" },
    caption: "When a new lead signs up · send WhatsApp welcome · tag as 'New lead'",
    chips: [
      { kind: "trigger", icon: "📝", label: "Form submitted" },
      { kind: "action",  icon: "💬", label: "Send WhatsApp" },
      { kind: "action",  icon: "🏷️", label: "Add tag" },
    ],
    flow: [
      node("trigger", "form_submit", { formName: "Contact form" }),
      node("action",  "send_wa",     { template: "Welcome — Hi {{first_name}}, thanks for reaching out!" }),
      node("action",  "add_tag",     { tags: ["New lead"] }),
    ],
  },
  {
    id: "ex-cart",
    name: "Recover an abandoned cart",
    icon: "🛒",
    iconTone: { bg: "bg-warning-bg", text: "text-warning" },
    caption: "When someone abandons cart · wait 30 minutes · send WhatsApp reminder",
    chips: [
      { kind: "trigger", icon: "🛒", label: "Cart abandoned" },
      { kind: "wait",    icon: "⏱️", label: "Wait 30 min" },
      { kind: "action",  icon: "💬", label: "Send WhatsApp" },
    ],
    flow: [
      node("trigger", "cart_abandoned", { afterMinutes: 30 }),
      node("wait",    "wait",            { value: 30, unit: "minutes" }),
      node("action",  "send_wa",         { template: "Still thinking it over? Tap to checkout." }),
    ],
  },
  {
    id: "ex-bday",
    name: "Birthday wishes",
    icon: "🎂",
    iconTone: { bg: "bg-brand-50", text: "text-brand-emerald" },
    caption: "On customer's birthday · send WhatsApp + 10% off code",
    chips: [
      { kind: "trigger", icon: "📅", label: "Birthday" },
      { kind: "action",  icon: "💬", label: "Send WhatsApp" },
    ],
    flow: [
      node("trigger", "date_based", { dateField: "birthday", offsetDays: 0 }),
      node("action",  "send_wa",    { template: "Happy birthday {{first_name}}! Use BDAY10 for 10% off." }),
    ],
  },
];

export const AUTOMATIONS = [
  {
    id: "a1",
    name: "Welcome new leads",
    icon: "📝",
    description: "When someone fills out the contact form, send a WhatsApp welcome and tag as 'New lead'.",
    status: "active",
    triggerType: "form_submit",
    triggerLabel: "Form submitted",
    triggerSub: "Contact form on homepage",
    stepsCount: 3,
    runsThisMonth: 247,
    successRate: 92,
    inProgress: 18,
    completed: 226,
    errors: 3,
    series: [12, 28, 41, 67, 102, 148, 198, 247],
    flow: [
      { id: "f1", kind: "trigger", type: "form_submit",  title: "Form submitted",       sub: "Contact form on homepage", count: 247 },
      { id: "f2", kind: "wait",    type: "wait",         title: "Wait 5 minutes",        count: 245 },
      { id: "f3", kind: "action",  type: "send_wa",      title: "Send WhatsApp: Welcome", sub: "Hi {{first_name}}, thanks for reaching out!", count: 243, secondaryStat: "89% delivered · 67% read" },
      { id: "f4", kind: "branch",  type: "branch",       title: "Did they reply within 24h?", branches: [{ label: "Yes", count: 180 }, { label: "No", count: 63 }] },
      { id: "f5", kind: "action",  type: "add_tag",      title: "Add tag: Engaged",       count: 180 },
      { id: "f6", kind: "action",  type: "send_wa",      title: "Send WhatsApp: Follow-up", sub: "Just checking in — any questions?", count: 61, secondaryStat: "78% read" },
      { id: "f7", kind: "goal",    type: "goal",         title: "Goal: Engaged",          count: 12 },
    ],
    insights: [
      "Your message at step 3 has a 67% reply rate — high engagement.",
      "8% of contacts drop off at the 24h wait — consider shortening.",
      "Contacts triggered after 6 PM convert 23% better than during the day.",
    ],
  },
  {
    id: "a2",
    name: "Recover abandoned carts",
    icon: "🛒",
    description: "Send a WhatsApp reminder 30 minutes after a customer abandons their cart.",
    status: "active",
    triggerType: "cart_abandoned",
    triggerLabel: "Cart abandoned",
    triggerSub: "Shopify storefront",
    stepsCount: 2,
    runsThisMonth: 412,
    successRate: 88,
    inProgress: 24,
    completed: 360,
    errors: 12,
    series: [22, 56, 92, 140, 188, 240, 320, 412],
    flow: [
      { id: "f1", kind: "trigger", type: "cart_abandoned", title: "Cart abandoned", count: 412 },
      { id: "f2", kind: "wait",    type: "wait",            title: "Wait 30 minutes", count: 408 },
      { id: "f3", kind: "action",  type: "send_wa",         title: "Send WhatsApp: Reminder", sub: "Still thinking it over?", count: 401, secondaryStat: "82% delivered" },
    ],
    insights: ["30-min wait works — 28% of contacts return to checkout."],
  },
  {
    id: "a3",
    name: "Birthday wishes",
    icon: "🎂",
    description: "On contact's birthday, send a WhatsApp greeting and 10% off code.",
    status: "active",
    triggerType: "date_based",
    triggerLabel: "Date-based",
    triggerSub: "Birthday",
    stepsCount: 1,
    runsThisMonth: 84,
    successRate: 96,
    inProgress: 0,
    completed: 81,
    errors: 0,
    series: [4, 8, 14, 22, 38, 52, 70, 84],
    flow: [
      { id: "f1", kind: "trigger", type: "date_based", title: "Birthday", count: 84 },
      { id: "f2", kind: "action",  type: "send_wa",    title: "Send WhatsApp: Birthday greeting", sub: "Happy birthday {{first_name}}!", count: 84, secondaryStat: "96% delivered" },
    ],
    insights: [],
  },
  {
    id: "a4",
    name: "FAQ keyword responder",
    icon: "💬",
    description: "Auto-reply with shipping info when a contact messages 'shipping'.",
    status: "paused",
    triggerType: "wa_keyword",
    triggerLabel: "WhatsApp keyword",
    triggerSub: "'shipping'",
    stepsCount: 2,
    runsThisMonth: 0,
    successRate: 0,
    inProgress: 0,
    completed: 0,
    errors: 0,
    series: [],
    flow: [
      { id: "f1", kind: "trigger", type: "wa_keyword", title: "Keyword: shipping", count: 0 },
      { id: "f2", kind: "action",  type: "send_wa",    title: "Send WhatsApp: Shipping info",   sub: "Orders ship within 2-3 business days.", count: 0 },
    ],
    insights: [],
  },
  {
    id: "a5",
    name: "Lead-magnet welcome",
    icon: "📝",
    description: "When form submitted, send PDF link via WhatsApp and tag as 'Downloaded magnet'.",
    status: "error",
    triggerType: "form_submit",
    triggerLabel: "Form submitted",
    triggerSub: "Free guide form",
    stepsCount: 2,
    runsThisMonth: 18,
    successRate: 22,
    inProgress: 0,
    completed: 4,
    errors: 14,
    series: [2, 5, 8, 11, 13, 14, 16, 18],
    flow: [],
    errorReason: "WhatsApp template rejected by Meta",
    insights: [],
  },
  {
    id: "a6",
    name: "Quote follow-up",
    icon: "📝",
    description: "Reminder WhatsApp 2 days after a tag 'Quote sent' is added.",
    status: "draft",
    triggerType: "manual",
    triggerLabel: "Manual",
    triggerSub: "From contact actions menu",
    stepsCount: 2,
    runsThisMonth: 0,
    successRate: 0,
    inProgress: 0,
    completed: 0,
    errors: 0,
    series: [],
    flow: [],
    insights: [],
  },
];

export const STATUS_PILLS = {
  active: { label: "Active",          dot: "bg-success",      bg: "bg-success-bg",      text: "text-success" },
  paused: { label: "Paused",          dot: "bg-ink-subtle",   bg: "bg-surface-muted",   text: "text-ink-muted" },
  draft:  { label: "Draft",           dot: "bg-ink-subtle",   bg: "bg-surface-muted",   text: "text-ink-muted" },
  error:  { label: "Needs attention", dot: "bg-danger",       bg: "bg-danger-bg",       text: "text-danger" },
};

export function statusOf(a) {
  return STATUS_PILLS[a.status] ?? STATUS_PILLS.draft;
}

export function findExampleById(id) {
  return EXAMPLE_FLOWS.find((t) => t.id === id) ?? null;
}

export function findAutomationById(id) {
  return AUTOMATIONS.find((a) => a.id === id) ?? null;
}

export function findTriggerById(id) {
  return TRIGGERS.find((t) => t.id === id) ?? null;
}

export function totalContactsInActive(automations) {
  return automations.filter((a) => a.status === "active").reduce((s, a) => s + a.inProgress + a.completed, 0);
}

export function totalMessagesThisMonth(automations) {
  return automations.reduce((s, a) => s + Math.round(a.runsThisMonth * 0.95), 0);
}

export function totalRunsThisMonth(automations) {
  return automations.reduce((s, a) => s + a.runsThisMonth, 0);
}

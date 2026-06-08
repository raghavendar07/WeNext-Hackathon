export const ORDER_STATUSES = [
  { id: "all",        label: "All" },
  { id: "new",        label: "New" },
  { id: "processing", label: "Processing" },
  { id: "shipped",    label: "Shipped" },
  { id: "delivered",  label: "Delivered" },
  { id: "abandoned",  label: "Abandoned" },
  { id: "cancelled",  label: "Cancelled" },
  { id: "refunded",   label: "Refunded" },
];

export const ORDER_STATUS_PILLS = {
  new:        { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500",   label: "New" },
  processing: { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500",  label: "Processing" },
  shipped:    { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500", label: "Shipped" },
  delivered:  { bg: "bg-brand-50",  text: "text-brand-700",  dot: "bg-brand-500",  label: "Delivered" },
  abandoned:  { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500",  label: "Abandoned" },
  cancelled:  { bg: "bg-gray-100",  text: "text-gray-600",   dot: "bg-gray-400",   label: "Cancelled" },
  refunded:   { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500",    label: "Refunded" },
};

export const ORDERS = [
  { id: "ORD-1042", customer: "Aanya Sharma",   total: 2450, status: "new",        date: "2026-05-06", items: 2, channel: "WhatsApp" },
  { id: "ORD-1041", customer: "Rohit Verma",    total: 6890, status: "processing", date: "2026-05-06", items: 4, channel: "Instagram" },
  { id: "ORD-1040", customer: "Kavya Iyer",     total: 1200, status: "shipped",    date: "2026-05-05", items: 1, channel: "WhatsApp" },
  { id: "ORD-1039", customer: "Manish Gupta",   total: 4350, status: "delivered",  date: "2026-05-04", items: 3, channel: "Web" },
  { id: "ORD-1038", customer: "Sneha Pillai",   total: 1850, status: "delivered",  date: "2026-05-04", items: 2, channel: "WhatsApp" },
  { id: "ORD-1037", customer: "Karan Malhotra", total: 3200, status: "abandoned",  date: "2026-05-03", items: 2, channel: "Web" },
  { id: "ORD-1036", customer: "Pooja Reddy",    total: 990,  status: "abandoned",  date: "2026-05-03", items: 1, channel: "WhatsApp" },
  { id: "ORD-1035", customer: "Rahul Saxena",   total: 5400, status: "abandoned",  date: "2026-05-02", items: 3, channel: "Instagram" },
  { id: "ORD-1034", customer: "Divya Menon",    total: 2200, status: "cancelled",  date: "2026-05-02", items: 2, channel: "WhatsApp" },
  { id: "ORD-1033", customer: "Aditya Kapoor",  total: 7500, status: "refunded",   date: "2026-05-01", items: 5, channel: "Web",       refundAmount: 7500, refundDate: "2026-05-03", refundReason: "Damaged on arrival" },
  { id: "ORD-1032", customer: "Neha Joshi",     total: 1650, status: "delivered",  date: "2026-05-01", items: 1, channel: "WhatsApp" },
  { id: "ORD-1031", customer: "Vikram Singh",   total: 3850, status: "shipped",    date: "2026-04-30", items: 3, channel: "Web" },
  { id: "ORD-1030", customer: "Riya Bhatt",     total: 2150, status: "abandoned",  date: "2026-04-30", items: 2, channel: "WhatsApp" },
  { id: "ORD-1029", customer: "Arjun Nair",     total: 4750, status: "abandoned",  date: "2026-04-29", items: 3, channel: "Instagram" },
  { id: "ORD-1024", customer: "Tanya Reddy",    total: 1290, status: "refunded",   date: "2026-04-22", items: 1, channel: "WhatsApp", refundAmount: 1290, refundDate: "2026-04-25", refundReason: "Wrong size" },
  { id: "ORD-1018", customer: "Mohan Krishnan", total: 2890, status: "refunded",   date: "2026-04-15", items: 2, channel: "Web",       refundAmount: 1450, refundDate: "2026-04-19", refundReason: "Partial refund — 1 item missing" },
];

export const PAYMENT_STATUSES = [
  { id: "all",        label: "All" },
  { id: "successful", label: "Successful" },
  { id: "failed",     label: "Failed" },
  { id: "pending",    label: "Pending" },
  { id: "refunded",   label: "Refunded" },
];

export const PAYMENT_METHODS = [
  { id: "all",      label: "All methods" },
  { id: "razorpay", label: "Razorpay" },
  { id: "cash",     label: "Cash" },
  { id: "bank",     label: "Bank transfer" },
  { id: "upi",      label: "UPI" },
];

export const PAYMENT_STATUS_PILLS = {
  successful: { bg: "bg-brand-50", text: "text-brand-700", dot: "bg-brand-500", label: "Successful" },
  failed:     { bg: "bg-red-50",   text: "text-red-700",   dot: "bg-red-500",   label: "Failed" },
  pending:    { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
  refunded:   { bg: "bg-gray-100", text: "text-gray-600",  dot: "bg-gray-400",  label: "Refunded" },
};

export const PAYMENTS = [
  { id: "PAY-7821", date: "2026-05-06", amount: 2450, customer: "Aanya Sharma",   orderId: "ORD-1042", method: "razorpay", status: "successful", invoiceId: "INV-2042" },
  { id: "PAY-7820", date: "2026-05-06", amount: 6890, customer: "Rohit Verma",    orderId: "ORD-1041", method: "razorpay", status: "successful", invoiceId: "INV-2041" },
  { id: "PAY-7819", date: "2026-05-05", amount: 1200, customer: "Kavya Iyer",     orderId: "ORD-1040", method: "upi",      status: "successful", invoiceId: "INV-2040" },
  { id: "PAY-7818", date: "2026-05-04", amount: 4350, customer: "Manish Gupta",   orderId: "ORD-1039", method: "razorpay", status: "successful", invoiceId: "INV-2039" },
  { id: "PAY-7817", date: "2026-05-04", amount: 1850, customer: "Sneha Pillai",   orderId: "ORD-1038", method: "cash",     status: "successful", invoiceId: "INV-2038" },
  { id: "PAY-7816", date: "2026-05-03", amount: 2200, customer: "Divya Menon",    orderId: "ORD-1034", method: "razorpay", status: "failed",     invoiceId: null },
  { id: "PAY-7815", date: "2026-05-02", amount: 7500, customer: "Aditya Kapoor",  orderId: "ORD-1033", method: "razorpay", status: "refunded",   invoiceId: "INV-2033" },
  { id: "PAY-7814", date: "2026-05-01", amount: 1650, customer: "Neha Joshi",     orderId: "ORD-1032", method: "upi",      status: "successful", invoiceId: "INV-2032" },
  { id: "PAY-7813", date: "2026-04-30", amount: 3850, customer: "Vikram Singh",   orderId: "ORD-1031", method: "bank",     status: "pending",    invoiceId: "INV-2031" },
];

export const INVOICE_STATUSES = [
  { id: "all",     label: "All" },
  { id: "draft",   label: "Draft" },
  { id: "sent",    label: "Sent" },
  { id: "paid",    label: "Paid" },
  { id: "overdue", label: "Overdue" },
  { id: "void",    label: "Void" },
];

export const INVOICE_STATUS_PILLS = {
  draft:   { bg: "bg-gray-100", text: "text-gray-600",  dot: "bg-gray-400",  label: "Draft" },
  sent:    { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Sent" },
  paid:    { bg: "bg-brand-50", text: "text-brand-700", dot: "bg-brand-500", label: "Paid" },
  overdue: { bg: "bg-red-50",   text: "text-red-700",   dot: "bg-red-500",   label: "Overdue" },
  void:    { bg: "bg-gray-100", text: "text-gray-500",  dot: "bg-gray-400",  label: "Void" },
};

export const INVOICES = [
  { id: "INV-2042", date: "2026-05-06", customer: "Aanya Sharma",   amount: 2450, status: "paid",    paymentId: "PAY-7821" },
  { id: "INV-2041", date: "2026-05-06", customer: "Rohit Verma",    amount: 6890, status: "paid",    paymentId: "PAY-7820" },
  { id: "INV-2040", date: "2026-05-05", customer: "Kavya Iyer",     amount: 1200, status: "paid",    paymentId: "PAY-7819" },
  { id: "INV-2039", date: "2026-05-04", customer: "Manish Gupta",   amount: 4350, status: "paid",    paymentId: "PAY-7818" },
  { id: "INV-2038", date: "2026-05-04", customer: "Sneha Pillai",   amount: 1850, status: "paid",    paymentId: "PAY-7817" },
  { id: "INV-2033", date: "2026-05-01", customer: "Aditya Kapoor",  amount: 7500, status: "void",    paymentId: "PAY-7815" },
  { id: "INV-2032", date: "2026-05-01", customer: "Neha Joshi",     amount: 1650, status: "paid",    paymentId: "PAY-7814" },
  { id: "INV-2031", date: "2026-04-30", customer: "Vikram Singh",   amount: 3850, status: "sent",    paymentId: null },
  { id: "INV-2028", date: "2026-04-22", customer: "Tanya Reddy",    amount: 5200, status: "overdue", paymentId: null },
  { id: "INV-2027", date: "2026-04-20", customer: "Mohan Krishnan", amount: 980,  status: "overdue", paymentId: null },
  { id: "INV-2026", date: "2026-04-18", customer: "Priya Banerjee", amount: 2750, status: "draft",   paymentId: null },
];

export const PLATFORMS = ["shopify", "woocommerce", "petpooja", "wenext"];

export const PLATFORM_CONNECTIONS = {
  shopify: {
    id: "shopify",
    label: "Shopify",
    description: "Sync products, orders, inventory, and customers",
    status: "connected",
    accountName: "wenext-store.myshopify.com",
    lastSync: "2 minutes ago",
    productCount: 124,
    orderCount: 47,
  },
  woocommerce: {
    id: "woocommerce",
    label: "WooCommerce",
    description: "Sync products, orders, and customer accounts",
    status: "connected",
    accountName: "shop.wenext.in",
    lastSync: "12 minutes ago",
    productCount: 86,
    orderCount: 23,
  },
  petpooja: {
    id: "petpooja",
    label: "PetPooja",
    description: "Sync menu items, orders, and POS inventory",
    status: "warning",
    statusReason: "Auth token expiring in 3 days",
    accountName: "wenext-cafe-mumbai",
    lastSync: "1 hour ago",
    productCount: 32,
    orderCount: 18,
  },
};

export const PLATFORM_PRODUCT_COUNTS = {
  all: 8,
  shopify: 6,
  woocommerce: 3,
  petpooja: 2,
  wenext: 1,
};

export const PRODUCTS = [
  {
    id: "P-101", name: "Cold Pressed Almond Oil 500ml", sku: "CP-ALM-500", price: 690,  stock: 124, status: "active", category: "Wellness",
    platforms: {
      shopify:     { enabled: true, externalId: "8472651", lastSync: "2 min ago", syncStatus: "in_sync", price: 690 },
      woocommerce: { enabled: true, externalId: "wc-1042", lastSync: "12 min ago", syncStatus: "in_sync", price: 690 },
    },
    sourceOfTruth: "shopify",
  },
  {
    id: "P-102", name: "Organic Cotton Tee — Beige", sku: "OC-TEE-BG", price: 1290, stock: 56, status: "active", category: "Apparel",
    platforms: {
      shopify:     { enabled: true, externalId: "8472652", lastSync: "5 min ago", syncStatus: "in_sync", price: 1290 },
      woocommerce: { enabled: true, externalId: "wc-1043", lastSync: "12 min ago", syncStatus: "syncing", price: 1290 },
    },
    sourceOfTruth: "shopify",
  },
  {
    id: "P-103", name: "Bamboo Toothbrush — 4pk", sku: "BAM-TB-4", price: 240, stock: 0, status: "out_of_stock", category: "Wellness",
    platforms: {
      shopify: { enabled: true, externalId: "8472653", lastSync: "1 hour ago", syncStatus: "in_sync", price: 240 },
    },
    sourceOfTruth: "shopify",
  },
  {
    id: "P-104", name: "Soy Candle — Vetiver", sku: "SC-VET-200", price: 850, stock: 38, status: "active", category: "Home",
    platforms: {
      shopify:     { enabled: true,  externalId: "8472654", lastSync: "2 min ago", syncStatus: "in_sync", price: 850 },
      woocommerce: { enabled: true,  externalId: "wc-1044", lastSync: "12 min ago", syncStatus: "in_sync", price: 850 },
      petpooja:    { enabled: true,  externalId: "pp-557",  lastSync: "—",          syncStatus: "error",   price: 799, errorReason: "Item code mismatch" },
    },
    sourceOfTruth: "shopify",
    conflict: {
      field: "price",
      values: { shopify: 850, petpooja: 799 },
    },
  },
  {
    id: "P-105", name: "Cold Brew Coffee — 6pk", sku: "CB-COF-6", price: 1890, stock: 12, status: "active", category: "Food",
    platforms: {
      petpooja: { enabled: true, externalId: "pp-561", lastSync: "1 hour ago", syncStatus: "in_sync", price: 1890 },
    },
    sourceOfTruth: "petpooja",
  },
  {
    id: "P-106", name: "Yoga Mat — Cork", sku: "YM-CK-6MM", price: 2490, stock: 24, status: "active", category: "Wellness",
    platforms: {
      shopify:     { enabled: true, externalId: "8472656", lastSync: "2 min ago", syncStatus: "in_sync", price: 2490 },
      woocommerce: { enabled: true, externalId: "wc-1046", lastSync: "12 min ago", syncStatus: "in_sync", price: 2490 },
    },
    sourceOfTruth: "shopify",
  },
  {
    id: "P-107", name: "Linen Tote Bag", sku: "LIN-TOTE", price: 590, stock: 0, status: "draft", category: "Apparel",
    platforms: {
      wenext: { enabled: true, externalId: "—", lastSync: "—", syncStatus: "paused", price: 590 },
    },
    sourceOfTruth: "wenext",
  },
  {
    id: "P-108", name: "Ceramic Mug — Olive", sku: "CM-OLV-300", price: 450, stock: 88, status: "active", category: "Home",
    platforms: {
      shopify: { enabled: true, externalId: "8472658", lastSync: "5 min ago", syncStatus: "in_sync", price: 450 },
    },
    sourceOfTruth: "shopify",
  },
];

export const SYNC_EVENTS = [
  { id: "S-901", direction: "in",  platform: "shopify",     summary: "Synced 12 products from Shopify",                    timestamp: "2 min ago", action: null },
  { id: "S-900", direction: "in",  platform: "woocommerce", summary: "Synced 4 orders from WooCommerce",                   timestamp: "12 min ago", action: null },
  { id: "S-899", direction: "out", platform: "shopify",     summary: "Created 3 products in Shopify (sourced from WeNext)", timestamp: "yesterday", action: null },
  { id: "S-898", direction: "in",  platform: "petpooja",    summary: "PetPooja sync failed: Auth token expired",           timestamp: "1 hour ago", action: { label: "Reconnect" } },
  { id: "S-897", direction: "both", platform: "woocommerce", summary: "Two-way sync: 8 products updated",                  timestamp: "yesterday", action: null },
  { id: "S-896", direction: "out", platform: "petpooja",    summary: "Updated stock for 2 menu items in PetPooja",         timestamp: "2 days ago", action: null },
];

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function buildOrderStatusCounts(orders) {
  const counts = { all: orders.length };
  for (const o of orders) counts[o.status] = (counts[o.status] ?? 0) + 1;
  return counts;
}

export function abandonedSummary(orders) {
  const abandoned = orders.filter((o) => o.status === "abandoned");
  const totalValue = abandoned.reduce((s, o) => s + o.total, 0);
  return { count: abandoned.length, totalValue };
}

export function billingMetrics(payments, invoices) {
  const isThisMonth = (iso) => {
    const d = new Date(iso);
    const now = new Date("2026-05-07");
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };
  const received = payments
    .filter((p) => p.status === "successful" && isThisMonth(p.date))
    .reduce((s, p) => s + p.amount, 0);
  const refunded = payments
    .filter((p) => p.status === "refunded" && isThisMonth(p.date))
    .reduce((s, p) => s + p.amount, 0);
  const outstanding = invoices
    .filter((i) => i.status === "sent")
    .reduce((s, i) => s + i.amount, 0);
  const overdue = invoices
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + i.amount, 0);
  return { received, refunded, outstanding, overdue };
}

// Mock data for WhatsApp Flows feature.
//
// FLOWS         - list of interactive WhatsApp Flow forms
// SUBMISSIONS   - captured form submissions per flow
// COMPONENT_CATALOG - palette for the visual builder (grouped by section)

export const FLOW_STATUSES = [
  { id: "all",        label: "All Status" },
  { id: "published",  label: "Published" },
  { id: "draft",      label: "Draft" },
  { id: "review",     label: "Under review" },
  { id: "rejected",   label: "Rejected" },
];

export const FLOW_CATEGORIES = [
  { id: "all",      label: "All Categories" },
  { id: "lead_gen", label: "Lead Gen" },
  { id: "booking",  label: "Booking" },
  { id: "survey",   label: "Survey" },
  { id: "signup",   label: "Sign up" },
  { id: "other",    label: "Other" },
];

export const CATEGORY_LABEL = {
  lead_gen: "Lead Gen",
  booking:  "Booking",
  survey:   "Survey",
  signup:   "Sign up",
  other:    "Other",
};

export const STATUS_LABEL = {
  published: "Published",
  draft:     "Draft",
  review:    "Under review",
  rejected:  "Rejected",
};

export const FLOWS = [
  {
    id: "f1",
    name: "Spring Sale Lead Capture",
    description: "Quick lead capture for shoppers tapping the Spring Sale ad.",
    status: "published",
    category: "lead_gen",
    submissions: 1248,
    lastEdited: "2 hours ago",
    screens: [
      {
        id: "s1",
        title: "Welcome",
        components: [
          { id: "c1", type: "TextHeading",  label: "Get your Spring Sale code" },
          { id: "c2", type: "TextBody",     label: "Tell us a bit about you and we'll send a discount to your WhatsApp." },
          { id: "c3", type: "TextInput",    label: "Full name", required: true, placeholder: "Jane Doe" },
          { id: "c4", type: "TextInput",    label: "Email",     required: true, placeholder: "jane@acme.com" },
          { id: "c5", type: "Dropdown",     label: "I'm shopping for", required: false, options: ["Myself", "Family", "Gift"] },
        ],
      },
      {
        id: "s2",
        title: "Preferences",
        components: [
          { id: "c6", type: "RadioGroup",   label: "Preferred channel", required: true, options: ["WhatsApp", "Email"] },
          { id: "c7", type: "Checkbox",     label: "Send me weekly offers", required: false },
          { id: "c8", type: "FooterButton", label: "Get my code" },
        ],
      },
    ],
  },
  {
    id: "f2",
    name: "Salon Booking",
    description: "Pick service, stylist, and slot — confirms directly in WhatsApp.",
    status: "published",
    category: "booking",
    submissions: 412,
    lastEdited: "Yesterday",
    screens: [
      {
        id: "s1",
        title: "Choose service",
        components: [
          { id: "c1", type: "TextHeading", label: "Book your appointment" },
          { id: "c2", type: "Dropdown",    label: "Service", required: true, options: ["Haircut", "Color", "Spa", "Manicure"] },
          { id: "c3", type: "Dropdown",    label: "Stylist", required: false, options: ["Any", "Aisha", "Rahul", "Priya"] },
        ],
      },
      {
        id: "s2",
        title: "Pick a date",
        components: [
          { id: "c4", type: "DatePicker",  label: "Preferred date", required: true },
          { id: "c5", type: "RadioGroup",  label: "Time slot", required: true, options: ["10:00 AM", "12:30 PM", "3:00 PM", "5:30 PM"] },
          { id: "c6", type: "FooterButton", label: "Confirm booking" },
        ],
      },
    ],
  },
  {
    id: "f3",
    name: "Post-purchase NPS",
    description: "Two-question NPS survey after order delivery.",
    status: "draft",
    category: "survey",
    submissions: 0,
    lastEdited: "3 days ago",
    screens: [
      {
        id: "s1",
        title: "How was it?",
        components: [
          { id: "c1", type: "TextHeading",  label: "Thanks for your order!" },
          { id: "c2", type: "TextBody",     label: "Help us improve — 30 seconds, promise." },
          { id: "c3", type: "RadioGroup",   label: "How likely are you to recommend us?", required: true, options: ["0–6 Detractor", "7–8 Passive", "9–10 Promoter"] },
          { id: "c4", type: "TextArea",     label: "What can we do better?", required: false, placeholder: "Optional" },
          { id: "c5", type: "FooterButton", label: "Submit" },
        ],
      },
    ],
  },
  {
    id: "f4",
    name: "Webinar Sign-up",
    description: "Register prospects for the monthly product webinar.",
    status: "review",
    category: "signup",
    submissions: 86,
    lastEdited: "4 days ago",
    screens: [
      {
        id: "s1",
        title: "Register",
        components: [
          { id: "c1", type: "TextHeading", label: "Reserve your seat" },
          { id: "c2", type: "TextInput",   label: "Full name",  required: true,  placeholder: "Jane Doe" },
          { id: "c3", type: "TextInput",   label: "Work email", required: true,  placeholder: "jane@acme.com" },
          { id: "c4", type: "TextInput",   label: "Company",    required: false, placeholder: "Acme" },
          { id: "c5", type: "OptIn",       label: "I agree to receive event emails", required: true },
          { id: "c6", type: "FooterButton", label: "Register" },
        ],
      },
    ],
  },
  {
    id: "f5",
    name: "Real Estate Site Visit",
    description: "Schedule a site visit at one of our projects.",
    status: "rejected",
    category: "lead_gen",
    submissions: 32,
    lastEdited: "1 week ago",
    screens: [
      {
        id: "s1",
        title: "Pick a project",
        components: [
          { id: "c1", type: "TextHeading", label: "Visit our project" },
          { id: "c2", type: "Dropdown",    label: "Project",     required: true, options: ["Greenview Phase 1", "Lakeside Towers", "Hillview Villas"] },
          { id: "c3", type: "DatePicker",  label: "Visit date",  required: true },
          { id: "c4", type: "TextInput",   label: "Your phone", required: true, placeholder: "+91 90000 00000" },
          { id: "c5", type: "FooterButton", label: "Request visit" },
        ],
      },
    ],
  },
  {
    id: "f6",
    name: "Restaurant Reservation",
    description: "Table booking with party size and seating preference.",
    status: "draft",
    category: "booking",
    submissions: 0,
    lastEdited: "Just now",
    screens: [
      {
        id: "s1",
        title: "Reservation",
        components: [
          { id: "c1", type: "TextHeading", label: "Reserve your table" },
          { id: "c2", type: "TextInput",   label: "Name on booking", required: true, placeholder: "Jane Doe" },
          { id: "c3", type: "DatePicker",  label: "Date",            required: true },
          { id: "c4", type: "Dropdown",    label: "Party size",      required: true, options: ["2", "4", "6", "8+"] },
          { id: "c5", type: "RadioGroup",  label: "Seating",         required: false, options: ["Indoor", "Outdoor", "No preference"] },
          { id: "c6", type: "FooterButton", label: "Reserve" },
        ],
      },
    ],
  },
];

// Submitted responses across flows.
export const SUBMISSIONS = [
  { id: "r1",  flowId: "f1", flowName: "Spring Sale Lead Capture", phone: "+91 98123 45601", date: "2026-06-10 09:42", status: "complete", fields: { "Full name": "Aisha Kapoor",  "Email": "aisha@acme.com",     "I'm shopping for": "Myself",  "Preferred channel": "WhatsApp" } },
  { id: "r2",  flowId: "f1", flowName: "Spring Sale Lead Capture", phone: "+91 98123 45602", date: "2026-06-10 09:18", status: "complete", fields: { "Full name": "Rahul Verma",    "Email": "rahul@gmail.com",    "I'm shopping for": "Family",  "Preferred channel": "Email" } },
  { id: "r3",  flowId: "f2", flowName: "Salon Booking",            phone: "+91 98123 45603", date: "2026-06-10 08:55", status: "complete", fields: { "Service": "Haircut",          "Stylist": "Aisha",            "Preferred date": "2026-06-12", "Time slot": "12:30 PM" } },
  { id: "r4",  flowId: "f4", flowName: "Webinar Sign-up",          phone: "+91 98123 45604", date: "2026-06-09 22:11", status: "partial",  fields: { "Full name": "Priya Mehta",    "Work email": "priya@globex.io" } },
  { id: "r5",  flowId: "f1", flowName: "Spring Sale Lead Capture", phone: "+91 98123 45605", date: "2026-06-09 19:48", status: "complete", fields: { "Full name": "Karthik R.",     "Email": "karthik@web.in",     "I'm shopping for": "Gift",    "Preferred channel": "WhatsApp" } },
  { id: "r6",  flowId: "f2", flowName: "Salon Booking",            phone: "+91 98123 45606", date: "2026-06-09 17:30", status: "complete", fields: { "Service": "Color",            "Stylist": "Priya",            "Preferred date": "2026-06-14", "Time slot": "5:30 PM" } },
  { id: "r7",  flowId: "f6", flowName: "Restaurant Reservation",   phone: "+91 98123 45607", date: "2026-06-09 14:02", status: "complete", fields: { "Name on booking": "Neha S.",  "Date": "2026-06-11",          "Party size": "4",             "Seating": "Outdoor" } },
  { id: "r8",  flowId: "f5", flowName: "Real Estate Site Visit",   phone: "+91 98123 45608", date: "2026-06-09 12:15", status: "complete", fields: { "Project": "Greenview Phase 1","Visit date": "2026-06-13",    "Your phone": "+91 98123 45608" } },
  { id: "r9",  flowId: "f1", flowName: "Spring Sale Lead Capture", phone: "+91 98123 45609", date: "2026-06-09 11:01", status: "complete", fields: { "Full name": "Meera Iyer",     "Email": "meera@acme.com",     "I'm shopping for": "Myself",  "Preferred channel": "WhatsApp" } },
  { id: "r10", flowId: "f4", flowName: "Webinar Sign-up",          phone: "+91 98123 45610", date: "2026-06-09 10:22", status: "complete", fields: { "Full name": "Vikram Singh",  "Work email": "vikram@neo.io",  "Company": "Neo" } },
  { id: "r11", flowId: "f2", flowName: "Salon Booking",            phone: "+91 98123 45611", date: "2026-06-08 21:48", status: "partial",  fields: { "Service": "Spa" } },
  { id: "r12", flowId: "f1", flowName: "Spring Sale Lead Capture", phone: "+91 98123 45612", date: "2026-06-08 19:33", status: "complete", fields: { "Full name": "Sneha P.",      "Email": "sneha@web.in",       "I'm shopping for": "Family",  "Preferred channel": "Email" } },
  { id: "r13", flowId: "f6", flowName: "Restaurant Reservation",   phone: "+91 98123 45613", date: "2026-06-08 18:00", status: "complete", fields: { "Name on booking": "Arjun M.", "Date": "2026-06-10",          "Party size": "2",             "Seating": "Indoor" } },
  { id: "r14", flowId: "f5", flowName: "Real Estate Site Visit",   phone: "+91 98123 45614", date: "2026-06-08 16:42", status: "partial",  fields: { "Project": "Lakeside Towers" } },
  { id: "r15", flowId: "f4", flowName: "Webinar Sign-up",          phone: "+91 98123 45615", date: "2026-06-08 15:11", status: "complete", fields: { "Full name": "Anita D.",      "Work email": "anita@globex.io", "Company": "Globex" } },
  { id: "r16", flowId: "f1", flowName: "Spring Sale Lead Capture", phone: "+91 98123 45616", date: "2026-06-08 12:55", status: "complete", fields: { "Full name": "Rohan T.",      "Email": "rohan@web.in",       "I'm shopping for": "Myself",  "Preferred channel": "Email" } },
  { id: "r17", flowId: "f2", flowName: "Salon Booking",            phone: "+91 98123 45617", date: "2026-06-08 10:30", status: "complete", fields: { "Service": "Manicure",         "Stylist": "Any",              "Preferred date": "2026-06-11", "Time slot": "10:00 AM" } },
  { id: "r18", flowId: "f5", flowName: "Real Estate Site Visit",   phone: "+91 98123 45618", date: "2026-06-07 19:18", status: "complete", fields: { "Project": "Hillview Villas",  "Visit date": "2026-06-15",    "Your phone": "+91 98123 45618" } },
  { id: "r19", flowId: "f1", flowName: "Spring Sale Lead Capture", phone: "+91 98123 45619", date: "2026-06-07 14:02", status: "partial",  fields: { "Full name": "Tanya G." } },
  { id: "r20", flowId: "f6", flowName: "Restaurant Reservation",   phone: "+91 98123 45620", date: "2026-06-07 12:12", status: "complete", fields: { "Name on booking": "Devraj K.", "Date": "2026-06-09",          "Party size": "6",             "Seating": "Outdoor" } },
];

// Component palette for the visual builder, grouped by section.
export const COMPONENT_CATALOG = [
  {
    id: "layout",
    label: "Layout",
    items: [
      { type: "TextHeading",    label: "Heading",     description: "Large section title" },
      { type: "TextSubheading", label: "Subheading",  description: "Smaller title above body" },
      { type: "TextBody",       label: "Body text",   description: "Paragraph copy" },
      { type: "TextCaption",    label: "Caption",     description: "Small hint or legal copy" },
    ],
  },
  {
    id: "inputs",
    label: "Inputs",
    items: [
      { type: "TextInput",  label: "Text input",   description: "Short, single-line text" },
      { type: "TextArea",   label: "Text area",    description: "Multi-line text" },
      { type: "DatePicker", label: "Date picker",  description: "Pick a date" },
      { type: "Dropdown",   label: "Dropdown",     description: "Select one of many" },
      { type: "RadioGroup", label: "Radio group",  description: "Pick exactly one" },
      { type: "Checkbox",   label: "Checkbox",     description: "Multi-select choices" },
      { type: "OptIn",      label: "Opt-in",       description: "Single consent checkbox" },
    ],
  },
  {
    id: "media",
    label: "Media",
    items: [
      { type: "Image", label: "Image", description: "Inline image or banner" },
    ],
  },
  {
    id: "actions",
    label: "Actions",
    items: [
      { type: "EmbeddedFooter", label: "Embedded footer", description: "Reusable footer block" },
      { type: "FooterButton",   label: "Submit button",   description: "Primary CTA at footer" },
    ],
  },
];

// Maps a component type to a friendly category for icons / palette.
export const COMPONENT_KIND = {
  TextHeading:    "text",
  TextSubheading: "text",
  TextBody:       "text",
  TextCaption:    "text",
  TextInput:      "input",
  TextArea:       "input",
  DatePicker:     "input",
  Dropdown:       "input",
  RadioGroup:     "input",
  Checkbox:       "input",
  OptIn:          "input",
  Image:          "media",
  EmbeddedFooter: "action",
  FooterButton:   "action",
};

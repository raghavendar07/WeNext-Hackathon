import { useMemo, useState } from "react";
import {
  Users,
  Plus,
  MoreVertical,
  Shield,
  Mail,
  Clock,
  Activity,
  Edit3,
  KeyRound,
  UserX,
  Trash2,
  X,
  Check,
  Crown,
  Search,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Avatar from "../inbox/Avatar.jsx";
import PageTabs from "../ui/PageTabs.jsx";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const ROLE_META = {
  Owner:   { tone: "amber",   icon: Crown,  desc: "Full access. Cannot be removed by other roles." },
  Admin:   { tone: "violet",  icon: Shield, desc: "Manage workspace, members, billing, and settings." },
  Manager: { tone: "blue",    icon: Shield, desc: "Run campaigns, manage CRM, approve templates." },
  Agent:   { tone: "emerald", icon: Users,  desc: "Handle inbox conversations and contact records." },
  Viewer:  { tone: "slate",   icon: Users,  desc: "Read-only access to dashboards and reports." },
};

const ROLE_TONE = {
  amber:   "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
  violet:  "bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]",
  blue:    "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]",
  emerald: "bg-[#D6F4D9] text-[#0F7A4A] border-[#A7E5BC]",
  slate:   "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]",
};

const STATUS_TONE = {
  Active:    "bg-[#D6F4D9] text-[#0F7A4A] border-[#A7E5BC]",
  Suspended: "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]",
  Pending:   "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
};

const MEMBERS = [
  { id: "m1",  name: "Raghav Mehta",     email: "raghav@photonx.com",    role: "Owner",   status: "Active",    lastActive: "Just now",      palette: "blue"  },
  { id: "m2",  name: "Anita Iyer",       email: "anita@photonx.com",     role: "Admin",   status: "Active",    lastActive: "12 min ago",    palette: "pink"  },
  { id: "m3",  name: "Priya Menon",      email: "priya@photonx.com",     role: "Manager", status: "Active",    lastActive: "1 hour ago",    palette: "coral" },
  { id: "m4",  name: "Karthik Rao",      email: "karthik@photonx.com",   role: "Agent",   status: "Suspended", lastActive: "2 days ago",    palette: "rose"  },
  { id: "m5",  name: "Aisha Khan",       email: "aisha@photonx.com",     role: "Agent",   status: "Active",    lastActive: "5 min ago",     palette: "green" },
  { id: "m6",  name: "Rahul Verma",      email: "rahul@photonx.com",     role: "Agent",   status: "Active",    lastActive: "30 min ago",    palette: "blue"  },
  { id: "m7",  name: "Divya Suresh",     email: "divya@photonx.com",     role: "Manager", status: "Active",    lastActive: "3 hours ago",   palette: "pink"  },
  { id: "m8",  name: "Vikram Joshi",     email: "vikram@photonx.com",    role: "Viewer",  status: "Active",    lastActive: "Yesterday",     palette: "coral" },
  { id: "m9",  name: "Neha Pillai",      email: "neha@photonx.com",      role: "Agent",   status: "Pending",   lastActive: "Never",         palette: "rose"  },
  { id: "m10", name: "Sanjay Bansal",    email: "sanjay@photonx.com",    role: "Viewer",  status: "Active",    lastActive: "4 days ago",    palette: "green" },
];

const INVITATIONS = [
  { id: "i1", email: "deepak@photonx.com",   invitedBy: "Anita Iyer",   role: "Agent",   expiresIn: 5 },
  { id: "i2", email: "ria.kapoor@gmail.com", invitedBy: "Raghav Mehta", role: "Manager", expiresIn: 2 },
  { id: "i3", email: "mohan@photonx.com",    invitedBy: "Priya Menon",  role: "Agent",   expiresIn: 7 },
  { id: "i4", email: "leena@photonx.com",    invitedBy: "Anita Iyer",   role: "Viewer",  expiresIn: 1 },
];

const ACTIVITY = [
  { id: "a1",  actor: "Anita Iyer",   text: "changed Karthik Rao's role to Admin",          time: "12 min ago" },
  { id: "a2",  actor: "Raghav Mehta", text: "suspended Karthik Rao",                        time: "1 hour ago" },
  { id: "a3",  actor: "Priya Menon",  text: "invited 5 new agents to the workspace",        time: "3 hours ago" },
  { id: "a4",  actor: "Anita Iyer",   text: "reset password for Neha Pillai",               time: "5 hours ago" },
  { id: "a5",  actor: "Raghav Mehta", text: "promoted Divya Suresh to Manager",             time: "Yesterday" },
  { id: "a6",  actor: "Anita Iyer",   text: "removed external user temp@vendor.com",        time: "Yesterday" },
  { id: "a7",  actor: "Priya Menon",  text: "updated permissions for the Agent role",       time: "2 days ago" },
  { id: "a8",  actor: "Raghav Mehta", text: "added billing access for Anita Iyer",          time: "3 days ago" },
  { id: "a9",  actor: "Anita Iyer",   text: "revoked invitation for spam@xyz.com",          time: "4 days ago" },
  { id: "a10", actor: "Raghav Mehta", text: "created new role Viewer for read-only access", time: "1 week ago" },
];

const PERMISSION_GROUPS = [
  { id: "inbox",       label: "Inbox",       perms: ["View conversations", "Reply to messages", "Assign conversations", "Close & resolve"] },
  { id: "campaigns",   label: "Campaigns",   perms: ["View campaigns", "Create campaigns", "Schedule & send", "Delete campaigns"] },
  { id: "automations", label: "Automations", perms: ["View automations", "Edit automations", "Publish automations", "Delete automations"] },
  { id: "crm",         label: "CRM",         perms: ["View contacts", "Edit contacts", "Import/export", "Delete contacts"] },
  { id: "commerce",    label: "Commerce",    perms: ["View catalog", "Edit catalog", "Manage orders", "Refunds"] },
  { id: "settings",    label: "Settings",    perms: ["View settings", "Edit workspace", "Manage integrations", "Manage members"] },
  { id: "billing",     label: "Billing",     perms: ["View invoices", "Update payment", "Change plan", "Cancel subscription"] },
];

// permission matrix: role -> group -> [bool,bool,bool,bool]
const ROLE_PERMS = {
  Owner:   { inbox: [1,1,1,1], campaigns: [1,1,1,1], automations: [1,1,1,1], crm: [1,1,1,1], commerce: [1,1,1,1], settings: [1,1,1,1], billing: [1,1,1,1] },
  Admin:   { inbox: [1,1,1,1], campaigns: [1,1,1,1], automations: [1,1,1,1], crm: [1,1,1,1], commerce: [1,1,1,1], settings: [1,1,1,1], billing: [1,1,1,0] },
  Manager: { inbox: [1,1,1,1], campaigns: [1,1,1,0], automations: [1,1,1,0], crm: [1,1,1,0], commerce: [1,1,1,0], settings: [1,0,0,0], billing: [1,0,0,0] },
  Agent:   { inbox: [1,1,1,1], campaigns: [1,0,0,0], automations: [1,0,0,0], crm: [1,1,0,0], commerce: [1,0,0,0], settings: [0,0,0,0], billing: [0,0,0,0] },
  Viewer:  { inbox: [1,0,0,0], campaigns: [1,0,0,0], automations: [1,0,0,0], crm: [1,0,0,0], commerce: [1,0,0,0], settings: [1,0,0,0], billing: [1,0,0,0] },
};

const ROLE_OPTIONS = ["Owner", "Admin", "Manager", "Agent", "Viewer"];

const TABS = [
  { id: "members",     label: "Members" },
  { id: "roles",       label: "Roles & Permissions" },
  { id: "invitations", label: "Invitations" },
  { id: "activity",    label: "Activity" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TeamManagementPage() {
  const [tab, setTab] = useState("members");
  const [modal, setModal] = useState(null); // { kind, member? }

  const counts = useMemo(() => {
    const total = MEMBERS.length;
    const active = MEMBERS.filter((m) => m.status === "Active").length;
    const pending = INVITATIONS.length;
    const owners = MEMBERS.filter((m) => m.role === "Owner").length;
    return { total, active, pending, owners };
  }, []);

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[22px] font-semibold text-[#0F172A]">Team Management</h1>
          <p className="text-[13px] font-medium text-[#6A6A6A]">
            Manage members, roles, and permissions for your organization.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ kind: "invite" })}
          className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-gradient-to-r from-[#1EB677] to-[#16A34A] px-4 text-[13px] font-medium text-white shadow-sm hover:opacity-95"
        >
          <Plus size={14} strokeWidth={2.25} />
          Invite member
        </button>
      </header>

      {/* Metric tiles */}
      <div className="grid grid-cols-4 gap-3">
        <Metric value={counts.total}   label="Total members"   icon={Users}        tone="text-[#0F172A]" />
        <Metric value={counts.active}  label="Active"          icon={CheckCircle2} tone="text-[#1EB677]" />
        <Metric value={counts.pending} label="Pending invites" icon={Mail}         tone="text-[#D97706]" />
        <Metric value={counts.owners}  label="Owners"          icon={Crown}        tone="text-[#92400E]" />
      </div>

      {/* Tabs */}
      <PageTabs tabs={TABS} active={tab} onChange={setTab} />

      {/* Tab content */}
      <div className="flex flex-1 flex-col">
        {tab === "members"     && <MembersTab     onAction={(kind, member) => setModal({ kind, member })} />}
        {tab === "roles"       && <RolesTab />}
        {tab === "invitations" && <InvitationsTab />}
        {tab === "activity"    && <ActivityTab />}
      </div>

      {/* Modals */}
      {modal?.kind === "invite"   && <InviteModal       onClose={() => setModal(null)} />}
      {modal?.kind === "edit"     && <EditMemberModal   member={modal.member} onClose={() => setModal(null)} />}
      {modal?.kind === "role"     && <EditMemberModal   member={modal.member} onClose={() => setModal(null)} focusRole />}
      {modal?.kind === "reset"    && <ResetPasswordModal member={modal.member} onClose={() => setModal(null)} />}
      {modal?.kind === "suspend"  && <ConfirmModal      member={modal.member} variant="suspend"  onClose={() => setModal(null)} />}
      {modal?.kind === "remove"   && <ConfirmModal      member={modal.member} variant="remove"   onClose={() => setModal(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Metric tile                                                        */
/* ------------------------------------------------------------------ */

function Metric({ value, label, icon: Icon, tone }) {
  return (
    <article className="flex items-center justify-between rounded-[12px] border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-1">
        <span className={`text-[24px] font-semibold leading-none ${tone}`}>{value}</span>
        <span className="text-[12px] font-medium text-[#6A6A6A]">{label}</span>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F6]">
        <Icon size={16} className={tone} strokeWidth={1.75} />
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Members tab                                                        */
/* ------------------------------------------------------------------ */

function MembersTab({ onAction }) {
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MEMBERS;
    return MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <label className="flex h-9 w-[320px] items-center gap-2 rounded-[8px] border border-[#E5E7EB] bg-white px-3">
        <Search size={14} className="text-[#9AA1A9]" strokeWidth={1.75} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search members by name, email, role..."
          className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#0F172A] placeholder:text-[#9AA1A9] focus:outline-none"
        />
      </label>

      <div className="overflow-visible rounded-[12px] border border-[#E5E7EB] bg-white">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-wide text-[#6A6A6A]">
              <Th>Member</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Last active</Th>
              <Th className="w-12 text-right">{""}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F9FAFB]">
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={m.name} palette={m.palette} size={32} />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-[#0F172A]">{m.name}</span>
                      <span className="text-[11px] font-medium text-[#6A6A6A]">{m.email}</span>
                    </div>
                  </div>
                </Td>
                <Td>
                  <RoleBadge role={m.role} />
                </Td>
                <Td>
                  <StatusBadge status={m.status} />
                </Td>
                <Td>
                  <span className="text-[12px] font-medium text-[#475569]">{m.lastActive}</span>
                </Td>
                <Td className="text-right">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === m.id ? null : m.id)}
                      className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"
                      aria-label="Member actions"
                    >
                      <MoreVertical size={16} strokeWidth={1.75} />
                    </button>
                    {openMenuId === m.id && (
                      <ActionMenu
                        onClose={() => setOpenMenuId(null)}
                        items={[
                          { icon: Edit3,    label: "Edit",          onClick: () => onAction("edit",    m) },
                          { icon: Shield,   label: "Change role",   onClick: () => onAction("role",    m) },
                          { icon: KeyRound, label: "Reset password",onClick: () => onAction("reset",   m) },
                          { icon: UserX,    label: "Suspend",       onClick: () => onAction("suspend", m), danger: true },
                          { icon: Trash2,   label: "Remove",        onClick: () => onAction("remove",  m), danger: true },
                        ]}
                      />
                    )}
                  </div>
                </Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[13px] font-medium text-[#6A6A6A]">
                  No members match "{query}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, className = "" }) {
  return <th className={`px-4 py-2.5 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function RoleBadge({ role }) {
  const meta = ROLE_META[role];
  const Icon = meta?.icon ?? Shield;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${ROLE_TONE[meta?.tone ?? "slate"]}`}
    >
      <Icon size={11} strokeWidth={2} />
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_TONE[status]}`}
    >
      {status}
    </span>
  );
}

function ActionMenu({ items, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 z-40 mt-1 w-44 overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white shadow-lg">
        {items.map((it) => (
          <button
            key={it.label}
            type="button"
            onClick={() => {
              onClose();
              it.onClick?.();
            }}
            className={[
              "flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-medium",
              it.danger ? "text-[#B91C1C] hover:bg-[#FEF2F2]" : "text-[#0F172A] hover:bg-[#F9FAFB]",
            ].join(" ")}
          >
            <it.icon size={14} strokeWidth={1.75} />
            {it.label}
          </button>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Roles tab                                                          */
/* ------------------------------------------------------------------ */

function RolesTab() {
  const [expanded, setExpanded] = useState(null);

  const roleCounts = useMemo(() => {
    const out = {};
    ROLE_OPTIONS.forEach((r) => {
      out[r] = MEMBERS.filter((m) => m.role === r).length;
    });
    return out;
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {ROLE_OPTIONS.map((role) => {
        const meta = ROLE_META[role];
        const Icon = meta.icon;
        const isOpen = expanded === role;
        return (
          <article
            key={role}
            className="rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : role)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-[10px] border ${ROLE_TONE[meta.tone]}`}
                >
                  <Icon size={16} strokeWidth={2} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[#0F172A]">{role}</span>
                  <span className="text-[12px] font-medium text-[#6A6A6A]">{meta.desc}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[12px] font-medium text-[#475569]">
                  {roleCounts[role]} member{roleCounts[role] === 1 ? "" : "s"}
                </span>
                {isOpen ? (
                  <ChevronUp size={16} className="text-[#6A6A6A]" />
                ) : (
                  <ChevronDown size={16} className="text-[#6A6A6A]" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-[#E5E7EB] px-5 py-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {PERMISSION_GROUPS.map((g) => (
                    <div key={g.id} className="flex flex-col gap-2">
                      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[#6A6A6A]">
                        {g.label}
                      </h4>
                      <ul className="flex flex-col gap-1.5">
                        {g.perms.map((p, idx) => {
                          const granted = ROLE_PERMS[role][g.id][idx] === 1;
                          return (
                            <li key={p} className="flex items-center gap-2 text-[12px] font-medium text-[#0F172A]">
                              {granted ? (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D6F4D9] text-[#0F7A4A]">
                                  <Check size={10} strokeWidth={3} />
                                </span>
                              ) : (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FEE2E2] text-[#B91C1C]">
                                  <X size={10} strokeWidth={3} />
                                </span>
                              )}
                              <span className={granted ? "" : "text-[#9AA1A9] line-through"}>{p}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Invitations tab                                                    */
/* ------------------------------------------------------------------ */

function InvitationsTab() {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white">
      <ul className="divide-y divide-[#F1F5F9]">
        {INVITATIONS.map((inv) => (
          <li key={inv.id} className="flex items-center gap-4 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-[#475569]">
              <Mail size={16} strokeWidth={1.75} />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-[13px] font-semibold text-[#0F172A]">{inv.email}</span>
              <span className="text-[11px] font-medium text-[#6A6A6A]">
                Invited by {inv.invitedBy} &middot; {inv.role}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#92400E]">
              <Clock size={12} strokeWidth={1.75} />
              Expires in {inv.expiresIn} day{inv.expiresIn === 1 ? "" : "s"}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert(`Resent invite to ${inv.email} (mock)`)}
                className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-[12px] font-medium text-[#0F172A] hover:bg-[#F9FAFB]"
              >
                <RefreshCw size={12} strokeWidth={1.75} />
                Resend
              </button>
              <button
                type="button"
                onClick={() => alert(`Revoked invite for ${inv.email} (mock)`)}
                className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[#FECACA] bg-white px-3 text-[12px] font-medium text-[#B91C1C] hover:bg-[#FEF2F2]"
              >
                <X size={12} strokeWidth={1.75} />
                Revoke
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Activity tab                                                       */
/* ------------------------------------------------------------------ */

function ActivityTab() {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5">
      <ol className="relative ml-3 border-l border-[#E5E7EB]">
        {ACTIVITY.map((a) => (
          <li key={a.id} className="mb-5 ml-5 last:mb-0">
            <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#1EB677] ring-4 ring-white">
              <Activity size={9} className="text-white" strokeWidth={2.5} />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] font-medium text-[#0F172A]">
                <span className="font-semibold">{a.actor}</span> {a.text}
              </p>
              <span className="text-[11px] font-medium text-[#6A6A6A]">{a.time}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal primitive                                                    */
/* ------------------------------------------------------------------ */

function Modal({ title, onClose, children, footer, size = "md" }) {
  const w = size === "lg" ? "max-w-2xl" : size === "sm" ? "max-w-md" : "max-w-lg";
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${w} rounded-[14px] bg-white shadow-xl`}
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-[#0F172A]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1.5 text-[#6A6A6A] hover:bg-[#F3F4F6]"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#6A6A6A]">{label}</span>
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled = false }) {
  return (
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={[
        "h-9 rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-[13px] font-medium text-[#0F172A] placeholder:text-[#9AA1A9] focus:border-[#1EB677] focus:outline-none",
        disabled ? "cursor-not-allowed bg-[#F9FAFB] text-[#6A6A6A]" : "",
      ].join(" ")}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="rounded-[8px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] font-medium text-[#0F172A] placeholder:text-[#9AA1A9] focus:border-[#1EB677] focus:outline-none"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-9 rounded-[8px] border border-[#E5E7EB] bg-white px-2.5 text-[13px] font-medium text-[#0F172A] focus:border-[#1EB677] focus:outline-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function CancelBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center rounded-[8px] border border-[#E5E7EB] bg-white px-4 text-[13px] font-medium text-[#0F172A] hover:bg-[#F9FAFB]"
    >
      Cancel
    </button>
  );
}

function PrimaryBtn({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-gradient-to-r from-[#1EB677] to-[#16A34A] px-4 text-[13px] font-medium text-white shadow-sm hover:opacity-95"
    >
      {children}
    </button>
  );
}

function DangerBtn({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-[#DC2626] px-4 text-[13px] font-medium text-white shadow-sm hover:bg-[#B91C1C]"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Modals                                                             */
/* ------------------------------------------------------------------ */

function InviteModal({ onClose }) {
  const [email, setEmail]     = useState("");
  const [role, setRole]       = useState("Agent");
  const [message, setMessage] = useState("");

  return (
    <Modal
      title="Invite member"
      onClose={onClose}
      footer={
        <>
          <CancelBtn onClick={onClose} />
          <PrimaryBtn
            onClick={() => {
              onClose();
              alert(`Invitation sent to ${email || "(no email)"} as ${role} (mock)`);
            }}
          >
            <Mail size={14} strokeWidth={1.75} />
            Send invite
          </PrimaryBtn>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label="Email">
          <Input
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="teammate@company.com"
          />
        </Field>
        <Field label="Role">
          <Select value={role} onChange={setRole} options={ROLE_OPTIONS} />
        </Field>
        <Field label="Welcome message (optional)">
          <Textarea
            value={message}
            onChange={setMessage}
            placeholder="Hi! Welcome to the workspace..."
          />
        </Field>
      </div>
    </Modal>
  );
}

function EditMemberModal({ member, onClose, focusRole = false }) {
  const [role, setRole]     = useState(member?.role ?? "Agent");
  const [active, setActive] = useState(member?.status === "Active");

  return (
    <Modal
      title={focusRole ? `Change role · ${member?.name}` : `Edit member · ${member?.name}`}
      onClose={onClose}
      footer={
        <>
          <CancelBtn onClick={onClose} />
          <PrimaryBtn
            onClick={() => {
              onClose();
              alert(`Saved changes for ${member?.name} (role: ${role}, ${active ? "Active" : "Suspended"}) (mock)`);
            }}
          >
            <Check size={14} strokeWidth={2} />
            Save
          </PrimaryBtn>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Field label="Name">
          <Input value={member?.name ?? ""} disabled onChange={() => {}} />
        </Field>
        <Field label="Email">
          <Input value={member?.email ?? ""} disabled onChange={() => {}} />
        </Field>
        <Field label="Role">
          <Select value={role} onChange={setRole} options={ROLE_OPTIONS} />
        </Field>
        <div className="flex items-center justify-between rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5">
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#0F172A]">Status</span>
            <span className="text-[11px] font-medium text-[#6A6A6A]">
              {active ? "Member can sign in and use the workspace." : "Member is suspended and cannot sign in."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActive((v) => !v)}
            className={[
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
              active ? "bg-[#1EB677]" : "bg-[#CBD5E1]",
            ].join(" ")}
            aria-pressed={active}
          >
            <span
              className={[
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                active ? "translate-x-[18px]" : "translate-x-0.5",
              ].join(" ")}
            />
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ResetPasswordModal({ member, onClose }) {
  const tempPassword = useMemo(
    () => "Tmp-" + Math.random().toString(36).slice(2, 8) + "-" + Math.floor(100 + Math.random() * 900),
    [],
  );

  return (
    <Modal
      title={`Reset password · ${member?.name}`}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <CancelBtn onClick={onClose} />
          <PrimaryBtn
            onClick={() => {
              onClose();
              alert(`Reset link sent to ${member?.email} (mock)`);
            }}
          >
            <KeyRound size={14} strokeWidth={1.75} />
            Reset password
          </PrimaryBtn>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2 rounded-[8px] border border-[#FDE68A] bg-[#FEF3C7] px-3 py-2.5">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-[#92400E]" strokeWidth={1.75} />
          <p className="text-[12px] font-medium text-[#92400E]">
            This will sign {member?.name} out of all sessions and send a reset email to {member?.email}.
          </p>
        </div>
        <Field label="Temporary password">
          <div className="flex items-center justify-between gap-2 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2">
            <code className="text-[13px] font-semibold text-[#0F172A]">{tempPassword}</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText?.(tempPassword);
                alert("Temporary password copied (mock)");
              }}
              className="text-[12px] font-medium text-[#1EB677] hover:underline"
            >
              Copy
            </button>
          </div>
        </Field>
      </div>
    </Modal>
  );
}

function ConfirmModal({ member, variant, onClose }) {
  const isRemove = variant === "remove";
  const title = isRemove ? `Remove ${member?.name}?` : `Suspend ${member?.name}?`;
  const verb = isRemove ? "Remove" : "Suspend";
  const body = isRemove
    ? `This will permanently remove ${member?.name} from the workspace. Their assigned conversations and contacts will be unassigned. This cannot be undone.`
    : `${member?.name} will be signed out and unable to sign in until reactivated. Their data and assignments are preserved.`;

  return (
    <Modal
      title={title}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <CancelBtn onClick={onClose} />
          <DangerBtn
            onClick={() => {
              onClose();
              alert(`${verb}d ${member?.name} (mock)`);
            }}
          >
            {isRemove ? <Trash2 size={14} strokeWidth={1.75} /> : <UserX size={14} strokeWidth={1.75} />}
            {verb}
          </DangerBtn>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2] text-[#B91C1C]">
          {isRemove ? <Trash2 size={16} strokeWidth={1.75} /> : <UserX size={16} strokeWidth={1.75} />}
        </div>
        <p className="text-[13px] font-medium text-[#475569]">{body}</p>
      </div>
    </Modal>
  );
}

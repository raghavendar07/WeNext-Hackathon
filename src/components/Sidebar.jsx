import { useRef, useState } from "react";
import {
  LayoutDashboard,
  Megaphone,
  Share2,
  Workflow,
  Users,
  CalendarCheck,
  ShoppingBag,
  Package,
  Receipt,
  CreditCard,
  Database,
  FileBarChart2,
  Sparkles,
  Plug,
  PanelLeftClose,
  ChevronDown,
  MessageSquare,
  BarChart3,
  Bot,
  MessagesSquare,
  Ticket,
  FileText,
  Building2,
} from "lucide-react";
import notificationIcon from "../assets/notification.svg";
import Logo from "./Logo.jsx";
import Section from "./Section.jsx";
import NavItem from "./NavItem.jsx";
import SubItem from "./SubItem.jsx";
import ChannelItem from "./ChannelItem.jsx";
import PlanCard from "./PlanCard.jsx";
import ProfilePanel from "./ProfilePanel.jsx";
import NotificationPanel from "./NotificationPanel.jsx";
import SearchInput from "./SearchInput.jsx";

const CRM_TAB_IDS = ["lead-board", "leads", "customers", "tickets", "tags"];
const COMMERCE_TAB_IDS = [
  "commerce-overview",
  "commerce-catalog",
  "commerce-orders",
  "commerce-billing",
];
import { WhatsappLogo, InstagramLogo, LinkedinLogo } from "./BrandLogos.jsx";

export default function Sidebar({ active: activeProp, onActiveChange }) {
  const [internalActive, setInternalActive] = useState("shared-with-me");
  const active = activeProp ?? internalActive;
  const setActive = onActiveChange ?? setInternalActive;
  const [profileOpen, setProfileOpen] = useState(false);
  const profileTriggerRef = useRef(null);
  const [openSection, setOpenSection] = useState("CHANNELS");
  const sectionToggle = (key) => () =>
    setOpenSection((current) => (current === key ? null : key));
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationTriggerRef = useRef(null);
  const handleNotifications = () => {
    setProfileOpen(false);
    setNotificationsOpen((v) => !v);
  };

  return (
    <aside
      className="fixed left-0 top-0 z-20 flex h-screen w-[260px] flex-col bg-transparent"
      aria-label="Primary"
    >
      {/* Top: brand + collapse */}
      <div className="flex h-14 shrink-0 items-center justify-between pl-[10px] pr-[8px]">
        <Logo className="h-[22px] w-auto" />
        <button
          type="button"
          aria-label="Collapse sidebar"
          className={[
            "inline-flex h-8 w-8 items-center justify-center rounded-[8px]",
            "text-[#6A6A6A] transition-colors duration-150 ease-out",
            "hover:bg-[#F2F2F2] hover:text-[#3F3F3F]",
            "focus:outline-none focus-visible:shadow-focus",
          ].join(" ")}
        >
          <PanelLeftClose size={18} strokeWidth={1.75} />
        </button>
      </div>

      {/* Universal search */}
      <div className="pl-[10px] pr-[8px] pb-2 pt-1">
        <SearchInput />
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-3 overflow-y-auto pl-[10px] pr-[8px] pb-2">
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={active === "dashboard"}
          onClick={() => setActive("dashboard")}
        />

        <Section
          label="Channels"
          icon={MessageSquare}
          open={openSection === "CHANNELS"}
          onToggle={sectionToggle("CHANNELS")}
        >
          <ChannelItem
            logo={WhatsappLogo}
            label="Whatsapp"
            active={active === "whatsapp"}
            onClick={() => setActive("whatsapp")}
          />
          <ChannelItem
            logo={InstagramLogo}
            label="Instagram"
            badge
            active={active === "instagram"}
            onClick={() => setActive("instagram")}
          />
          <ChannelItem
            logo={LinkedinLogo}
            label="Linkedin"
            active={active === "linkedin"}
            onClick={() => setActive("linkedin")}
          />
        </Section>

        <Section
          label="Marketing"
          icon={Megaphone}
          open={openSection === "MARKETING"}
          onToggle={sectionToggle("MARKETING")}
        >
          <SubItem
            icon={Megaphone}
            label="Campaigns"
            active={active === "campaigns"}
            onClick={() => setActive("campaigns")}
          />
          <SubItem
            icon={Share2}
            label="Ads"
            active={active === "ads"}
            onClick={() => setActive("ads")}
          />
          <SubItem
            icon={Share2}
            label="Social Posts"
            active={active === "social-media-posts"}
            onClick={() => setActive("social-media-posts")}
          />
          <SubItem
            icon={FileText}
            label="WhatsApp Flows"
            badge="new"
            active={active === "flows"}
            onClick={() => setActive("flows")}
          />
        </Section>

        <NavItem
          icon={Workflow}
          label="Automations"
          active={active === "automations"}
          onClick={() => setActive("automations")}
        />

        <Section
          label="CRM"
          icon={Users}
          open={openSection === "CRM"}
          onToggle={sectionToggle("CRM")}
        >
          <SubItem
            icon={Users}
            label="Customers"
            active={CRM_TAB_IDS.includes(active) && active !== "tickets"}
            onClick={() => setActive("customers")}
          />
          <SubItem
            icon={Ticket}
            label="Tickets"
            active={active === "tickets"}
            onClick={() => setActive("tickets")}
          />
          <SubItem
            icon={CalendarCheck}
            label="Appointments"
            active={active === "appointments"}
            onClick={() => setActive("appointments")}
          />
        </Section>

        <Section
          label="Commerce"
          icon={ShoppingBag}
          open={openSection === "COMMERCE"}
          onToggle={sectionToggle("COMMERCE")}
        >
          <SubItem
            icon={ShoppingBag}
            label="E-commerce"
            active={active === "ecommerce"}
            onClick={() => setActive("ecommerce")}
          />
          <SubItem
            icon={Database}
            label="Data Store"
            badge="new"
            active={active === "data-store"}
            onClick={() => setActive("data-store")}
          />
        </Section>

        <Section
          label="AI"
          icon={Bot}
          open={openSection === "AI"}
          onToggle={sectionToggle("AI")}
        >
          <SubItem
            icon={Bot}
            label="AI Agents"
            active={active === "ai-agents"}
            onClick={() => setActive("ai-agents")}
          />
          <SubItem
            icon={MessagesSquare}
            label="Live Chat"
            active={active === "live-chat"}
            onClick={() => setActive("live-chat")}
          />
          <SubItem
            icon={WhatsappLogo}
            label="WhatsApp AI Agent"
            active={active === "whatsapp-ai-agent"}
            onClick={() => setActive("whatsapp-ai-agent")}
          />
        </Section>

        <Section
          label="Insights"
          icon={BarChart3}
          open={openSection === "INSIGHTS"}
          onToggle={sectionToggle("INSIGHTS")}
        >
          <SubItem
            icon={FileBarChart2}
            label="Reports"
            active={active === "reports"}
            onClick={() => setActive("reports")}
          />
          <SubItem
            icon={Sparkles}
            label="AI"
            badge="beta"
            active={active === "ai"}
            onClick={() => setActive("ai")}
          />
        </Section>

        <NavItem
          icon={Plug}
          label="Integrations"
          active={active === "integrations"}
          onClick={() => setActive("integrations")}
        />

        <Section
          label="Organization"
          icon={Building2}
          open={openSection === "ORGANIZATION"}
          onToggle={sectionToggle("ORGANIZATION")}
        >
          <SubItem
            icon={Users}
            label="Team Management"
            active={active === "team-management"}
            onClick={() => setActive("team-management")}
          />
        </Section>
      </nav>

      {/* Bottom */}
      <div className="shrink-0 pl-[10px] pr-[8px] pb-3 pt-2">
        <PlanCard />

        <div className="relative mt-3">
          <ProfilePanel
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            triggerRef={profileTriggerRef}
          />
          <NotificationPanel
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            triggerRef={notificationTriggerRef}
          />

          <div
            ref={profileTriggerRef}
            className={[
              "group/profile-row flex h-[52px] w-full items-center gap-[8px] rounded-[10px] px-[10px] py-[8px]",
              "transition-colors duration-150 ease-out hover:bg-[#F2F2F2]",
            ].join(" ")}
          >
            <button
              type="button"
              onClick={() => { setNotificationsOpen(false); setProfileOpen((v) => !v); }}
              aria-label="Open profile menu"
              className={[
                "flex min-w-0 flex-1 items-center gap-[8px] rounded-[8px] text-left",
                "focus:outline-none focus-visible:shadow-focus",
              ].join(" ")}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[12px] font-semibold text-brand-emerald">
                RS
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium leading-tight text-[#222222]">
                  Raghav S
                </div>
                <div className="truncate text-[12px] leading-tight text-[#6A6A6A]">
                  Free plan
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setNotificationsOpen(false); setProfileOpen((v) => !v); }}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              aria-controls="profile-panel"
              aria-label={profileOpen ? "Close profile menu" : "Open profile menu"}
              className={[
                "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]",
                "text-[#929292] transition-colors duration-150 ease-out",
                "hover:bg-white hover:text-[#3F3F3F]",
                "focus:outline-none focus-visible:shadow-focus",
              ].join(" ")}
            >
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={[
                  "transition-transform duration-200 ease-out",
                  profileOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
                aria-hidden="true"
              />
            </button>

            <button
              ref={notificationTriggerRef}
              type="button"
              onClick={handleNotifications}
              aria-haspopup="menu"
              aria-expanded={notificationsOpen}
              aria-controls="notification-panel"
              aria-label="Notifications"
              className={[
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]",
                "transition-opacity duration-150 ease-out hover:opacity-80",
                "focus:outline-none focus-visible:shadow-focus",
              ].join(" ")}
            >
              <img
                src={notificationIcon}
                alt=""
                aria-hidden="true"
                className="h-9 w-9"
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

import { useState } from "react";
import InboxLayout from "./inbox/InboxLayout.jsx";
import ConversationList from "./inbox/ConversationList.jsx";
import ChatHeader from "./inbox/ChatHeader.jsx";
import ChatStream from "./inbox/ChatStream.jsx";
import AutomationFooter from "./inbox/AutomationFooter.jsx";
import MessageComposerFooter from "./inbox/MessageComposerFooter.jsx";
import ScheduleMessageDrawer from "./schedule/ScheduleMessageDrawer.jsx";

const CONVERSATIONS = [
  { id: "c-1",  name: "Pedhababu",     preview: "Hello! I filled out your form and would like to kn...", time: "2hr ago", unread: false, palette: "coral" },
  { id: "c-2",  name: "Anita Sharma",  preview: "Thanks for the quick response on my last query.",       time: "2hr ago", unread: false, palette: "pink",  selected: true },
  { id: "c-3",  name: "Rahul Verma",   preview: "Can you share the invoice for last month?",             time: "2hr ago", unread: true,  palette: "blue" },
  { id: "c-4",  name: "Sneha Iyer",    preview: "Hello! I filled out your form and would like to kn...", time: "2hr ago", unread: false, palette: "green" },
  { id: "c-5",  name: "Karthik Rao",   preview: "When can I expect the next campaign update?",           time: "2hr ago", unread: false, palette: "coral" },
  { id: "c-6",  name: "Priya Menon",   preview: "Hello! I filled out your form and would like ...",      time: "2hr ago", unread: true,  palette: "pink" },
  { id: "c-7",  name: "Manoj Pillai",  preview: "Got it. I'll wait for your confirmation.",              time: "2hr ago", unread: false, palette: "blue" },
  { id: "c-8",  name: "Divya Nair",    preview: "Hello! I filled out your form and would like to kn...", time: "2hr ago", unread: false, palette: "green" },
  { id: "c-9",  name: "Suresh Kumar",  preview: "Can we schedule a call this week?",                     time: "2hr ago", unread: false, palette: "green" },
  { id: "c-10", name: "Lakshmi R",     preview: "Hello! I filled out your form and would like to kn...", time: "2hr ago", unread: false, palette: "coral" },
  { id: "c-11", name: "Vikram Shetty", preview: "Yes, please proceed with the order.",                   time: "2hr ago", unread: false, palette: "pink" },
  { id: "c-12", name: "Ananya Gupta",  preview: "Hello! I filled out your form and would like to kn...", time: "2hr ago", unread: false, palette: "blue" },
];

const MESSAGES = [
  { id: "m1", from: "in",  text: "Hey! I wanted to ask about my order #ORD-2847. Can I get it delivered tomorrow instead?", time: "12:30 PM" },
  { id: "m2", from: "out", text: "Hey! I wanted to ask about my order #ORD-2847. Can I get it delivered tomorrow instead?", time: "12:30 PM" },
  { id: "m3", from: "in",  text: "Great, thanks! Also, will there be any extra charge for express delivery?", time: "12:30 PM" },
  { id: "m4", from: "out", text: "Your order is eligible for free rescheduling within 24 hours. No extra charge at all!", time: "12:30 PM" },
  { id: "m5a", from: "in", text: "That's awesome! Can you confirm the delivery slot?", time: "12:30 PM" },
  { id: "m5b", from: "in", text: "I'm available between 2–5 PM tomorrow", time: "12:30 PM" },
  { id: "m6", from: "out", text: "Confirmed! Your order #ORD-2847 will arrive tomorrow between 2–5 PM. You'll get a tracking link shortly.", time: "12:30 PM" },
  { id: "m7", from: "in",  text: "Can I reschedule my order for tomorrow?", time: "12:30 PM" },
];

export default function ChatPage() {
  const defaultId = CONVERSATIONS.find((c) => c.selected)?.id ?? CONVERSATIONS[0].id;
  const [activeId, setActiveId] = useState(defaultId);
  const [footerMode, setFooterMode] = useState("automation");
  const [popover, setPopover] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const active = CONVERSATIONS.find((c) => c.id === activeId) ?? CONVERSATIONS[0];

  return (
    <InboxLayout
      left={
        <ConversationList
          conversations={CONVERSATIONS}
          activeId={activeId}
          onSelect={setActiveId}
        />
      }
      right={
        <>
          <ChatHeader
            contact={{
              name: active.name,
              phone: "+91 98765 43210",
              palette: active.palette,
            }}
            popover={popover}
            onTogglePopover={setPopover}
          />
          <ChatStream messages={MESSAGES} dateLabel="Today" />
          {footerMode === "automation" ? (
            <AutomationFooter onTakeOver={() => setFooterMode("composer")} />
          ) : (
            <>
              <MessageComposerFooter
                mode={footerMode}
                onModeChange={setFooterMode}
                onSchedule={() => setScheduleOpen(true)}
              />
              <ScheduleMessageDrawer
                open={scheduleOpen}
                onClose={() => setScheduleOpen(false)}
              />
            </>
          )}
        </>
      }
    />
  );
}

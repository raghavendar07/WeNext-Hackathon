import { useRef, useState } from "react";
import { PanelLeft } from "lucide-react";
import GradientHeading from "./GradientHeading.jsx";
import SuggestionChip from "./SuggestionChip.jsx";
import AIPromptCard from "./AIPromptCard.jsx";
import CampaignsHistorySidebar from "./CampaignsHistorySidebar.jsx";
import PromptLibraryOverlay from "./PromptLibraryOverlay.jsx";
import AIChatLayout from "./chat/AIChatLayout.jsx";

const SUGGESTIONS = [
  { id: "diwali",    emoji: "🪔", label: "Diwali Sale",       starter: "Diwali sale 25% off new collection — Write a warm Diwali greeting for my customers from {{business}}. Personal, heartfelt opening. Then mention our special {{discount}} offer on {{product_category}}. Include a shop link and set urgency with {{expiry_date}}." },
  { id: "arrivals",  emoji: "✨", label: "New Arrivals",      starter: "Announce new arrivals at {{business}}. Highlight 2-3 products and include a clear CTA to shop." },
  { id: "winback",   emoji: "✉️", label: "Win-back Message",  starter: "Write a friendly win-back message for customers who haven't ordered in {{months}} months. Offer {{incentive}}." },
  { id: "festival",  emoji: "👋", label: "Festival Greeting", starter: "Write a warm {{festival}} greeting for {{business}}. Keep it short and heartfelt." },
];

const TEMPLATE_OPTIONS = [
  { id: "min", label: "Minimalism",   tone: "warning" },
  { id: "bru", label: "Brutalism",    tone: "violet" },
  { id: "sku", label: "Skeumorphism", tone: "info" },
];

const FONT_CHIPS = [
  { id: "inter",   label: "Inter",   tone: "info" },
  { id: "lato",    label: "Lato",    tone: "warning" },
  { id: "roboto",  label: "Roboto",  tone: "brand" },
];

let nextId = 1;
const newId = () => `msg-${nextId++}`;

function aiResponseForPrompt() {
  return {
    id: newId(),
    role: "assistant",
    blocks: [
      { type: "text", text: "Got it — here's a first take. Pick a visual style and I'll tailor the message:" },
      { type: "template-carousel", templates: TEMPLATE_OPTIONS },
      { type: "text", text: "Tap a card to lock in the direction." },
    ],
    createdAt: new Date().toISOString(),
  };
}

function aiResponseForStyle(style) {
  return {
    id: newId(),
    role: "assistant",
    blocks: [
      { type: "text", text: `${style.label} it is. Pick a font that matches the vibe:` },
      { type: "suggestion-chips", chips: FONT_CHIPS },
    ],
    createdAt: new Date().toISOString(),
  };
}

function aiResponseForChip(chip) {
  return {
    id: newId(),
    role: "assistant",
    blocks: [
      { type: "text", text: `Locked in ${chip.label}. I'll draft the final message and prep a preview — ready to review when you are.` },
    ],
    createdAt: new Date().toISOString(),
  };
}

export default function AIComposeStep({ onSubmit }) {
  const [prompt, setPrompt] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeHistoryId, setActiveHistoryId] = useState(null);
  const [historyQuery, setHistoryQuery] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const composeRef = useRef(null);

  const inChat = messages.length > 0;

  const handleSuggestion = (s) => {
    setPrompt(s.starter);
  };

  const handlePickFromLibrary = (libraryPrompt) => {
    setPrompt(libraryPrompt.body);
    setLibraryOpen(false);
  };

  const handleNewCampaign = () => {
    setPrompt("");
    setMessages([]);
    setActiveHistoryId(null);
  };

  const submitPrompt = () => {
    if (!prompt.trim()) return;
    const userMsg = {
      id: newId(),
      role: "user",
      blocks: [{ type: "text", text: prompt }],
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setPrompt("");
    setIsStreaming(true);
    setTimeout(() => {
      setMessages((m) => [...m, aiResponseForPrompt()]);
      setIsStreaming(false);
    }, 350);
  };

  const handlePickTemplate = (style) => {
    const userMsg = {
      id: newId(),
      role: "user",
      blocks: [{ type: "text", text: `Use the ${style.label} style.` }],
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setIsStreaming(true);
    setTimeout(() => {
      setMessages((m) => [...m, aiResponseForStyle(style)]);
      setIsStreaming(false);
    }, 350);
  };

  const handlePickChip = (chip) => {
    const userMsg = {
      id: newId(),
      role: "user",
      blocks: [{ type: "text", text: `Use ${chip.label}.` }],
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setIsStreaming(true);
    setTimeout(() => {
      setMessages((m) => [...m, aiResponseForChip(chip)]);
      setIsStreaming(false);
    }, 350);
  };

  if (inChat) {
    return (
      <div ref={composeRef} className="relative h-full w-full bg-canvas">
        {!sidebarOpen && (
          <button
            type="button"
            aria-label="Open campaigns history"
            aria-pressed={false}
            onClick={() => setSidebarOpen(true)}
            className="absolute left-5 top-5 z-10 inline-flex h-[30px] w-[30px] items-center justify-center rounded-xs text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink-heading"
          >
            <PanelLeft size={20} strokeWidth={1.75} />
          </button>
        )}

        <div className="flex h-full gap-6 px-6 py-6">
          {sidebarOpen && (
            <CampaignsHistorySidebar
              activeId={activeHistoryId}
              onSelect={setActiveHistoryId}
              onNewCampaign={handleNewCampaign}
              onCollapse={() => setSidebarOpen(false)}
              query={historyQuery}
              onQueryChange={setHistoryQuery}
            />
          )}

          <div className="min-w-0 flex-1 overflow-hidden rounded-md border border-line bg-white">
            <AIChatLayout
              messages={messages}
              isStreaming={isStreaming}
              composerValue={prompt}
              onComposerChange={setPrompt}
              onSubmit={submitPrompt}
              onAttach={() => alert('Attach mock')}
              onPromptLibrary={() => setLibraryOpen(true)}
              isListening={isListening}
              onToggleVoice={() => setIsListening((v) => !v)}
              onPickTemplate={handlePickTemplate}
              onPickChip={handlePickChip}
              onBack={handleNewCampaign}
            />
          </div>
        </div>

        <PromptLibraryOverlay
          open={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          onPick={handlePickFromLibrary}
        />
      </div>
    );
  }

  return (
    <div ref={composeRef} className="relative h-full w-full bg-canvas">
      {!sidebarOpen && (
        <button
          type="button"
          aria-label="Open campaigns history"
          aria-pressed={false}
          onClick={() => setSidebarOpen(true)}
          className="absolute left-5 top-5 z-10 inline-flex h-[30px] w-[30px] items-center justify-center rounded-xs text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink-heading"
        >
          <PanelLeft size={20} strokeWidth={1.75} />
        </button>
      )}

      <div className="flex h-full gap-6 px-6 py-6">
        {sidebarOpen && (
          <CampaignsHistorySidebar
            activeId={activeHistoryId}
            onSelect={setActiveHistoryId}
            onNewCampaign={handleNewCampaign}
            onCollapse={() => setSidebarOpen(false)}
            query={historyQuery}
            onQueryChange={setHistoryQuery}
          />
        )}

        <div className="flex min-w-0 flex-1 items-center justify-center">
          <div className="flex w-full max-w-[800px] flex-col gap-12">
            <GradientHeading
              topLine="Hi, good to see you!"
              gradientLine="What should we send today?"
            />

            <div className="flex flex-col gap-5">
              <div className="flex items-stretch gap-4">
                {SUGGESTIONS.map((s) => (
                  <SuggestionChip
                    key={s.id}
                    emoji={s.emoji}
                    label={s.label}
                    onClick={() => handleSuggestion(s)}
                  />
                ))}
              </div>

              <AIPromptCard
                value={prompt}
                onChange={setPrompt}
                onSubmit={submitPrompt}
                onAttach={() => alert('Attach mock')}
                onPromptLibrary={() => setLibraryOpen(true)}
                isListening={isListening}
                onToggleVoice={() => setIsListening((v) => !v)}
              />
            </div>
          </div>
        </div>
      </div>

      <PromptLibraryOverlay
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onPick={handlePickFromLibrary}
      />
    </div>
  );
}

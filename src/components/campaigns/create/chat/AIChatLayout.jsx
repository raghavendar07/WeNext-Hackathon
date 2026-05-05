import { useEffect, useRef } from "react";
import ChatTopBar from "./ChatTopBar.jsx";
import UserMessageBubble from "./UserMessageBubble.jsx";
import AIMessageCard from "./AIMessageCard.jsx";
import StickyComposer from "./StickyComposer.jsx";

export default function AIChatLayout({
  messages,
  isStreaming,
  composerValue,
  onComposerChange,
  onSubmit,
  onAttach,
  onPromptLibrary,
  isListening,
  onToggleVoice,
  onPickTemplate,
  onPickChip,
  onBack,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, isStreaming]);

  return (
    <div className="flex h-full w-full flex-col bg-canvas">
      <ChatTopBar onBack={onBack} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-5">
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-7">
          {messages.map((m, idx) =>
            m.role === "user" ? (
              <UserMessageBubble key={m.id} text={m.blocks[0]?.text ?? ""} />
            ) : (
              <AIMessageCard
                key={m.id}
                blocks={m.blocks}
                isStreaming={isStreaming && idx === messages.length - 1}
                onPickTemplate={onPickTemplate}
                onPickChip={onPickChip}
              />
            ),
          )}
        </div>
      </div>

      <StickyComposer
        value={composerValue}
        onChange={onComposerChange}
        onSubmit={onSubmit}
        onAttach={onAttach}
        onPromptLibrary={onPromptLibrary}
        isListening={isListening}
        onToggleVoice={onToggleVoice}
      />
    </div>
  );
}

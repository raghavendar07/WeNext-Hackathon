import AIPromptCard from "../AIPromptCard.jsx";

export default function StickyComposer({
  value,
  onChange,
  onSubmit,
  onAttach,
  onPromptLibrary,
  isListening,
  onToggleVoice,
}) {
  return (
    <div className="sticky bottom-0 border-t border-line bg-white px-5 py-3">
      <AIPromptCard
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        onAttach={onAttach}
        onPromptLibrary={onPromptLibrary}
        isListening={isListening}
        onToggleVoice={onToggleVoice}
      />
    </div>
  );
}

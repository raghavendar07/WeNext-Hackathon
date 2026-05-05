import VariableTokenText from "../VariableTokenText.jsx";

export default function UserMessageBubble({ text }) {
  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[70%] rounded-pill bg-surface-muted px-4 py-2.5 text-[14px] font-medium text-ink-heading">
        <VariableTokenText text={text} />
      </div>
    </div>
  );
}

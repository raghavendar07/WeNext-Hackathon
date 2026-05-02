import askAiIcon from "../assets/ask-ai.svg";

export default function AskAIButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-[5px] rounded-[46px] px-[15px] py-[10px]",
        "bg-cta-gradient text-white",
        "shadow-[0_0_10px_rgba(1,170,154,0.5)]",
        "transition-opacity duration-150 ease-out hover:opacity-95",
        "focus:outline-none focus-visible:shadow-focus",
      ].join(" ")}
    >
      <img
        src={askAiIcon}
        alt=""
        aria-hidden="true"
        className="h-[16px] w-[15.273px]"
      />
      <span className="text-[14px] font-medium leading-none">Ask AI</span>
    </button>
  );
}

import Sidebar from "./Sidebar.jsx";
import AskAIButton from "./AskAIButton.jsx";

export default function MainLayout({
  children,
  active,
  onActiveChange,
  flush = false,
}) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Sidebar active={active} onActiveChange={onActiveChange} />
      <div
        className={[
          "relative ml-[260px] h-screen bg-[#F5F5F5]",
          flush ? "" : "p-[12px]",
        ].join(" ")}
      >
        <main
          className={[
            "h-full overflow-hidden",
            flush
              ? ""
              : "overflow-y-auto rounded-[12px] border border-[#DADADA] bg-white p-6",
          ].join(" ")}
        >
          {children}
        </main>
        <div className="pointer-events-none absolute bottom-6 right-6 z-10">
          <div className="pointer-events-auto">
            <AskAIButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainContent({ children }) {
  return (
    <main
      className="ml-[260px] mt-14 h-[calc(100vh-56px)] overflow-y-auto bg-[#FAFAFA] p-6"
      role="main"
    >
      {children}
    </main>
  );
}

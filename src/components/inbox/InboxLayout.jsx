export default function InboxLayout({ left, right }) {
  return (
    <div className="flex h-full items-stretch gap-5 p-5">
      <aside className="flex w-[360px] shrink-0 flex-col overflow-hidden rounded-lg border border-line bg-white">
        {left}
      </aside>
      <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-line bg-white">
        {right}
      </section>
    </div>
  );
}

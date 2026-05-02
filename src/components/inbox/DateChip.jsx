export default function DateChip({ children }) {
  return (
    <div className="flex justify-center">
      <span
        className="rounded-[4px] border border-[#F0F2F5] bg-white px-2 py-[5px] text-[12px] font-medium"
        style={{ color: "#353735" }}
      >
        {children}
      </span>
    </div>
  );
}

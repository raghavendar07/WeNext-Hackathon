export default function GradientHeading({ topLine, gradientLine }) {
  return (
    <h1 className="text-center text-[44px] font-semibold leading-tight tracking-tight">
      <span className="block text-ink-heading">{topLine}</span>
      <span
        className="block bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(110deg, #01AA9A 0%, #1EB677 100%)",
        }}
      >
        {gradientLine}
      </span>
    </h1>
  );
}

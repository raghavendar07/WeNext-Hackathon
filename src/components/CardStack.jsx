import { motion } from "framer-motion";

const STACK_OFFSET = 10;
const STACK_SCALE_STEP = 0.03;
const EXIT_Y = -20;

export default function CardStack({ cards, step }) {
  return (
    <div className="relative w-full">
      {cards.map((card, index) => {
        const position = index - step;
        const total = cards.length;
        const state = positionToState(position, total);
        return (
          <motion.div
            key={card.key ?? index}
            initial={false}
            animate={state}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: index === 0 ? "relative" : "absolute",
              inset: index === 0 ? undefined : 0,
              transformOrigin: "top center",
              zIndex: total - Math.max(position, 0),
              pointerEvents: position === 0 ? "auto" : "none",
            }}
          >
            {card.content}
          </motion.div>
        );
      })}
    </div>
  );
}

function positionToState(position, total) {
  if (position < 0) {
    return { y: EXIT_Y, scale: 1, opacity: 0 };
  }
  if (position >= total) {
    return { y: 0, scale: 1, opacity: 0 };
  }
  return {
    y: position * STACK_OFFSET,
    scale: 1 - position * STACK_SCALE_STEP,
    opacity: 1,
  };
}

// app/game/components/CurrentPhonemes.tsx

import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface Phoneme {
  row: number;
  col: number;
  letter: string;
}

interface CurrentPhonemesProps {
  path: Phoneme[];
}

const CurrentPhonemes: React.FC<CurrentPhonemesProps> = ({ path }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden whitespace-nowrap">
      <AnimatePresence>
        {path.map((t, idx) => (
          <motion.span
            key={idx + t.letter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="inline-block rounded text-2xl font-bold"
          >
            {t.letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CurrentPhonemes;

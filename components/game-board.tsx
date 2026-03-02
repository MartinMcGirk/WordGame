"use client";

import { LetterCell } from "./letter-cell";

interface GameBoardProps {
  letters: string;
  onLetterClick: (letter: string) => void;
}

export function GameBoard({ letters, onLetterClick }: GameBoardProps) {
  return (
    <div className="w-full max-w-[280px] grid grid-cols-3 gap-2 sm:gap-3">
      {letters.split("").map((letter, idx) => (
        <LetterCell
          key={idx}
          letter={letter}
          isCenter={idx === 4}
          onClick={onLetterClick}
        />
      ))}
    </div>
  );
}

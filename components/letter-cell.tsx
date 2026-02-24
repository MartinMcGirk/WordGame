"use client";

interface LetterCellProps {
  letter: string;
  isCenter: boolean;
  onClick: (letter: string) => void;
}

export function LetterCell({ letter, isCenter, onClick }: LetterCellProps) {
  return (
    <button
      onClick={() => onClick(letter)}
      className={`
        flex items-center justify-center
        w-16 h-16 sm:w-20 sm:h-20
        text-2xl sm:text-3xl font-bold uppercase
        border-2 rounded-lg
        transition-colors duration-150
        cursor-pointer select-none
        ${
          isCenter
            ? "bg-amber-200 border-amber-500 text-amber-900 hover:bg-amber-300"
            : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
        }
      `}
    >
      {letter}
    </button>
  );
}

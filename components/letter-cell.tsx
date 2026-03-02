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
        w-full aspect-square
        text-2xl sm:text-3xl font-bold uppercase
        border-2 rounded-lg
        transition-all duration-150
        cursor-pointer select-none
        active:scale-95
        ${
          isCenter
            ? "bg-amber-200 border-amber-500 text-amber-900 hover:bg-amber-300 active:bg-amber-300"
            : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100 active:bg-gray-200"
        }
      `}
    >
      {letter}
    </button>
  );
}

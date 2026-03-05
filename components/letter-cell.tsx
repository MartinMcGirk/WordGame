"use client";

interface LetterCellProps {
  letter: string;
  isCenter: boolean;
  used: boolean;
  onClick: () => void;
}

export function LetterCell({ letter, isCenter, used, onClick }: LetterCellProps) {
  return (
    <button
      onClick={onClick}
      disabled={used}
      className={`
        flex items-center justify-center
        w-full aspect-square
        text-2xl sm:text-3xl font-bold uppercase
        border-2 rounded-lg
        transition-all duration-150
        select-none
        ${
          used
            ? "bg-gray-100 border-gray-200 text-gray-300 cursor-default"
            : isCenter
              ? "bg-amber-200 border-amber-500 text-amber-900 hover:bg-amber-300 active:bg-amber-300 active:scale-95 cursor-pointer"
              : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100 active:bg-gray-200 active:scale-95 cursor-pointer"
        }
      `}
    >
      {letter}
    </button>
  );
}

"use client";

interface FoundWordListProps {
  words: string[];
  totalWords: number;
}

export function FoundWordList({ words, totalWords }: FoundWordListProps) {
  const sorted = [...words].sort();

  return (
    <div className="w-full max-w-xs">
      <h3 className="text-sm font-medium text-gray-500 mb-2">
        Found: {words.length} / {totalWords}
      </h3>
      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
        {sorted.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center">
            No words found yet
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {sorted.map((word) => (
              <span
                key={word}
                className={`
                  inline-block px-2 py-1 text-xs rounded-md font-mono uppercase
                  ${
                    word.length === 9
                      ? "bg-amber-100 text-amber-800 font-bold"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {word}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

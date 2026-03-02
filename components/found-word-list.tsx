"use client";

interface FoundWordListProps {
  foundWords: string[];
  totalWords: number;
  allWords?: string[];
}

export function FoundWordList({
  foundWords,
  totalWords,
  allWords,
}: FoundWordListProps) {
  const foundSet = new Set(foundWords);

  // If revealed, show all words; otherwise show only found words
  const displayWords = allWords
    ? [...allWords].sort()
    : [...foundWords].sort();

  return (
    <div className="w-full max-w-xs">
      <h3 className="text-sm font-medium text-gray-500 mb-2">
        {allWords
          ? `Found ${foundWords.length} of ${totalWords} words`
          : `Found: ${foundWords.length} / ${totalWords}`}
      </h3>
      <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-lg p-3">
        {displayWords.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center">
            No words found yet
          </p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {displayWords.map((word) => {
              const wasFound = foundSet.has(word);
              const isNineLetter = word.length === 9;

              if (allWords) {
                // Revealed mode: show all words, tick the found ones
                return (
                  <span
                    key={word}
                    className={`
                      inline-flex items-center gap-0.5 px-2 py-1 text-xs rounded-md font-mono uppercase
                      ${
                        isNineLetter
                          ? wasFound
                            ? "bg-amber-100 text-amber-800 font-bold"
                            : "bg-amber-50 text-amber-600"
                          : wasFound
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-400"
                      }
                    `}
                  >
                    {wasFound && (
                      <svg
                        className="w-3 h-3 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {word}
                  </span>
                );
              }

              // Normal mode: only show found words
              return (
                <span
                  key={word}
                  className={`
                    inline-block px-2 py-1 text-xs rounded-md font-mono uppercase
                    ${
                      isNineLetter
                        ? "bg-amber-100 text-amber-800 font-bold"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {word}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

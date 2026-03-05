"use client";

import { useRef, useEffect } from "react";

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
  const prevCount = useRef(foundWords.length);

  // Track which words are "new" for animation
  const newWordCount = foundWords.length - prevCount.current;
  useEffect(() => {
    prevCount.current = foundWords.length;
  }, [foundWords.length]);

  // If revealed, show all words; otherwise show only found words
  const displayWords = allWords
    ? [...allWords].sort()
    : [...foundWords].sort();

  // In normal mode, figure out which word was just added
  const sortedFound = [...foundWords].sort();
  const latestNewWords = newWordCount > 0
    ? new Set(sortedFound.slice(-newWordCount))
    : new Set<string>();

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between border-t border-gray-200 pt-3 mb-2">
        <h3 className="text-sm font-medium text-gray-500">
          {allWords
            ? `Found ${foundWords.length} of ${totalWords}`
            : `Found: ${foundWords.length} / ${totalWords}`}
        </h3>
      </div>
      <div className="relative">
        <div className="max-h-80 overflow-y-auto scrollbar-hidden" style={{ scrollbarWidth: "none" }}>
          {displayWords.length === 0 ? (
            <p className="text-gray-400 text-sm italic text-center py-4">
              No words found yet
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {displayWords.map((word) => {
                const wasFound = foundSet.has(word);
                const isNineLetter = word.length === 9;
                const isNew = !allWords && latestNewWords.has(word);

                if (allWords) {
                  return (
                    <span
                      key={word}
                      className={`
                        inline-flex items-center gap-1 px-2 py-1.5 text-xs rounded-md font-mono uppercase
                        ${
                          isNineLetter
                            ? wasFound
                              ? "bg-amber-100 text-amber-800 font-bold"
                              : "bg-amber-50 text-amber-600"
                            : wasFound
                              ? "bg-green-50 text-green-800"
                              : "bg-gray-50 text-gray-400"
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

                return (
                  <span
                    key={word}
                    className={`
                      inline-block px-2 py-1.5 text-xs rounded-md font-mono uppercase
                      ${
                        isNineLetter
                          ? "bg-amber-100 text-amber-800 font-bold"
                          : "bg-gray-100 text-gray-700"
                      }
                    `}
                    style={isNew ? { animation: "slide-in 0.3s ease-out" } : undefined}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

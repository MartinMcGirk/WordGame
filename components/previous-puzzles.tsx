"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRating } from "@/lib/types";

interface PuzzleEntry {
  date: string;
  index: number;
  totalWords: number;
}

interface PreviousPuzzlesProps {
  puzzles: PuzzleEntry[];
}

interface PuzzleProgress {
  found: number;
  total: number;
  completed: boolean;
}

export function PreviousPuzzles({ puzzles }: PreviousPuzzlesProps) {
  const [progress, setProgress] = useState<Map<number, PuzzleProgress>>(
    new Map()
  );

  useEffect(() => {
    const map = new Map<number, PuzzleProgress>();
    for (const p of puzzles) {
      const saved = localStorage.getItem(`word-game-progress-${p.index}`);
      const gaveUp = localStorage.getItem(`word-game-giveup-${p.index}`);
      let found = 0;
      if (saved) {
        try {
          found = JSON.parse(saved).length;
        } catch {
          // ignore
        }
      }
      const completed = !!gaveUp || found >= p.totalWords;
      map.set(p.index, { found, total: p.totalWords, completed });
    }
    setProgress(map);
  }, [puzzles]);

  return (
    <section className="w-full max-w-md px-4 pt-8 pb-12">
      <h2 className="text-sm font-medium text-gray-500 mb-3">
        Previous puzzles
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {puzzles.map(({ date, index, totalWords }) => {
          const d = new Date(date + "T00:00:00");
          const dayNum = d.getDate();
          const month = d.toLocaleDateString("en-AU", { month: "short" });
          const weekday = d.toLocaleDateString("en-AU", {
            weekday: "short",
          });

          const p = progress.get(index);
          const completed = p?.completed ?? false;
          const found = p?.found ?? 0;

          return (
            <Link
              key={date}
              href={`/puzzle/${date}`}
              className={`flex flex-col items-center py-2 px-1 border rounded-lg
                         hover:border-amber-400 hover:bg-amber-50
                         transition-colors text-center
                         ${completed ? "border-green-300 bg-green-50" : "border-gray-200"}`}
            >
              <span className="text-[10px] text-gray-400 uppercase">
                {weekday}
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {dayNum}
              </span>
              <span className="text-[10px] text-gray-400">{month}</span>
              {found > 0 && (
                <span
                  className={`text-[10px] mt-0.5 font-medium ${
                    completed ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {getRating(found, totalWords)}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { getRating } from "@/lib/types";

interface ScoreBoardProps {
  found: number;
  total: number;
}

export function ScoreBoard({ found, total }: ScoreBoardProps) {
  const pct = total > 0 ? (found / total) * 100 : 0;
  const rating = getRating(found, total);

  const thresholds = [
    { label: "Good", pct: 30 },
    { label: "Very Good", pct: 50 },
    { label: "Excellent", pct: 70 },
  ];

  return (
    <div className="w-full max-w-xs">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-lg font-semibold text-gray-800">{rating}</span>
        <span className="text-sm text-gray-500">
          {found} of {total} words
        </span>
      </div>
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-amber-500 rounded-full
                     transition-all duration-500 ease-out"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
        {thresholds.map((t) => (
          <div
            key={t.label}
            className="absolute top-0 h-full w-px bg-gray-400"
            style={{ left: `${t.pct}%` }}
            title={t.label}
          />
        ))}
      </div>
    </div>
  );
}

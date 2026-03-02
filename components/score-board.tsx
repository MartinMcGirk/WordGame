"use client";

import { useRef, useEffect } from "react";
import { getRating } from "@/lib/types";

interface ScoreBoardProps {
  found: number;
  total: number;
}

export function ScoreBoard({ found, total }: ScoreBoardProps) {
  const pct = total > 0 ? (found / total) * 100 : 0;
  const rating = getRating(found, total);
  const prevFound = useRef(found);

  const milestones = [
    { label: "Good", pct: 30, count: Math.ceil(total * 0.3) },
    { label: "Very Good", pct: 50, count: Math.ceil(total * 0.5) },
    { label: "Excellent", pct: 70, count: Math.ceil(total * 0.7) },
    { label: "Perfect", pct: 100, count: total },
  ];

  // Detect which milestones were just crossed this render
  const justReached = new Set<string>();
  for (const m of milestones) {
    if (found >= m.count && prevFound.current < m.count) {
      justReached.add(m.label);
    }
  }

  useEffect(() => {
    prevFound.current = found;
  }, [found]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-lg font-semibold text-gray-800">{rating}</span>
        <span className="text-sm text-gray-500">
          {found} of {total} words
        </span>
      </div>

      {/* Milestone circles */}
      <div className="relative h-8 mb-1">
        {milestones.map((m) => {
          const reached = found >= m.count;
          const popping = justReached.has(m.label);
          return (
            <div
              key={m.label}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${m.pct}%` }}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors duration-300 ${
                  reached
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
                style={popping ? { animation: "pop 0.4s ease-out" } : undefined}
              >
                {reached ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  m.count
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-gray-200 rounded-full">
        <div
          className="absolute left-0 top-0 h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
        {milestones.slice(0, 3).map((m) => (
          <div
            key={m.label}
            className="absolute top-0 h-full w-px bg-gray-400"
            style={{ left: `${m.pct}%` }}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useRef, useEffect, useState } from "react";
import { getRating } from "@/lib/types";

interface ScoreBoardProps {
  found: number;
  total: number;
}

const EMOJIS: Record<string, string> = {
  Good: "\uD83D\uDC4D",
  "Very Good": "\uD83D\uDD25",
  Excellent: "\u2B50",
  Perfect: "\uD83C\uDFC6",
};

export function ScoreBoard({ found, total }: ScoreBoardProps) {
  const pct = total > 0 ? (found / total) * 100 : 0;
  const rating = getRating(found, total);
  const prevFound = useRef(found);
  const [celebrating, setCelebrating] = useState<string | null>(null);
  const [fadingOut, setFadingOut] = useState(false);

  const milestones = [
    { label: "Good", pct: 30, count: Math.ceil(total * 0.3) },
    { label: "Very Good", pct: 50, count: Math.ceil(total * 0.5) },
    { label: "Excellent", pct: 70, count: Math.ceil(total * 0.7) },
    { label: "Perfect", pct: 100, count: total },
  ];

  // Detect which milestones were just crossed this render
  const justReached = new Set<string>();
  let highestJustReached: string | null = null;
  for (const m of milestones) {
    if (found >= m.count && prevFound.current < m.count) {
      justReached.add(m.label);
      highestJustReached = m.label;
    }
  }

  useEffect(() => {
    prevFound.current = found;
  }, [found]);

  // Trigger celebration when a milestone is crossed
  useEffect(() => {
    if (highestJustReached) {
      setCelebrating(highestJustReached);
      setFadingOut(false);

      const fadeTimer = setTimeout(() => setFadingOut(true), 1500);
      const clearTimer = setTimeout(() => {
        setCelebrating(null);
        setFadingOut(false);
      }, 2000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found]);

  return (
    <div className="w-full relative">
      {/* Normal progress display */}
      <div
        className="transition-opacity duration-300"
        style={{ opacity: celebrating ? 0 : 1 }}
      >
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

      {/* Celebration overlay */}
      {celebrating && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            animation: fadingOut
              ? "celebrate-out 0.5s ease-in forwards"
              : "celebrate-in 0.5s ease-out forwards",
          }}
        >
          <span className="text-3xl mb-1">{EMOJIS[celebrating]}</span>
          <span
            className="text-xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #d97706, #f59e0b, #fbbf24, #f59e0b, #d97706)",
              backgroundSize: "200% auto",
              animation: "shimmer 2s linear infinite",
            }}
          >
            {celebrating}!
          </span>
        </div>
      )}
    </div>
  );
}

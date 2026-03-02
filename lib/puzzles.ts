import puzzlesData from "@/data/puzzles.json";

export interface StoredPuzzle {
  letters: string;
  centerLetter: string;
  validWords: string[];
  nineLetterWord: string;
  totalWords: number;
}

const puzzles: StoredPuzzle[] = puzzlesData;

// Puzzles cycle from this start date
const START_DATE = new Date("2026-03-01T00:00:00");

function daysSince(date: Date): number {
  const diff = date.getTime() - START_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getPuzzleIndex(date: Date): number {
  const days = daysSince(date);
  return ((days % puzzles.length) + puzzles.length) % puzzles.length;
}

export function getPuzzleForDate(date: Date): StoredPuzzle & { index: number } {
  const index = getPuzzleIndex(date);
  return { ...puzzles[index], index };
}

export function getPuzzleByIndex(index: number): StoredPuzzle | undefined {
  if (index < 0 || index >= puzzles.length) return undefined;
  return puzzles[index];
}

export function getDateForPuzzleIndex(index: number): Date {
  const days = index;
  return new Date(START_DATE.getTime() + days * 1000 * 60 * 60 * 24);
}

export function getRecentPuzzleDates(count: number): string[] {
  const today = new Date();
  const dates: string[] = [];
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export const START_DATE_STR = "2026-03-01";

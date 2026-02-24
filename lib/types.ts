export interface PuzzleData {
  id: number;
  letters: string;
  centerLetter: string;
  totalWords: number;
  date: string;
}

export type Rating = "Keep trying" | "Good" | "Very Good" | "Excellent";

export function getRating(found: number, total: number): Rating {
  const pct = found / total;
  if (pct >= 0.7) return "Excellent";
  if (pct >= 0.5) return "Very Good";
  if (pct >= 0.3) return "Good";
  return "Keep trying";
}

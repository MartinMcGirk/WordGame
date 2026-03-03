import { getPuzzleForDate } from "@/lib/puzzles";
import { GameContainer } from "@/components/game-container";
import Link from "next/link";

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  const parsed = new Date(date + "T00:00:00");
  if (isNaN(parsed.getTime())) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-500 text-lg">Invalid date.</p>
        <Link href="/" className="text-amber-600 hover:underline mt-4">
          Back to today
        </Link>
      </main>
    );
  }

  const puzzle = getPuzzleForDate(parsed);

  const displayDate = parsed.toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="w-full max-w-md px-4 pt-4 pb-1 sm:pt-8 sm:pb-2">
        <div className="flex items-baseline justify-between sm:flex-col sm:items-center">
          <div className="flex items-baseline gap-2 sm:flex-col sm:items-center sm:gap-0">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Word Game
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 sm:mt-1">{displayDate}</p>
          </div>
          <Link
            href="/"
            className="text-xs sm:text-sm text-amber-600 hover:underline"
          >
            &larr; Today
          </Link>
        </div>
      </header>
      <GameContainer
        puzzle={{
          index: puzzle.index,
          letters: puzzle.letters,
          centerLetter: puzzle.centerLetter,
          totalWords: puzzle.totalWords,
        }}
      />
    </main>
  );
}

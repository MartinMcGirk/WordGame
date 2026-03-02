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
      <header className="w-full max-w-md text-center pt-8 pb-2">
        <Link
          href="/"
          className="text-sm text-amber-600 hover:underline"
        >
          &larr; Today&apos;s puzzle
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mt-2">
          Target Time
        </h1>
        <p className="text-sm text-gray-500 mt-1">{displayDate}</p>
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

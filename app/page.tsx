import { getPuzzleForDate, getRecentPuzzleDates } from "@/lib/puzzles";
import { GameContainer } from "@/components/game-container";
import { PreviousPuzzles } from "@/components/previous-puzzles";

export const dynamic = "force-dynamic";

export default function Home() {
  const puzzle = getPuzzleForDate(new Date());
  const recentDates = getRecentPuzzleDates(20);

  const recentPuzzles = recentDates.map((date) => {
    const d = new Date(date + "T00:00:00");
    const p = getPuzzleForDate(d);
    return {
      date,
      index: p.index,
      totalWords: p.totalWords,
    };
  });

  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="w-full max-w-md text-center pt-8 pb-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Target Time
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-AU", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>
      <GameContainer
        puzzle={{
          index: puzzle.index,
          letters: puzzle.letters,
          centerLetter: puzzle.centerLetter,
          totalWords: puzzle.totalWords,
        }}
      />
      <PreviousPuzzles puzzles={recentPuzzles} />
    </main>
  );
}

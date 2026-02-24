import { db } from "@/lib/db";
import { puzzles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { GameContainer } from "@/components/game-container";

export default async function Home() {
  const today = new Date().toISOString().split("T")[0];

  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.puzzleDate, today),
  });

  if (!puzzle) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Target Time</h1>
        <p className="text-gray-500 text-lg">No puzzle available for today.</p>
        <p className="text-gray-400 text-sm mt-2">
          Generate one with: <code className="bg-gray-100 px-2 py-1 rounded">npm run puzzle:generate</code>
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <header className="w-full max-w-md text-center pt-8 pb-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Target Time
        </h1>
        <p className="text-sm text-gray-500 mt-1">{puzzle.puzzleDate}</p>
      </header>
      <GameContainer
        puzzle={{
          id: puzzle.id,
          letters: puzzle.letters,
          centerLetter: puzzle.centerLetter,
          totalWords: puzzle.totalWords,
          date: puzzle.puzzleDate,
        }}
      />
    </main>
  );
}

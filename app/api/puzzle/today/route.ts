import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { puzzles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.puzzleDate, today),
  });

  if (!puzzle) {
    return NextResponse.json(
      { error: "No puzzle available for today" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: puzzle.id,
    letters: puzzle.letters,
    centerLetter: puzzle.centerLetter,
    totalWords: puzzle.totalWords,
    date: puzzle.puzzleDate,
  });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { puzzles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const puzzleId = parseInt(id, 10);
  if (isNaN(puzzleId)) {
    return NextResponse.json({ error: "Invalid puzzle ID" }, { status: 400 });
  }

  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId),
  });

  if (!puzzle) {
    return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: puzzle.id,
    letters: puzzle.letters,
    centerLetter: puzzle.centerLetter,
    totalWords: puzzle.totalWords,
    date: puzzle.puzzleDate,
  });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { puzzles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { puzzleId, word } = await request.json();

  if (!puzzleId || !word) {
    return NextResponse.json(
      { error: "puzzleId and word are required" },
      { status: 400 }
    );
  }

  const puzzle = await db.query.puzzles.findFirst({
    where: eq(puzzles.id, puzzleId),
  });

  if (!puzzle) {
    return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
  }

  const upperWord = word.toUpperCase().trim();
  const isValid = puzzle.validWords.includes(upperWord);

  return NextResponse.json({
    word: upperWord,
    valid: isValid,
  });
}

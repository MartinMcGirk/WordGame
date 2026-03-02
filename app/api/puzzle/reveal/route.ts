import { NextResponse } from "next/server";
import { getPuzzleByIndex } from "@/lib/puzzles";

export async function POST(request: Request) {
  const { puzzleIndex } = await request.json();

  if (puzzleIndex === undefined) {
    return NextResponse.json(
      { error: "puzzleIndex is required" },
      { status: 400 }
    );
  }

  const puzzle = getPuzzleByIndex(puzzleIndex);

  if (!puzzle) {
    return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
  }

  return NextResponse.json({
    validWords: puzzle.validWords,
    nineLetterWord: puzzle.nineLetterWord,
  });
}

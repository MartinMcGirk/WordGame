import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { puzzles } from "@/lib/db/schema";
import { loadDictionary } from "@/lib/dictionary";
import { generatePuzzle } from "@/lib/puzzle-generator";

export async function POST(request: Request) {
  const { date } = await request.json();

  if (!date) {
    return NextResponse.json(
      { error: "date is required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  const dictionary = loadDictionary();
  const puzzle = generatePuzzle(dictionary);

  const [inserted] = await db
    .insert(puzzles)
    .values({
      letters: puzzle.letters,
      centerLetter: puzzle.centerLetter,
      validWords: puzzle.validWords,
      nineLetterWord: puzzle.nineLetterWord,
      totalWords: puzzle.totalWords,
      puzzleDate: date,
    })
    .returning();

  return NextResponse.json({
    id: inserted.id,
    letters: inserted.letters,
    centerLetter: inserted.centerLetter,
    totalWords: inserted.totalWords,
    date: inserted.puzzleDate,
  });
}

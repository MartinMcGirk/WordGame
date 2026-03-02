import fs from "fs";
import path from "path";
import { loadDictionary } from "../lib/dictionary";
import { generatePuzzle } from "../lib/puzzle-generator";

const PUZZLE_COUNT = 360;

function main() {
  console.log(`Generating ${PUZZLE_COUNT} puzzles...`);

  const dictionary = loadDictionary();
  console.log(`Dictionary loaded: ${dictionary.size} words`);

  const puzzles = [];

  for (let i = 0; i < PUZZLE_COUNT; i++) {
    const puzzle = generatePuzzle(dictionary);
    puzzles.push({
      letters: puzzle.letters,
      centerLetter: puzzle.centerLetter,
      validWords: puzzle.validWords,
      nineLetterWord: puzzle.nineLetterWord,
      totalWords: puzzle.totalWords,
    });

    if ((i + 1) % 10 === 0) {
      console.log(
        `  ${i + 1}/${PUZZLE_COUNT} — ${puzzle.nineLetterWord} (${puzzle.totalWords} words)`
      );
    }
  }

  const outPath = path.join(process.cwd(), "data", "puzzles.json");
  fs.writeFileSync(outPath, JSON.stringify(puzzles));
  console.log(`\nWrote ${puzzles.length} puzzles to ${outPath}`);
}

main();

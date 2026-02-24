import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { puzzles } from "../lib/db/schema";
import { loadDictionary } from "../lib/dictionary";
import { generatePuzzle } from "../lib/puzzle-generator";

async function main() {
  const targetDate =
    process.argv[2] || new Date().toISOString().split("T")[0];

  console.log(`Generating puzzle for date: ${targetDate}`);

  const dictionary = loadDictionary();
  console.log(`Dictionary loaded: ${dictionary.size} words`);

  const puzzle = generatePuzzle(dictionary);
  console.log(`Generated puzzle:`);
  console.log(`  Nine-letter word: ${puzzle.nineLetterWord}`);
  console.log(`  Center letter: ${puzzle.centerLetter}`);
  console.log(`  Grid letters: ${puzzle.letters}`);
  console.log(`  Valid words: ${puzzle.totalWords}`);
  console.log(
    `  Sample words: ${puzzle.validWords.slice(0, 10).join(", ")}...`
  );

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  });
  const db = drizzle({ client: pool });

  await db.insert(puzzles).values({
    letters: puzzle.letters,
    centerLetter: puzzle.centerLetter,
    validWords: puzzle.validWords,
    nineLetterWord: puzzle.nineLetterWord,
    totalWords: puzzle.totalWords,
    puzzleDate: targetDate,
  });

  console.log(`\nPuzzle saved to database for ${targetDate}`);
  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import {
  pgTable,
  serial,
  text,
  varchar,
  jsonb,
  timestamp,
  date,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const puzzles = pgTable(
  "puzzles",
  {
    id: serial("id").primaryKey(),
    letters: varchar("letters", { length: 9 }).notNull(),
    centerLetter: varchar("center_letter", { length: 1 }).notNull(),
    validWords: jsonb("valid_words").$type<string[]>().notNull(),
    nineLetterWord: text("nine_letter_word").notNull(),
    totalWords: integer("total_words").notNull(),
    puzzleDate: date("puzzle_date", { mode: "string" }).notNull().unique(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("puzzle_date_idx").on(table.puzzleDate)]
);

export type Puzzle = typeof puzzles.$inferSelect;
export type NewPuzzle = typeof puzzles.$inferInsert;

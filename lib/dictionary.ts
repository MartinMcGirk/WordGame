import fs from "fs";
import path from "path";

let cachedWords: Set<string> | null = null;

export function loadDictionary(): Set<string> {
  if (cachedWords) return cachedWords;

  const filePath = path.join(process.cwd(), "data", "wordlist.txt");
  const content = fs.readFileSync(filePath, "utf-8");
  cachedWords = new Set(
    content
      .split("\n")
      .map((w) => w.trim().toUpperCase())
      .filter((w) => w.length >= 4)
  );

  return cachedWords;
}

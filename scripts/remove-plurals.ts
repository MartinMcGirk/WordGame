import fs from "fs";
import path from "path";

// Load the full SCOWL list (including short words) for singular form lookups
const fullPath = path.join(process.cwd(), "data", "scowl_full.txt");
const allEnglishWords = new Set(
  fs
    .readFileSync(fullPath, "utf-8")
    .split("\n")
    .map((w) => w.trim().toUpperCase())
    .filter((w) => /^[A-Z]+$/.test(w))
);

// Load the 4+ letter game word list
const filePath = path.join(process.cwd(), "data", "wordlist.txt");
const gameWords = new Set(
  fs
    .readFileSync(filePath, "utf-8")
    .split("\n")
    .map((w) => w.trim())
    .filter(Boolean)
);

function isLikelyPlural(word: string): boolean {
  // IES -> Y (e.g., BABIES -> BABY, STORIES -> STORY)
  if (word.endsWith("IES")) {
    const singular = word.slice(0, -3) + "Y";
    if (allEnglishWords.has(singular)) return true;
  }

  // SES -> SE (e.g., HOUSES -> HOUSE, COURSES -> COURSE)
  // SES -> S (e.g., GRASSES -> GRASS)
  if (word.endsWith("SES")) {
    if (allEnglishWords.has(word.slice(0, -1))) return true;
    if (allEnglishWords.has(word.slice(0, -2))) return true;
  }

  // CHES -> CH (e.g., WATCHES -> WATCH, ARCHES -> ARCH)
  if (word.endsWith("CHES")) {
    if (allEnglishWords.has(word.slice(0, -2))) return true;
  }

  // SHES -> SH (e.g., BUSHES -> BUSH, DISHES -> DISH)
  if (word.endsWith("SHES")) {
    if (allEnglishWords.has(word.slice(0, -2))) return true;
  }

  // XES -> X (e.g., BOXES -> BOX, FOXES -> FOX)
  if (word.endsWith("XES")) {
    if (allEnglishWords.has(word.slice(0, -2))) return true;
  }

  // ZES -> Z or ZE (e.g., BUZZES -> BUZZ, GLAZES -> GLAZE)
  if (word.endsWith("ZES")) {
    if (allEnglishWords.has(word.slice(0, -2))) return true;
    if (allEnglishWords.has(word.slice(0, -1))) return true;
  }

  // IVES -> IFE (e.g., KNIVES -> KNIFE, WIVES -> WIFE)
  if (word.endsWith("IVES")) {
    if (allEnglishWords.has(word.slice(0, -4) + "IFE")) return true;
  }

  // VES -> F (e.g., HALVES -> HALF, WOLVES -> WOLF)
  if (word.endsWith("VES")) {
    if (allEnglishWords.has(word.slice(0, -3) + "F")) return true;
    if (allEnglishWords.has(word.slice(0, -3) + "FE")) return true;
  }

  // General S -> remove S (e.g., CATS -> CAT, DOGS -> DOG, TABLES -> TABLE)
  // But NOT words ending in SS (BOSS, GLASS, MOSS, etc.)
  if (word.endsWith("S") && !word.endsWith("SS")) {
    const singular = word.slice(0, -1);
    if (allEnglishWords.has(singular)) return true;
  }

  return false;
}

let removed = 0;
const kept: string[] = [];

for (const word of gameWords) {
  if (isLikelyPlural(word)) {
    removed++;
  } else {
    kept.push(word);
  }
}

kept.sort();
fs.writeFileSync(filePath, kept.join("\n") + "\n");

// Clean up the reference file
fs.unlinkSync(fullPath);

console.log(`Original: ${gameWords.size} words`);
console.log(`Removed: ${removed} plurals`);
console.log(`Kept: ${kept.length} words`);

// Spot check
const result = new Set(kept);
const shouldBeGone = ["CATS", "DOGS", "BOXES", "BABIES", "WATCHES", "HOUSES", "KNIVES", "WOLVES"];
const shouldRemain = ["ACROSS", "BOSS", "GLASS", "BONUS", "FOCUS", "ATLAS", "CRISIS", "EDUCATION"];
console.log("\nShould be removed:");
for (const w of shouldBeGone) {
  console.log(`  ${w}: ${result.has(w) ? "STILL PRESENT" : "removed"}`);
}
console.log("Should remain:");
for (const w of shouldRemain) {
  console.log(`  ${w}: ${result.has(w) ? "present" : "MISSING"}`);
}

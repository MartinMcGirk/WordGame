export interface PuzzleCandidate {
  nineLetterWord: string;
  letters: string;
  centerLetter: string;
  validWords: string[];
  totalWords: number;
}

function getLetterFrequency(word: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ch of word) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }
  return freq;
}

function canFormWord(
  word: string,
  available: Map<string, number>
): boolean {
  const needed = getLetterFrequency(word);
  for (const [letter, count] of needed) {
    if ((available.get(letter) || 0) < count) return false;
  }
  return true;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generatePuzzle(dictionary: Set<string>): PuzzleCandidate {
  const nineLetterWords = [...dictionary].filter((w) => w.length === 9);
  const shuffled = shuffle(nineLetterWords);

  let bestCandidate: PuzzleCandidate | null = null;

  for (const nineWord of shuffled.slice(0, 300)) {
    const freq = getLetterFrequency(nineWord);

    // Find all sub-words that can be formed from these letters
    const allSubWords: string[] = [];
    for (const word of dictionary) {
      if (word.length >= 4 && canFormWord(word, freq)) {
        allSubWords.push(word);
      }
    }

    // Try each distinct letter as center, pick the one with most valid words
    const distinctLetters = [...freq.keys()];
    let bestCenter = "";
    let bestWords: string[] = [];

    for (const center of distinctLetters) {
      const words = allSubWords.filter((w) => w.includes(center));
      if (words.length > bestWords.length) {
        bestCenter = center;
        bestWords = words;
      }
    }

    // Accept puzzles with a good word count
    if (bestWords.length >= 15 && bestWords.length <= 80) {
      // Arrange letters: center at position 4, others shuffled around
      const otherLetters = nineWord.split("");
      const centerIdx = otherLetters.indexOf(bestCenter);
      otherLetters.splice(centerIdx, 1);
      const shuffledOthers = shuffle(otherLetters);
      // Insert center at position 4 (middle of 3x3)
      shuffledOthers.splice(4, 0, bestCenter);
      const letters = shuffledOthers.join("");

      const candidate: PuzzleCandidate = {
        nineLetterWord: nineWord,
        letters,
        centerLetter: bestCenter,
        validWords: bestWords.sort(),
        totalWords: bestWords.length,
      };

      if (!bestCandidate || candidate.totalWords > bestCandidate.totalWords) {
        bestCandidate = candidate;
      }

      // Good enough - stop searching
      if (bestCandidate.totalWords >= 20) break;
    }
  }

  if (!bestCandidate) {
    throw new Error(
      "Failed to generate a puzzle. Try again or expand dictionary."
    );
  }

  return bestCandidate;
}

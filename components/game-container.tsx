"use client";

import { useState, useEffect, useCallback } from "react";
import { GameBoard } from "./game-board";
import { WordInput } from "./word-input";
import { FoundWordList } from "./found-word-list";
import { ScoreBoard } from "./score-board";
import type { PuzzleData } from "@/lib/types";

interface GameContainerProps {
  puzzle: PuzzleData;
}

const STORAGE_KEY_PREFIX = "target-time-progress-";

export function GameContainer({ puzzle }: GameContainerProps) {
  const storageKey = `${STORAGE_KEY_PREFIX}${puzzle.id}`;

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isValidating, setIsValidating] = useState(false);
  const [shuffledLetters, setShuffledLetters] = useState(puzzle.letters);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setFoundWords(JSON.parse(saved));
      } catch {
        // Ignore corrupt data
      }
    }
  }, [storageKey]);

  // Save progress whenever foundWords changes
  useEffect(() => {
    if (foundWords.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(foundWords));
    }
  }, [foundWords, storageKey]);

  // Clear messages after a delay
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(undefined);
        setSuccess(undefined);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleLetterClick = useCallback((letter: string) => {
    setCurrentInput((prev) => prev + letter);
    setError(undefined);
    setSuccess(undefined);
  }, []);

  const handleClear = useCallback(() => {
    setCurrentInput("");
    setError(undefined);
    setSuccess(undefined);
  }, []);

  const handleBackspace = useCallback(() => {
    setCurrentInput((prev) => prev.slice(0, -1));
    setError(undefined);
    setSuccess(undefined);
  }, []);

  const handleShuffle = useCallback(() => {
    const center = shuffledLetters[4];
    const others = shuffledLetters
      .split("")
      .filter((_, i) => i !== 4);
    // Fisher-Yates shuffle
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [others[i], others[j]] = [others[j], others[i]];
    }
    others.splice(4, 0, center);
    setShuffledLetters(others.join(""));
  }, [shuffledLetters]);

  const handleSubmit = useCallback(async () => {
    const word = currentInput.toUpperCase().trim();

    if (word.length < 4) {
      setError("Words must be at least 4 letters");
      return;
    }

    if (!word.includes(puzzle.centerLetter)) {
      setError(`Must include center letter: ${puzzle.centerLetter}`);
      return;
    }

    if (foundWords.includes(word)) {
      setError("Already found!");
      return;
    }

    // Check letter availability
    const available = new Map<string, number>();
    for (const ch of puzzle.letters) {
      available.set(ch, (available.get(ch) || 0) + 1);
    }
    const needed = new Map<string, number>();
    for (const ch of word) {
      needed.set(ch, (needed.get(ch) || 0) + 1);
    }
    for (const [letter, count] of needed) {
      if ((available.get(letter) || 0) < count) {
        setError("Invalid letters used");
        setCurrentInput("");
        return;
      }
    }

    setIsValidating(true);
    try {
      const res = await fetch("/api/puzzle/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ puzzleId: puzzle.id, word }),
      });
      const data = await res.json();

      if (data.valid) {
        setFoundWords((prev) => [...prev, word]);
        setCurrentInput("");
        setError(undefined);
        setSuccess(
          word.length === 9 ? `${word} - Amazing!` : `${word} - Correct!`
        );
      } else {
        setError("Not in word list");
      }
    } catch {
      setError("Error validating word");
    } finally {
      setIsValidating(false);
    }
  }, [currentInput, puzzle, foundWords]);

  return (
    <div className="flex flex-col items-center gap-6 py-4 px-4">
      <ScoreBoard found={foundWords.length} total={puzzle.totalWords} />

      <GameBoard
        letters={shuffledLetters}
        onLetterClick={handleLetterClick}
      />

      <button
        onClick={handleShuffle}
        className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300
                   rounded-md hover:bg-gray-100 cursor-pointer"
      >
        Shuffle
      </button>

      <WordInput
        value={currentInput}
        onChange={setCurrentInput}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onBackspace={handleBackspace}
        disabled={isValidating}
        error={error}
        success={success}
      />

      <FoundWordList words={foundWords} totalWords={puzzle.totalWords} />
    </div>
  );
}

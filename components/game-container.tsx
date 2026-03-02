"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GameBoard } from "./game-board";
import { WordInput } from "./word-input";
import { FoundWordList } from "./found-word-list";
import { ScoreBoard } from "./score-board";
import type { PuzzleData } from "@/lib/types";

interface GameContainerProps {
  puzzle: PuzzleData;
}

const STORAGE_KEY_PREFIX = "word-game-progress-";
const GIVEUP_KEY_PREFIX = "word-game-giveup-";

export function GameContainer({ puzzle }: GameContainerProps) {
  const storageKey = `${STORAGE_KEY_PREFIX}${puzzle.index}`;
  const giveUpKey = `${GIVEUP_KEY_PREFIX}${puzzle.index}`;

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isValidating, setIsValidating] = useState(false);
  const [shuffledLetters, setShuffledLetters] = useState(puzzle.letters);
  const [givenUp, setGivenUp] = useState(false);
  const [allWords, setAllWords] = useState<string[] | undefined>();
  const [confirmingGiveUp, setConfirmingGiveUp] = useState(false);
  const giveUpTimer = useRef<ReturnType<typeof setTimeout>>();

  // Load saved progress from localStorage (reset when puzzle changes)
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setFoundWords(JSON.parse(saved));
      } catch {
        setFoundWords([]);
      }
    } else {
      setFoundWords([]);
    }

    const savedGiveUp = localStorage.getItem(giveUpKey);
    if (savedGiveUp) {
      try {
        const parsed = JSON.parse(savedGiveUp);
        setGivenUp(true);
        setAllWords(parsed);
      } catch {
        setGivenUp(false);
        setAllWords(undefined);
      }
    } else {
      setGivenUp(false);
      setAllWords(undefined);
    }

    setCurrentInput("");
    setError(undefined);
    setSuccess(undefined);
    setShuffledLetters(puzzle.letters);
    setConfirmingGiveUp(false);
  }, [storageKey, giveUpKey, puzzle.letters]);

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

  // Clean up give-up confirmation timer
  useEffect(() => {
    return () => {
      if (giveUpTimer.current) clearTimeout(giveUpTimer.current);
    };
  }, []);

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

  const handleGiveUp = useCallback(async () => {
    if (!confirmingGiveUp) {
      setConfirmingGiveUp(true);
      giveUpTimer.current = setTimeout(() => {
        setConfirmingGiveUp(false);
      }, 3000);
      return;
    }

    // Second tap — actually give up
    setConfirmingGiveUp(false);
    if (giveUpTimer.current) clearTimeout(giveUpTimer.current);

    try {
      const res = await fetch("/api/puzzle/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ puzzleIndex: puzzle.index }),
      });
      const data = await res.json();
      setAllWords(data.validWords);
      setGivenUp(true);
      localStorage.setItem(giveUpKey, JSON.stringify(data.validWords));
    } catch {
      setError("Error revealing words");
    }
  }, [puzzle.index, giveUpKey, confirmingGiveUp]);

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
        body: JSON.stringify({ puzzleIndex: puzzle.index, word }),
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
    <div className="flex flex-col items-center gap-5 py-4 px-4 w-full max-w-sm">
      <ScoreBoard found={foundWords.length} total={puzzle.totalWords} />

      {!givenUp && (
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
      )}

      <GameBoard
        letters={shuffledLetters}
        onLetterClick={handleLetterClick}
      />

      <button
        onClick={handleShuffle}
        className="px-5 py-2 text-sm text-gray-600 border border-gray-300
                   rounded-lg hover:bg-gray-100 active:scale-95
                   transition-all cursor-pointer"
      >
        Shuffle
      </button>

      <FoundWordList
        foundWords={foundWords}
        totalWords={puzzle.totalWords}
        allWords={allWords}
      />

      {!givenUp && (
        <button
          onClick={handleGiveUp}
          className={`text-sm transition-colors cursor-pointer ${
            confirmingGiveUp
              ? "text-red-600 font-medium"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {confirmingGiveUp ? "Are you sure? Tap again to give up" : "Give up"}
        </button>
      )}
    </div>
  );
}

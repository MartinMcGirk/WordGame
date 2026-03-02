"use client";

import { useEffect } from "react";

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onBackspace: () => void;
  disabled: boolean;
  error?: string;
  success?: string;
}

export function WordInput({
  value,
  onChange,
  onSubmit,
  onClear,
  onBackspace,
  disabled,
  error,
  success,
}: WordInputProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (disabled) return;
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        onBackspace();
      } else if (e.key === "Escape") {
        onClear();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        onChange(value + e.key.toUpperCase());
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [value, onChange, onSubmit, onClear, onBackspace, disabled]);

  const message = error || success;
  const messageColor = error ? "text-red-500" : "text-green-600";

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div
        className="w-full px-4 py-3 min-h-[52px] border-b-2 border-gray-300
                   text-center text-xl font-mono uppercase tracking-widest text-gray-800"
      >
        {value || <span className="text-gray-300">&#8203;</span>}
      </div>

      {/* Fixed-height feedback area — no layout shift */}
      <p
        className={`h-5 text-sm text-center transition-opacity duration-200 ${
          message ? `opacity-100 ${messageColor}` : "opacity-0"
        }`}
      >
        {message || "\u00A0"}
      </p>

      <div className="flex gap-2 w-full">
        <button
          onClick={onBackspace}
          className="w-12 h-12 flex items-center justify-center text-lg
                     border border-gray-300 rounded-lg
                     hover:bg-gray-100 active:scale-95 active:bg-gray-200
                     transition-all cursor-pointer"
        >
          &#8592;
        </button>
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="flex-1 h-12 text-base font-semibold bg-amber-500 text-white rounded-lg
                     hover:bg-amber-600 active:scale-[0.98] active:bg-amber-600
                     transition-all cursor-pointer
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enter
        </button>
        <button
          onClick={onClear}
          className="w-12 h-12 flex items-center justify-center text-lg
                     border border-gray-300 rounded-lg
                     hover:bg-gray-100 active:scale-95 active:bg-gray-200
                     transition-all cursor-pointer"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
}

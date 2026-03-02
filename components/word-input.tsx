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

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div
        className="w-full px-4 py-3 min-h-[52px] border-b-2 border-gray-300
                   text-center text-xl font-mono uppercase tracking-widest text-gray-800"
      >
        {value || <span className="text-gray-300">&#8203;</span>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md
                     hover:bg-gray-100 cursor-pointer"
        >
          Clear
        </button>
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="px-6 py-2 text-sm bg-amber-500 text-white rounded-md
                     hover:bg-amber-600 font-medium cursor-pointer
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enter
        </button>
        <button
          onClick={onBackspace}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md
                     hover:bg-gray-100 cursor-pointer"
        >
          &#8592;
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
    </div>
  );
}

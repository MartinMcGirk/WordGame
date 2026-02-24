"use client";

import { useRef, useEffect } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Type a word..."
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg
                   text-center text-xl font-mono uppercase tracking-widest
                   focus:border-amber-400 focus:outline-none"
      />
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

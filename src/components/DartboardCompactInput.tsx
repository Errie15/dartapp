"use client";

import { ScoreType } from "@/types";

interface DartboardCompactInputProps {
  onNumberClick: (number: number) => void;
  onBullClick: (isBullseye: boolean) => void;
  onMissClick: () => void;
  onScoreSubmit: () => void;
  scoreType: ScoreType;
  setScoreType: (type: ScoreType) => void;
  throwCount: number;
  disabled: boolean;
}

export default function DartboardCompactInput({
  onNumberClick,
  onBullClick,
  onMissClick,
  onScoreSubmit,
  scoreType,
  setScoreType,
  throwCount,
  disabled
}: DartboardCompactInputProps) {
  return (
    <div className="p-2">
      <div className="grid grid-cols-6 auto-rows-[40px] gap-1">
        {/* First row: E D T 25 B MISS */}
        <button 
          onClick={() => setScoreType("single")}
          className={`rounded text-white text-xs font-medium flex items-center justify-center ${
            scoreType === "single" ? "bg-accent-primary" : "bg-black-charcoal"
          } hover:bg-black-smoke`}
          disabled={disabled || throwCount >= 3}
        >
          E
        </button>
        <button 
          onClick={() => setScoreType("double")}
          className={`rounded text-white text-xs font-medium flex items-center justify-center ${
            scoreType === "double" ? "bg-accent-primary" : "bg-black-charcoal"
          } hover:bg-black-smoke`}
          disabled={disabled || throwCount >= 3}
        >
          D
        </button>
        <button 
          onClick={() => setScoreType("triple")}
          className={`rounded text-white text-xs font-medium flex items-center justify-center ${
            scoreType === "triple" ? "bg-accent-primary" : "bg-black-charcoal"
          } hover:bg-black-smoke`}
          disabled={disabled || throwCount >= 3}
        >
          T
        </button>
        <button 
          onClick={() => onBullClick(false)}
          className="rounded bg-black-charcoal text-white text-xs font-medium flex items-center justify-center hover:bg-black-smoke"
          disabled={disabled || throwCount >= 3}
        >
          25
        </button>
        <button 
          onClick={() => onBullClick(true)}
          className="rounded bg-black-charcoal text-white text-xs font-medium flex items-center justify-center hover:bg-black-smoke"
          disabled={disabled || throwCount >= 3}
        >
          B
        </button>
        <button 
          onClick={onMissClick}
          className="rounded bg-black-charcoal text-white text-xs font-medium flex items-center justify-center hover:bg-black-smoke"
          disabled={disabled || throwCount >= 3}
        >
          MISS
        </button>

        {/* Numbers Grid - will automatically flow into rows of 6 */}
        {[...Array(20)].map((_, i) => {
          const num = i + 1;
          return (
            <button
              key={num}
              onClick={() => onNumberClick(num)}
              disabled={disabled || throwCount >= 3}
              className="rounded bg-black-charcoal text-white text-xs font-medium flex items-center justify-center hover:bg-black-smoke disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      <button
        onClick={onScoreSubmit}
        disabled={disabled || throwCount === 0}
        className={`w-full h-[40px] mt-1 rounded text-center text-sm font-medium ${
          disabled || throwCount === 0
            ? "bg-black-charcoal text-gray-500"
            : "bg-accent-primary hover:bg-red-burgundy text-white"
        }`}
      >
        REGISTRERA ({throwCount}/3)
      </button>
    </div>
  );
} 
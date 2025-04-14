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
    <div>
      {/* Score Type Selector */}
      <div className="grid grid-cols-6 gap-1 md:gap-2 mb-2 md:mb-4">
        <button 
          onClick={() => setScoreType("single")}
          className={`py-3 md:p-2 rounded text-white text-sm font-medium ${
            scoreType === "single" ? "bg-accent-primary" : "bg-black-charcoal"
          }`}
          disabled={disabled || throwCount >= 3}
        >
          E
        </button>
        <button 
          onClick={() => setScoreType("double")}
          className={`py-3 md:p-2 rounded text-white text-sm font-medium ${
            scoreType === "double" ? "bg-accent-primary" : "bg-black-charcoal"
          }`}
          disabled={disabled || throwCount >= 3}
        >
          D
        </button>
        <button 
          onClick={() => setScoreType("triple")}
          className={`py-3 md:p-2 rounded text-white text-sm font-medium ${
            scoreType === "triple" ? "bg-accent-primary" : "bg-black-charcoal"
          }`}
          disabled={disabled || throwCount >= 3}
        >
          T
        </button>
        <button 
          onClick={() => onBullClick(true)}
          className="py-3 md:p-2 rounded bg-black-charcoal text-white text-sm font-medium"
          disabled={disabled || throwCount >= 3}
        >
          B
        </button>
        <button 
          onClick={() => onBullClick(false)}
          className="py-3 md:p-2 rounded bg-black-charcoal text-white text-sm font-medium"
          disabled={disabled || throwCount >= 3}
        >
          25
        </button>
        <button 
          onClick={onMissClick}
          className="py-3 md:p-2 rounded bg-black-charcoal text-white text-sm font-medium"
          disabled={disabled || throwCount >= 3}
        >
          MISS
        </button>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-5 md:grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4">
        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled || throwCount >= 3}
            className="py-3 md:p-2 rounded bg-black-charcoal text-white text-base md:text-sm font-medium hover:bg-black-smoke disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={onScoreSubmit}
        disabled={disabled || throwCount === 0}
        className={`w-full py-4 md:p-3 rounded text-center text-sm font-medium ${
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
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
      {/* Score Type Selector and Bull/Miss */}
      <div className="grid grid-cols-3 gap-1 mb-2">
        {/* First row: E D T */}
        <button 
          onClick={() => setScoreType("single")}
          className={`py-3 rounded text-white text-lg font-medium ${
            scoreType === "single" ? "bg-accent-primary" : "bg-black-charcoal"
          }`}
          disabled={disabled || throwCount >= 3}
        >
          E
        </button>
        <button 
          onClick={() => setScoreType("double")}
          className={`py-3 rounded text-white text-lg font-medium ${
            scoreType === "double" ? "bg-accent-primary" : "bg-black-charcoal"
          }`}
          disabled={disabled || throwCount >= 3}
        >
          D
        </button>
        <button 
          onClick={() => setScoreType("triple")}
          className={`py-3 rounded text-white text-lg font-medium ${
            scoreType === "triple" ? "bg-accent-primary" : "bg-black-charcoal"
          }`}
          disabled={disabled || throwCount >= 3}
        >
          T
        </button>
      </div>

      {/* Second row: 25 B Miss */}
      <div className="grid grid-cols-3 gap-1 mb-2">
        <button 
          onClick={() => onBullClick(false)}
          className="py-3 rounded bg-black-charcoal text-white text-lg font-medium"
          disabled={disabled || throwCount >= 3}
        >
          25
        </button>
        <button 
          onClick={() => onBullClick(true)}
          className="py-3 rounded bg-black-charcoal text-white text-lg font-medium"
          disabled={disabled || throwCount >= 3}
        >
          B
        </button>
        <button 
          onClick={onMissClick}
          className="py-3 rounded bg-black-charcoal text-white text-lg font-medium"
          disabled={disabled || throwCount >= 3}
        >
          MISS
        </button>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {/* First row: 1-5 */}
        {[1,2,3,4,5].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled || throwCount >= 3}
            className="py-3 rounded bg-black-charcoal text-white text-lg font-medium hover:bg-black-smoke disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {num}
          </button>
        ))}
        {/* Second row: 6-10 */}
        {[6,7,8,9,10].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled || throwCount >= 3}
            className="py-3 rounded bg-black-charcoal text-white text-lg font-medium hover:bg-black-smoke disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {num}
          </button>
        ))}
        {/* Third row: 11-15 */}
        {[11,12,13,14,15].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled || throwCount >= 3}
            className="py-3 rounded bg-black-charcoal text-white text-lg font-medium hover:bg-black-smoke disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {num}
          </button>
        ))}
        {/* Fourth row: 16-20 */}
        {[16,17,18,19,20].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled || throwCount >= 3}
            className="py-3 rounded bg-black-charcoal text-white text-lg font-medium hover:bg-black-smoke disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={onScoreSubmit}
        disabled={disabled || throwCount === 0}
        className={`w-full py-4 rounded text-center text-lg font-medium ${
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
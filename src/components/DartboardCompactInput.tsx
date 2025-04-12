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
  // Reorganized to 5 rows of 4 columns for symmetry
  const dartboardNumbersGrid = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20]
  ];

  return (
    <div>
      <div className="bg-black p-2 rounded-lg">
        {/* Score Type Selector */}
        <div className="mb-1.5">
          <div className="flex justify-between bg-gray-800 rounded-lg p-0.5">
            {(["single", "double", "triple"] as ScoreType[]).map((type) => (
              <button
                key={type}
                onClick={() => setScoreType(type)}
                className={`flex-1 py-0.5 px-1 rounded text-center text-xs mx-0.5 ${
                  scoreType === type
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {type === "single" ? "S" : type === "double" ? "D" : "T"}
              </button>
            ))}
          </div>
        </div>
        
        {/* Special Buttons */}
        <div className="flex justify-between gap-1 mb-1.5">
          <button
            onClick={() => onBullClick(true)}
            disabled={disabled}
            className="flex-1 py-0.5 rounded bg-yellow-600 text-white font-medium text-xs"
          >
            BULL
          </button>
          <button
            onClick={() => onBullClick(false)}
            disabled={disabled}
            className="flex-1 py-0.5 rounded bg-green-600 text-white font-medium text-xs mx-1"
          >
            25
          </button>
          <button
            onClick={onMissClick}
            disabled={disabled}
            className="flex-1 py-0.5 rounded bg-red-600 text-white font-medium text-xs"
          >
            MISS
          </button>
        </div>
        
        {/* Numbers Grid - Symmetrical layout */}
        <div className="mb-1.5">
          {dartboardNumbersGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-between gap-1 mb-1">
              {row.map(number => (
                <button
                  key={number}
                  onClick={() => onNumberClick(number)}
                  disabled={disabled}
                  className="flex-1 py-0.5 px-0 rounded bg-gray-700 text-white font-medium text-xs mx-0.5"
                >
                  {number}
                </button>
              ))}
            </div>
          ))}
        </div>
        
        {/* Submit Button */}
        <button
          onClick={onScoreSubmit}
          disabled={disabled || throwCount === 0}
          className={`w-full py-1 rounded-sm ${
            disabled || throwCount === 0
              ? "bg-gray-600 text-gray-400"
              : "bg-red-600 text-white"
          } font-medium text-xs`}
        >
          REGISTRERA ({throwCount}/3)
        </button>
      </div>
    </div>
  );
} 
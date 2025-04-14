"use client";

import { useState, useEffect } from "react";
import { ScoreType } from "@/types";

interface MobileScoreInputProps {
  onScoreSubmit: (value: number, type: ScoreType) => void;
  disabled?: boolean;
  maxThrows?: number;
  currentThrows?: number;
}

export default function MobileScoreInput({
  onScoreSubmit,
  disabled = false,
  maxThrows = 3,
  currentThrows = 0
}: MobileScoreInputProps) {
  const [scoreType, setScoreType] = useState<ScoreType>("single");
  
  const remainingThrows = maxThrows - currentThrows;
  
  // Reset input when currentThrows changes (new player turn)
  useEffect(() => {
    // Ta bort utsättning av inputValue eftersom vi inte längre använder det
    // setInputValue("");
  }, [currentThrows]);
  
  const handleTypeSelect = (type: ScoreType) => {
    setScoreType(type);
  };
  
  const handleQuickScore = (value: number, type: ScoreType) => {
    if (disabled || remainingThrows === 0) return;
    onScoreSubmit(value, type);
  };

  return (
    <div className="mb-4">
      {/* TEST COMPONENT */}
      <div className="p-2 bg-accent-primary text-cream text-center mb-2">
        DETTA ÄR NYA KOMPONENTEN
      </div>
      
      {/* Score Type and Special Buttons Grid */}
      <div className="grid grid-cols-3 gap-1 mb-1">
        <button 
          className={`h-10 w-full max-w-[80px] mx-auto rounded text-white text-sm font-medium flex items-center justify-center ${
            scoreType === "single" ? "bg-accent-primary" : "bg-black-charcoal"
          } hover:bg-black-smoke`}
          onClick={() => handleTypeSelect("single")}
        >
          E
        </button>
        <button 
          className={`h-10 w-full max-w-[80px] mx-auto rounded text-white text-sm font-medium flex items-center justify-center ${
            scoreType === "double" ? "bg-accent-primary" : "bg-black-charcoal"
          } hover:bg-black-smoke`}
          onClick={() => handleTypeSelect("double")}
        >
          D
        </button>
        <button 
          className={`h-10 w-full max-w-[80px] mx-auto rounded text-white text-sm font-medium flex items-center justify-center ${
            scoreType === "triple" ? "bg-accent-primary" : "bg-black-charcoal"
          } hover:bg-black-smoke`}
          onClick={() => handleTypeSelect("triple")}
        >
          T
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1 mb-1">
        <button 
          className="h-10 w-full max-w-[80px] mx-auto rounded bg-black-charcoal text-white text-sm font-medium flex items-center justify-center hover:bg-black-smoke"
          onClick={() => handleQuickScore(25, "outerBull")}
          disabled={disabled || remainingThrows === 0}
        >
          25
        </button>
        <button 
          className="h-10 w-full max-w-[80px] mx-auto rounded bg-black-charcoal text-white text-sm font-medium flex items-center justify-center hover:bg-black-smoke"
          onClick={() => handleQuickScore(50, "innerBull")}
          disabled={disabled || remainingThrows === 0}
        >
          B
        </button>
        <button 
          className="h-10 w-full max-w-[80px] mx-auto rounded bg-black-charcoal text-white text-sm font-medium flex items-center justify-center hover:bg-black-smoke"
          onClick={() => handleQuickScore(0, "single")}
          disabled={disabled || remainingThrows === 0}
        >
          MISS
        </button>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-5 gap-1">
        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((num) => (
          <button
            key={num}
            onClick={() => handleQuickScore(num, scoreType)}
            disabled={disabled || remainingThrows === 0}
            className="h-10 w-full max-w-[60px] mx-auto rounded bg-black-charcoal text-white text-sm font-medium flex items-center justify-center hover:bg-black-smoke disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Throws Counter */}
      <div className="mt-1 text-center text-sm">
        <span className="text-gray-400">Kast: </span>
        <span className={`font-bold ${remainingThrows > 0 ? "text-accent-primary" : "text-gray-500"}`}>
          {currentThrows} / {maxThrows}
        </span>
      </div>
    </div>
  );
}
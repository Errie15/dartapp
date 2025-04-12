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

  // Direktval för dartboardnummer
  const dartboardNumbers = [
    20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5
  ];
  
  return (
    <div className="mb-4">
      {/* TEST COMPONENT */}
      <div className="p-2 bg-accent-primary text-cream text-center mb-2">
        DETTA ÄR NYA KOMPONENTEN
      </div>
      
      {/* Dartboardnummer i rutnät */}
      <div className="dartboard-grid mb-3">
        {dartboardNumbers.map((num) => (
          <button
            key={`dart-${num}`}
            className="dartboard-number-btn"
            onClick={() => handleQuickScore(num, scoreType)}
            disabled={disabled || remainingThrows === 0}
          >
            {num}
          </button>
        ))}
      </div>
      
      {/* Knappar för multiplier */}
      <div className="flex justify-between mb-2">
        <button 
          className={`flex-1 special-btn mr-2 ${scoreType === "single" ? "bg-accent-primary" : ""}`}
          onClick={() => handleTypeSelect("single")}
        >
          Singel
        </button>
        <button 
          className={`flex-1 special-btn mr-2 ${scoreType === "double" ? "bg-accent-primary" : ""}`}
          onClick={() => handleTypeSelect("double")}
        >
          Dubbel
        </button>
        <button 
          className={`flex-1 special-btn ${scoreType === "triple" ? "bg-accent-primary" : ""}`}
          onClick={() => handleTypeSelect("triple")}
        >
          Trippel
        </button>
      </div>
      
      {/* Specialknappar */}
      <div className="flex mt-2 gap-2 mb-2">
        <button 
          className="flex-1 special-btn"
          onClick={() => handleQuickScore(0, "single")}
          disabled={disabled || remainingThrows === 0}
        >
          Miss
        </button>
        <button 
          className="flex-1 special-btn"
          onClick={() => handleQuickScore(25, "outerBull")}
          disabled={disabled || remainingThrows === 0}
        >
          25
        </button>
        <button 
          className="flex-1 special-btn"
          onClick={() => handleQuickScore(50, "innerBull")}
          disabled={disabled || remainingThrows === 0}
        >
          Bull
        </button>
      </div>
      
      {/* Kast kvar */}
      <div className="text-center text-sm mb-2">
        <span className="text-gray-400">Kast kvar: </span>
        <span className={`font-bold ${remainingThrows > 0 ? "text-accent-primary" : "text-gray-500"}`}>
          {remainingThrows} / {maxThrows}
        </span>
      </div>
    </div>
  );
}
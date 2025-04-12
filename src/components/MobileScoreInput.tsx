"use client";

import { useState, useEffect } from "react";
import { FaBackspace, FaCheck, FaBullseye } from "react-icons/fa";
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
  const [inputValue, setInputValue] = useState<string>("");
  const [scoreType, setScoreType] = useState<ScoreType>("single");
  const [showQuickScores, setShowQuickScores] = useState<boolean>(true);
  
  const remainingThrows = maxThrows - currentThrows;
  const canSubmit = !disabled && remainingThrows > 0 && inputValue !== "";
  
  // Reset input when currentThrows changes (new player turn)
  useEffect(() => {
    setInputValue("");
  }, [currentThrows]);
  
  const handleNumberInput = (num: number) => {
    if (disabled || remainingThrows === 0) return;
    
    // Prevent leading zeros
    if (inputValue === "0") {
      setInputValue(num.toString());
      return;
    }
    
    // Limit to 1-20 and 25 (outer bull) for standard dart scores 
    const newValue = inputValue + num;
    const numericValue = parseInt(newValue);
    
    if (numericValue > 20 && numericValue !== 25) {
      return;
    }
    
    setInputValue(newValue);
  };
  
  const handleClear = () => {
    setInputValue("");
  };
  
  const handleBackspace = () => {
    setInputValue(prev => prev.slice(0, -1));
  };
  
  const handleSubmit = () => {
    if (!canSubmit) return;
    
    const value = parseInt(inputValue);
    
    if (isNaN(value)) {
      setInputValue("");
      return;
    }
    
    onScoreSubmit(value, scoreType);
    setInputValue("");
    setScoreType("single");
  };
  
  const handleTypeSelect = (type: ScoreType) => {
    setScoreType(type);
  };
  
  const handleQuickScore = (value: number, type: ScoreType) => {
    if (disabled || remainingThrows === 0) return;
    onScoreSubmit(value, type);
  };
  
  const quickScores = [
    { value: 20, type: "single" as ScoreType },
    { value: 20, type: "double" as ScoreType },
    { value: 20, type: "triple" as ScoreType },
    { value: 19, type: "single" as ScoreType },
    { value: 19, type: "double" as ScoreType },
    { value: 19, type: "triple" as ScoreType },
    { value: 18, type: "single" as ScoreType },
    { value: 18, type: "double" as ScoreType },
    { value: 18, type: "triple" as ScoreType },
    { value: 0, type: "single" as ScoreType }, // Miss
    { value: 25, type: "outerBull" as ScoreType }, // Outer bull
    { value: 50, type: "innerBull" as ScoreType }, // Bullseye
  ];
  
  const getScoreTypeLabel = (type: ScoreType) => {
    switch (type) {
      case "single": return "Singel";
      case "double": return "Dubbel";
      case "triple": return "Trippel";
      case "innerBull": return "Bullseye";
      case "outerBull": return "Yttre bulls";
      default: return type;
    }
  };
  
  return (
    <div className="mb-16">
      {/* Score type selector */}
      <div className="segmented-control mb-4">
        {(["single", "double", "triple"] as ScoreType[]).map((type) => (
          <div 
            key={type}
            className={`segmented-control-option ${scoreType === type ? 'active' : ''}`}
            onClick={() => handleTypeSelect(type)}
          >
            {getScoreTypeLabel(type)}
          </div>
        ))}
      </div>
      
      {/* Quick score buttons or number pad toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{showQuickScores ? "Snabbval" : "Nummer"}</h3>
        <button 
          className="text-sm px-3 py-1 rounded-full bg-black-charcoal text-cream"
          onClick={() => setShowQuickScores(!showQuickScores)}
        >
          {showQuickScores ? "Visa siffror" : "Visa snabbval"}
        </button>
      </div>
      
      {showQuickScores ? (
        /* Quick score buttons */
        <div className="quick-score-grid">
          {quickScores.map((score, index) => {
            let label = "";
            let scoreValue = 0;
            
            if (score.value === 0) {
              label = "Miss";
              scoreValue = 0;
            } else if (score.type === "innerBull") {
              label = "Bull";
              scoreValue = 50;
            } else if (score.type === "outerBull") {
              label = "25";
              scoreValue = 25;
            } else {
              label = `${score.type === "single" ? "" : score.type === "double" ? "D" : "T"}${score.value}`;
              scoreValue = score.value * (score.type === "single" ? 1 : score.type === "double" ? 2 : 3);
            }
            
            return (
              <button
                key={index}
                className={`quick-score-btn ${score.type !== "single" ? score.type === "double" ? "border-red-crimson" : "border-gold-accent" : ""}`}
                onClick={() => handleQuickScore(score.value, score.type)}
                disabled={disabled || remainingThrows === 0}
              >
                <div className="flex flex-col items-center">
                  <span>{label}</span>
                  {score.value > 0 && <span className="text-xs opacity-80">{scoreValue}</span>}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Number pad */
        <>
          <div className="number-pad-display">
            {inputValue || "0"}
          </div>
          
          <div className="number-pad">
            <button className="number-pad-btn" onClick={() => handleNumberInput(1)}>1</button>
            <button className="number-pad-btn" onClick={() => handleNumberInput(2)}>2</button>
            <button className="number-pad-btn" onClick={() => handleNumberInput(3)}>3</button>
            <button className="number-pad-btn" onClick={() => handleNumberInput(4)}>4</button>
            <button className="number-pad-btn" onClick={() => handleNumberInput(5)}>5</button>
            <button className="number-pad-btn" onClick={() => handleNumberInput(6)}>6</button>
            <button className="number-pad-btn" onClick={() => handleNumberInput(7)}>7</button>
            <button className="number-pad-btn" onClick={() => handleNumberInput(8)}>8</button>
            <button className="number-pad-btn" onClick={() => handleNumberInput(9)}>9</button>
            <button className="number-pad-btn" onClick={() => handleNumberInput(0)}>0</button>
            <button className="number-pad-btn special" onClick={handleBackspace}>
              <FaBackspace />
            </button>
            <button className="number-pad-btn special" onClick={handleClear}>C</button>
          </div>
          
          <div className="flex mt-4 gap-2">
            <button 
              className="flex-1 number-pad-btn special"
              onClick={() => handleQuickScore(0, "single")}
              disabled={disabled || remainingThrows === 0}
            >
              Miss
            </button>
            <button 
              className="flex-1 number-pad-btn special"
              onClick={() => handleQuickScore(25, "outerBull")}
              disabled={disabled || remainingThrows === 0}
            >
              25
            </button>
            <button 
              className="flex-1 number-pad-btn special"
              onClick={() => handleQuickScore(50, "innerBull")}
              disabled={disabled || remainingThrows === 0}
            >
              <FaBullseye />
            </button>
          </div>
        </>
      )}
      
      {/* Submit button (only visible in number pad mode) */}
      {!showQuickScores && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full mt-4 py-3 rounded-md ${
            !canSubmit
              ? "bg-gray-700 cursor-not-allowed opacity-50"
              : "bg-accent-primary"
          } text-cream transition-colors font-semibold text-lg flex items-center justify-center gap-2`}
        >
          <FaCheck className="text-sm" />
          <span>Registrera poäng ({inputValue ? parseInt(inputValue) * (scoreType === "single" ? 1 : scoreType === "double" ? 2 : 3) : 0})</span>
        </button>
      )}
      
      {/* Throw counter */}
      <div className="mt-4 text-center text-sm">
        <span className="text-gray-400">Kast kvar: </span>
        <span className={`font-bold ${remainingThrows > 0 ? "text-accent-primary" : "text-gray-500"}`}>{remainingThrows} / {maxThrows}</span>
      </div>
    </div>
  );
}
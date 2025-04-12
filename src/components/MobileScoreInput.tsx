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
            className={`
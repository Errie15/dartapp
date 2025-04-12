"use client";

import { useState } from 'react';
import { Score } from '@/types';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface ThrowHistoryProps {
  scores: Score[];
  onRemoveThrow?: (scoreId: string) => void;
  maxVisibleThrows?: number;
}

export default function ThrowHistory({
  scores,
  onRemoveThrow,
  maxVisibleThrows = 3
}: ThrowHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Group scores by round
  const scoresByRound: Record<number, Score[]> = {};
  
  scores.forEach(score => {
    if (!scoresByRound[score.round]) {
      scoresByRound[score.round] = [];
    }
    scoresByRound[score.round].push(score);
  });
  
  const rounds = Object.keys(scoresByRound)
    .map(Number)
    .sort((a, b) => b - a); // Sort in descending order
  
  const visibleRounds = expanded 
    ? rounds 
    : rounds.slice(0, maxVisibleThrows);
  
  const calculateScoreValue = (score: Score): number => {
    switch (score.type) {
      case 'double':
        return score.value * 2;
      case 'triple':
        return score.value * 3;
      case 'innerBull':
        return 50;
      case 'outerBull':
        return 25;
      default:
        return score.value;
    }
  };
  
  const getScoreLabel = (score: Score): string => {
    if (score.type === 'innerBull') return 'Bullseye';
    if (score.type === 'outerBull') return '25';
    if (score.value === 0) return 'Miss';
    
    const typePrefix = score.type === 'single' 
      ? '' 
      : score.type === 'double' 
        ? 'D' 
        : 'T';
    
    return `${typePrefix}${score.value}`;
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  if (scores.length === 0) {
    return (
      <div className="text-gray-400 text-center p-4 text-sm">
        Ingen kasthistorik ännu
      </div>
    );
  }
  
  return (
    <div className="throw-history">
      {visibleRounds.map(round => (
        <div key={round} className="throw-history-round">
          <div className="throw-history-round-header">
            <span className="font-medium">Runda {round}</span>
            <span className="text-xs text-gray-400">
              {scoresByRound[round].length} kast
            </span>
          </div>
          
          <div className="throw-history-throws">
            {scoresByRound[round].map(score => (
              <div key={score.id} className="throw-history-throw">
                <div className="throw-history-throw-label">
                  {getScoreLabel(score)}
                </div>
                <div className="throw-history-throw-value">
                  {calculateScoreValue(score)}
                </div>
                {onRemoveThrow && (
                  <button 
                    className="throw-history-throw-remove"
                    onClick={() => onRemoveThrow(score.id)}
                    aria-label="Ta bort kast"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {rounds.length > maxVisibleThrows && (
        <button 
          className="throw-history-toggle"
          onClick={toggleExpanded}
        >
          {expanded ? (
            <>
              <span>Visa mindre</span>
              <FaChevronUp className="ml-1" />
            </>
          ) : (
            <>
              <span>Visa alla {rounds.length} rundor</span>
              <FaChevronDown className="ml-1" />
            </>
          )}
        </button>
      )}
    </div>
  );
} 
"use client";

import { Player } from "@/types";
import { FaTrophy, FaArrowDown, FaCircle } from "react-icons/fa";

interface MobileScoreboardProps {
  players: Player[];
  playerScores: Record<string, number>;
  activePlayerId?: string;
  currentRound?: number;
  startingScore: number;
  showDetails?: boolean;
}

export default function MobileScoreboard({
  players,
  playerScores,
  activePlayerId,
  currentRound = 1,
  startingScore,
  showDetails = false
}: MobileScoreboardProps) {
  // Sort players by score (lowest remaining score first)
  const sortedPlayers = [...players].sort((a, b) => {
    // Get remaining scores
    const aRemaining = startingScore - (playerScores[a.id] || 0);
    const bRemaining = startingScore - (playerScores[b.id] || 0);
    
    // Sort by remaining score (ascending)
    return aRemaining - bRemaining;
  });
  
  // Find if there's a winner (score exactly 0)
  const winner = sortedPlayers.find(player => 
    (startingScore - (playerScores[player.id] || 0)) === 0
  );
  
  return (
    <div className="mobile-scoreboard w-full">
      {/* Header */}
      <div className="grid grid-cols-[2fr,1fr,1fr] gap-1 p-2 bg-black-charcoal text-gray-400 text-sm font-medium">
        <div>Spelare</div>
        <div className="text-center">Poäng</div>
        <div className="text-center">Kvar</div>
      </div>
      
      {/* Players List */}
      <div className="space-y-1">
        {sortedPlayers.map((player) => {
          const isActive = player.id === activePlayerId;
          const totalScore = playerScores[player.id] || 0;
          const remainingScore = startingScore - totalScore;
          const isWinner = remainingScore === 0;
          
          return (
            <div 
              key={player.id} 
              className={`grid grid-cols-[2fr,1fr,1fr] gap-1 p-2 items-center ${
                isActive ? 'bg-accent-primary/10' : ''} ${
                isWinner ? 'bg-gradient-luxury border-l-3 border-gold-accent' : ''
              }`}
            >
              {/* Player Name Column */}
              <div className="flex items-center gap-2 min-w-0">
                {isActive && !isWinner && (
                  <FaArrowDown className="text-accent-primary animate-pulse flex-shrink-0" />
                )}
                {isWinner && (
                  <FaTrophy className="text-gold-accent flex-shrink-0" />
                )}
                {!isActive && !isWinner && (
                  <FaCircle className="text-gray-700 text-xs flex-shrink-0" />
                )}
                <span className={`truncate ${isWinner ? 'text-gold-accent font-display' : ''}`}>
                  {player.name}
                </span>
              </div>
              
              {/* Score Column */}
              <div className="text-center font-medium">
                {totalScore}
              </div>
              
              {/* Remaining Score Column */}
              <div className={`text-center font-medium ${
                isWinner ? 'text-gold-accent' : 
                remainingScore < 50 ? 'text-accent-primary' : ''
              }`}>
                {remainingScore}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      {showDetails && (
        <div className="p-3 bg-black-charcoal text-xs text-center text-gray-400">
          Runda {currentRound} • {winner ? 'Spel avslutat' : 'Pågående spel'}
        </div>
      )}
    </div>
  );
} 
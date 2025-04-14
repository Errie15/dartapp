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
    <div className="mobile-scoreboard">
      <div className="grid grid-cols-3 gap-2 p-2 bg-black-charcoal text-gray-400 text-sm">
        <div>Spelare</div>
        <div>Poäng</div>
        <div>Kvar</div>
      </div>
      
      <div className="space-y-1">
        {sortedPlayers.map((player) => {
          const isActive = player.id === activePlayerId;
          const totalScore = playerScores[player.id] || 0;
          const remainingScore = startingScore - totalScore;
          const isWinner = remainingScore === 0;
          
          return (
            <div 
              key={player.id} 
              className={`grid grid-cols-3 gap-2 p-2 items-center ${
                isActive ? 'bg-accent-primary/10' : ''} ${
                isWinner ? 'bg-gradient-luxury border-l-3 border-gold-accent' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {isActive && !isWinner && (
                  <FaArrowDown className="text-accent-primary animate-pulse" />
                )}
                {isWinner && (
                  <FaTrophy className="text-gold-accent" />
                )}
                {!isActive && !isWinner && (
                  <FaCircle className="text-gray-700 text-xs" />
                )}
                <span className={isWinner ? 'text-gold-accent font-display' : ''}>{player.name}</span>
              </div>
              
              <div className="text-center">
                {totalScore}
              </div>
              
              <div className={`text-center ${
                isWinner ? 'text-gold-accent' : 
                remainingScore < 50 ? 'text-accent-primary' : ''
              }`}>
                {remainingScore}
              </div>
            </div>
          );
        })}
      </div>
      
      {showDetails && (
        <div className="p-3 bg-black-charcoal text-xs text-center text-gray-400">
          Runda {currentRound} • {winner ? 'Spel avslutat' : 'Pågående spel'}
        </div>
      )}
    </div>
  );
} 
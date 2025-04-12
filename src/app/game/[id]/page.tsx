"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useGameStore from "@/store/gameStore";
import { ScoreType } from "@/types";
import DartboardCompactInput from "@/components/DartboardCompactInput";

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [scoreType, setScoreType] = useState<ScoreType>("single");
  const [throws, setThrows] = useState<Array<{ value: number, type: ScoreType }>>([]);
  
  const { 
    games, 
    addScore, 
    endGame, 
    getPlayer, 
    getPlayerRemainingScore, 
    getPlayerAverageScore 
  } = useGameStore();
  
  // Find the game from the store
  const game = games.find(g => g.id === id);
  
  useEffect(() => {
    // If game doesn't exist, redirect to game page
    if (!game) {
      router.push("/game");
      return;
    }
    
    // Set active player if not already set
    if (!activePlayerId && game.playerIds && game.playerIds.length > 0) {
      setActivePlayerId(game.playerIds[0]);
    }
  }, [game, activePlayerId, router]);
  
  // Early return if game is not found
  if (!game) {
    return <div className="p-8 text-center">Loading game...</div>;
  }
  
  const handleNumberClick = (number: number) => {
    if (!activePlayerId || throws.length >= 3) return;
    
    const newThrow = { value: number, type: scoreType };
    setThrows([...throws, newThrow]);
  };
  
  const handleBullClick = (isBullseye: boolean) => {
    if (!activePlayerId || throws.length >= 3) return;
    
    const type: ScoreType = isBullseye ? "innerBull" : "outerBull";
    const value = isBullseye ? 50 : 25;
    
    const newThrow = { value, type };
    setThrows([...throws, newThrow]);
  };
  
  const handleMissClick = () => {
    if (!activePlayerId || throws.length >= 3) return;
    
    const newThrow = { value: 0, type: "single" as ScoreType };
    setThrows([...throws, newThrow]);
  };
  
  const handleRemoveThrow = (index: number) => {
    const newThrows = [...throws];
    newThrows.splice(index, 1);
    setThrows(newThrows);
  };
  
  const handleScoreSubmit = () => {
    if (!activePlayerId || throws.length === 0 || !game) return;
    
    // Add all throws to the game
    throws.forEach(throwItem => {
      addScore(activePlayerId, throwItem.value, throwItem.type);
    });
    
    // Calculate remaining score after all throws
    const remainingScore = getPlayerRemainingScore(activePlayerId, id);
    
    // Check if player has won (score === 0)
    if (remainingScore === 0) {
      endGame(id);
      router.push(`/game/${id}/summary`);
      return;
    }
    
    // Safely handle next player logic
    if (game.playerIds && game.playerIds.length > 0) {
      const currentPlayerIndex = game.playerIds.indexOf(activePlayerId);
      const nextPlayerIndex = (currentPlayerIndex + 1) % game.playerIds.length;
      setActivePlayerId(game.playerIds[nextPlayerIndex]);
    }
    
    // Reset selection
    setScoreType("single");
    setThrows([]);
  };
  
  const calculateScoreValue = (type: ScoreType, value: number) => {
    if (type === "double") return value * 2;
    if (type === "triple") return value * 3;
    return value;
  };
  
  const renderThrowLabel = (throwItem: { value: number, type: ScoreType }) => {
    if (throwItem.value === 0) return "Miss";
    if (throwItem.type === "innerBull") return "Bullseye";
    if (throwItem.type === "outerBull") return "Outer Bull";
    return `${throwItem.type.charAt(0).toUpperCase() + throwItem.type.slice(1)} ${throwItem.value}`;
  };
  
  // Safeguard against null or undefined playerIds
  const playerIds = game.playerIds || [];
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Game in Progress</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player Scores */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-4 bg-gray-100">Players</h2>
          
          <ul className="divide-y divide-gray-200">
            {playerIds.map((playerId) => {
              const player = getPlayer(playerId);
              const remainingScore = getPlayerRemainingScore(playerId, id);
              const avgScore = getPlayerAverageScore(playerId, id);
              const isActive = activePlayerId === playerId;
              
              return (
                <li 
                  key={playerId} 
                  className={`p-4 ${isActive ? "bg-blue-50" : ""}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{player?.name}</div>
                    <div className="text-2xl font-bold">{remainingScore}</div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Avg: {avgScore > 0 ? avgScore : "-"}
                  </div>
                  
                  {isActive && (
                    <>
                      <div className="mt-2 p-2 bg-blue-100 rounded-md text-sm text-blue-800 mb-2">
                        Current player
                      </div>
                      
                      {/* Current Throws (in player box) */}
                      <div className="mt-3">
                        {throws.length === 0 ? (
                          <div className="text-sm text-gray-500">
                            No throws yet ({throws.length}/3)
                          </div>
                        ) : (
                          <div className="bg-white border border-blue-200 rounded-md p-2">
                            <div className="text-sm text-blue-800 mb-1 font-medium">
                              Current throws ({throws.length}/3):
                            </div>
                            <ul className="space-y-1">
                              {throws.map((throwItem, index) => (
                                <li key={index} className="flex justify-between items-center text-sm">
                                  <span>{renderThrowLabel(throwItem)}</span>
                                  <div className="flex items-center">
                                    <span className="font-bold mr-2">
                                      {calculateScoreValue(throwItem.type, throwItem.value)}
                                    </span>
                                    <button 
                                      onClick={() => handleRemoveThrow(index)}
                                      className="text-red-500 hover:text-red-700 p-1 text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Dartboard Input */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <h2 className="text-xl font-semibold p-4 bg-gray-100">
              {activePlayerId ? `${getPlayer(activePlayerId)?.name}'s Turn (${throws.length}/3)` : "Select a player"}
            </h2>
            
            <div className="p-4">
              <DartboardCompactInput 
                onNumberClick={handleNumberClick}
                onBullClick={handleBullClick}
                onMissClick={handleMissClick}
                onScoreSubmit={handleScoreSubmit}
                scoreType={scoreType}
                setScoreType={setScoreType}
                throwCount={throws.length}
                disabled={!activePlayerId || throws.length >= 3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
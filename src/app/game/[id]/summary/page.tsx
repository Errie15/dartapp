"use client";

import { useRouter, useParams } from "next/navigation";
import useGameStore from "@/store/gameStore";
import { Score } from "@/types";

export default function GameSummaryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const { games, getPlayer, getPlayerScores, getPlayerAverageScore } = useGameStore();
  
  const game = games.find(g => g.id === id);
  
  if (!game) {
    return (
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold mb-4">Game not found</h1>
        <p className="mb-6">The game you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
        <button
          onClick={() => router.push("/game")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Start New Game
        </button>
      </div>
    );
  }
  
  // Find the player with a score of 0 (the winner)
  const getWinner = () => {
    for (const playerId of game.playerIds) {
      const playerScores = getPlayerScores(playerId, id);
      const totalScore = playerScores.reduce((sum, score) => {
        let value = score.value;
        if (score.type === "double") value *= 2;
        if (score.type === "triple") value *= 3;
        return sum + value;
      }, 0);
      
      if (totalScore === game.startingScore) {
        return playerId;
      }
    }
    return null;
  };
  
  const winnerId = getWinner();
  const winner = winnerId ? getPlayer(winnerId) : null;
  
  // Group scores by round for display
  const getScoresByRound = () => {
    const scoresByRound: Record<number, Record<string, Score[]>> = {};
    
    game.playerIds.forEach(playerId => {
      const playerScores = getPlayerScores(playerId, id);
      
      playerScores.forEach(score => {
        if (!scoresByRound[score.round]) {
          scoresByRound[score.round] = {};
        }
        
        if (!scoresByRound[score.round][playerId]) {
          scoresByRound[score.round][playerId] = [];
        }
        
        scoresByRound[score.round][playerId].push(score);
      });
    });
    
    return scoresByRound;
  };
  
  const calculateScoreValue = (score: Score) => {
    let value = score.value;
    if (score.type === "double") value *= 2;
    if (score.type === "triple") value *= 3;
    return value;
  };
  
  const scoresByRound = getScoresByRound();
  const rounds = Object.keys(scoresByRound).map(Number).sort((a, b) => a - b);
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Game Summary</h1>
      
      {/* Winner Display */}
      {winner && (
        <div className="bg-green-100 p-6 rounded-lg mb-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Winner</h2>
          <div className="text-4xl font-bold text-green-900">{winner.name}</div>
        </div>
      )}
      
      {/* Player Stats */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <h2 className="text-xl font-semibold p-4 bg-gray-100">Player Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {game.playerIds.map(playerId => {
            const player = getPlayer(playerId);
            const avgScore = getPlayerAverageScore(playerId, id);
            const playerScores = getPlayerScores(playerId, id);
            
            // Calculate highest scoring throw
            let highestScore = 0;
            playerScores.forEach(score => {
              const value = calculateScoreValue(score);
              if (value > highestScore) {
                highestScore = value;
              }
            });
            
            return (
              <div 
                key={playerId} 
                className={`p-4 rounded-lg ${playerId === winnerId ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}
              >
                <h3 className="font-bold text-lg mb-2">{player?.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Throws:</span>
                    <span className="font-medium">{playerScores.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score:</span>
                    <span className="font-medium">{avgScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Highest Score:</span>
                    <span className="font-medium">{highestScore}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Game History */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <h2 className="text-xl font-semibold p-4 bg-gray-100">Game History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 font-medium">Round</th>
                {game.playerIds.map(playerId => (
                  <th key={playerId} className="p-4 font-medium">{getPlayer(playerId)?.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rounds.map(round => (
                <tr key={round} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{round}</td>
                  {game.playerIds.map(playerId => {
                    const scores = scoresByRound[round]?.[playerId] || [];
                    return (
                      <td key={playerId} className="p-4">
                        {scores.map(score => {
                          const scoreValue = calculateScoreValue(score);
                          return (
                            <div key={score.id} className="mb-1">
                              <span className="inline-block px-2 py-1 bg-gray-100 rounded-md text-sm">
                                {score.type === "innerBull" ? "Bullseye" : 
                                 score.type === "outerBull" ? "Outer Bull" : 
                                 `${score.type.charAt(0).toUpperCase()}${score.type.slice(1)} ${score.value}`}
                                {" "}
                                <span className="font-bold">{scoreValue}</span>
                              </span>
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => router.push("/stats")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View All Stats
        </button>
        <button
          onClick={() => router.push("/game")}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  );
} 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrophy, FaBullseye, FaDice } from "react-icons/fa";
import useGameStore from "@/store/gameStore";
import { Player, Game } from "@/types";

export default function StatsPage() {
  const router = useRouter();
  const { players, games } = useGameStore();
  const [selectedPlayer, setSelectedPlayer] = useState<string | "all">("all");
  
  const calculatePlayerStats = (player: Player) => {
    // Get games this player participated in
    const playerGames = games.filter(game => game.playerIds.includes(player.id));
    const completedGames = playerGames.filter(game => game.endedAt);
    
    // Count games won
    const gamesWon = completedGames.filter(game => {
      const playerScores = game.scores.filter(score => score.playerId === player.id);
      const totalScore = playerScores.reduce((sum, score) => {
        let value = score.value;
        if (score.type === "double") value *= 2;
        if (score.type === "triple") value *= 3;
        return sum + value;
      }, 0);
      
      return totalScore === game.startingScore;
    }).length;
    
    // Calculate average score per throw
    const allScores = playerGames.flatMap(game => 
      game.scores.filter(score => score.playerId === player.id)
    );
    
    const totalScoreValue = allScores.reduce((sum, score) => {
      let value = score.value;
      if (score.type === "double") value *= 2;
      if (score.type === "triple") value *= 3;
      return sum + value;
    }, 0);
    
    const avgScorePerThrow = allScores.length > 0 
      ? Math.round(totalScoreValue / allScores.length) 
      : 0;
    
    // Find highest scoring throw
    let highestScoreThrow = 0;
    allScores.forEach(score => {
      let value = score.value;
      if (score.type === "double") value *= 2;
      if (score.type === "triple") value *= 3;
      if (value > highestScoreThrow) {
        highestScoreThrow = value;
      }
    });
    
    return {
      gamesPlayed: playerGames.length,
      gamesCompleted: completedGames.length,
      gamesWon,
      winRate: completedGames.length > 0 ? Math.round((gamesWon / completedGames.length) * 100) : 0,
      totalThrows: allScores.length,
      avgScorePerThrow,
      highestScoreThrow,
    };
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : "Unknown Player";
  };
  
  const getLatestGames = (limit = 5) => {
    return [...games]
      .filter(game => game.endedAt)
      .sort((a, b) => (b.endedAt || 0) - (a.endedAt || 0))
      .slice(0, limit);
  };
  
  const getPlayerGames = (playerId: string, limit = 5) => {
    return [...games]
      .filter(game => game.playerIds.includes(playerId) && game.endedAt)
      .sort((a, b) => (b.endedAt || 0) - (a.endedAt || 0))
      .slice(0, limit);
  };
  
  const latestGames = selectedPlayer === "all" 
    ? getLatestGames() 
    : getPlayerGames(selectedPlayer);
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Statistics</h1>
      
      {/* Player Filter */}
      <div className="mb-8">
        <label className="block font-medium mb-2 text-white" htmlFor="player-filter">
          Filter by Player
        </label>
        <select
          id="player-filter"
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="w-full md:w-64 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Players</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Player Stats */}
      {selectedPlayer !== "all" && (
        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold p-4 bg-gray-800 text-white">
            Player Statistics: {getPlayerName(selectedPlayer)}
          </h2>
          
          {(() => {
            const player = players.find(p => p.id === selectedPlayer);
            if (!player) return <div className="p-4 text-white">Player not found</div>;
            
            const stats = calculatePlayerStats(player);
            
            return (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-900 rounded-lg p-4 flex flex-col items-center">
                    <FaDice className="text-3xl text-blue-300 mb-2" />
                    <h3 className="font-medium text-lg mb-1 text-white">Games</h3>
                    <div className="text-3xl font-bold text-white">{stats.gamesPlayed}</div>
                    <div className="text-sm text-blue-200 mt-1">
                      {stats.gamesCompleted} completed
                    </div>
                  </div>
                  
                  <div className="bg-green-900 rounded-lg p-4 flex flex-col items-center">
                    <FaTrophy className="text-3xl text-green-300 mb-2" />
                    <h3 className="font-medium text-lg mb-1 text-white">Wins</h3>
                    <div className="text-3xl font-bold text-white">{stats.gamesWon}</div>
                    <div className="text-sm text-green-200 mt-1">
                      {stats.winRate}% win rate
                    </div>
                  </div>
                  
                  <div className="bg-red-900 rounded-lg p-4 flex flex-col items-center">
                    <FaBullseye className="text-3xl text-red-300 mb-2" />
                    <h3 className="font-medium text-lg mb-1 text-white">Performance</h3>
                    <div className="text-3xl font-bold text-white">{stats.avgScorePerThrow}</div>
                    <div className="text-sm text-red-200 mt-1">
                      avg. points per throw
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-3 text-white">Additional Stats</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex justify-between">
                        <span>Total Throws:</span>
                        <span className="font-medium text-white">{stats.totalThrows}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Highest Scoring Throw:</span>
                        <span className="font-medium text-white">{stats.highestScoreThrow}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      
      {/* Recent Games */}
      <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
        <h2 className="text-xl font-semibold p-4 bg-gray-800 text-white">
          {selectedPlayer === "all" ? "Recent Games" : "Recent Games for " + getPlayerName(selectedPlayer)}
        </h2>
        
        {latestGames.length === 0 ? (
          <div className="p-8 text-center text-gray-300">
            No games found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Players</th>
                  <th className="p-4 font-medium">Starting Score</th>
                  <th className="p-4 font-medium">Duration</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {latestGames.map((game: Game) => {
                  const durationMs = (game.endedAt || 0) - game.createdAt;
                  const durationMin = Math.floor(durationMs / 60000);
                  
                  return (
                    <tr key={game.id} className="hover:bg-gray-800">
                      <td className="p-4">{formatDate(game.createdAt)}</td>
                      <td className="p-4">
                        {game.playerIds.map(id => getPlayerName(id)).join(", ")}
                      </td>
                      <td className="p-4">{game.startingScore}</td>
                      <td className="p-4">{durationMin} min</td>
                      <td className="p-4">
                        <button
                          onClick={() => router.push(`/game/${game.id}/summary`)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 
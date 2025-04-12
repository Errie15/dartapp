"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useGameStore from "@/store/gameStore";
import { Player } from "@/types";

export default function GameSetupPage() {
  const router = useRouter();
  const { players, createGame } = useGameStore();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [startingScore, setStartingScore] = useState<number>(501);

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        if (prev.length < 10) {
          return [...prev, playerId];
        }
        return prev;
      }
    });
  };

  const handleStartGame = () => {
    if (selectedPlayers.length === 0) {
      alert("Please select at least one player");
      return;
    }

    const game = createGame(selectedPlayers, startingScore);
    router.push(`/game/${game.id}`);
  };

  const commonScores = [301, 501, 701];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">New Game Setup</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player Selection */}
        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <h2 className="text-xl font-semibold p-4 bg-gray-800 text-white">
            Select Players ({selectedPlayers.length}/10)
          </h2>
          
          {players.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-300 mb-4">No players added yet.</p>
              <button
                onClick={() => router.push("/players")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Players
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-700">
              {players.map((player: Player) => (
                <li key={player.id} className="p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPlayers.includes(player.id)}
                      onChange={() => handlePlayerToggle(player.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-white">{player.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Game Settings */}
        <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
          <h2 className="text-xl font-semibold p-4 bg-gray-800 text-white">Game Settings</h2>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block font-medium mb-2 text-white" htmlFor="starting-score">
                Starting Score
              </label>
              <div className="flex gap-2 mb-2">
                {commonScores.map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setStartingScore(score)}
                    className={`px-4 py-2 rounded-md ${
                      startingScore === score
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    } transition-colors`}
                  >
                    {score}
                  </button>
                ))}
              </div>
              <input
                id="starting-score"
                type="number"
                value={startingScore}
                onChange={(e) => setStartingScore(parseInt(e.target.value) || 0)}
                min="1"
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleStartGame}
                disabled={selectedPlayers.length === 0}
                className={`w-full py-3 rounded-md ${
                  selectedPlayers.length === 0
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white transition-colors font-semibold text-lg`}
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
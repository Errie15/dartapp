"use client";

import React, { useState } from "react";
import { FaUserPlus, FaTrash, FaEdit } from "react-icons/fa";
import useGameStore from "../../store/gameStore";
import { Player } from "../../types";

// Separate component for editing a player
function EditPlayerForm({ 
  player, 
  onSave, 
  onCancel 
}: { 
  player: Player, 
  onSave: (id: string, name: string) => void,
  onCancel: () => void 
}) {
  const [name, setName] = useState(player.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(player.id, name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
      <label htmlFor="playerNameEdit" className="sr-only">Player Name</label>
      <input
        id="playerNameEdit"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Edit player name"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
      >
        Cancel
      </button>
    </form>
  );
}

export default function PlayersPage() {
  const { players, addPlayer, removePlayer } = useGameStore();
  const [newPlayerName, setNewPlayerName] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    addPlayer(newPlayerName.trim());
    setNewPlayerName("");
  };

  const handleUpdatePlayer = (id: string, name: string) => {
    // Get the current state and update it
    const state = useGameStore.getState();
    const updatedPlayers = state.players.map(player => 
      player.id === id ? { ...player, name } : player
    );
    
    // Set the new state
    useGameStore.setState({ players: updatedPlayers });
    
    // Clear editing state
    setEditingPlayerId(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Player Management</h1>
      
      {/* Add Player Form */}
      <form onSubmit={handleAddPlayer} className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Add New Player</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter player name"
            className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaUserPlus /> Add
          </button>
        </div>
      </form>
      
      {/* Player List */}
      <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
        <h2 className="text-xl font-semibold p-4 bg-gray-800 text-white">Players</h2>
        
        {players.length === 0 ? (
          <p className="p-4 text-gray-300 text-center">No players added yet. Add a player to get started.</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {players.map((player) => (
              <li key={player.id} className="p-4 flex items-center justify-between">
                {editingPlayerId === player.id ? (
                  <EditPlayerForm 
                    player={player}
                    onSave={handleUpdatePlayer}
                    onCancel={() => setEditingPlayerId(null)}
                  />
                ) : (
                  <>
                    <span className="font-medium text-white">{player.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingPlayerId(player.id)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        aria-label="Edit player"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        aria-label="Delete player"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 
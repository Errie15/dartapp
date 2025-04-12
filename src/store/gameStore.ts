import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Game, Score, ScoreType } from '@/types';

interface GameState {
  players: Player[];
  games: Game[];
  currentGame: Game | null;
  
  // Player actions
  addPlayer: (name: string) => Player;
  removePlayer: (id: string) => void;
  getPlayer: (id: string) => Player | undefined;
  
  // Game actions
  createGame: (playerIds: string[], startingScore: number) => Game;
  endGame: (id: string) => void;
  getCurrentGame: () => Game | null;
  
  // Score actions
  addScore: (playerId: string, value: number, type: ScoreType) => void;
  getPlayerScores: (playerId: string, gameId?: string) => Score[];
  getLatestRound: (playerId: string, gameId: string) => number;
  getPlayerRemainingScore: (playerId: string, gameId?: string) => number;
  
  // Stats
  getPlayerAverageScore: (playerId: string, gameId?: string) => number;
  
  // Check for valid dart throw (not bust)
  checkValidThrow: (playerId: string, value: number, type: ScoreType, gameId?: string) => { valid: boolean, message?: string };
}

const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      players: [],
      games: [],
      currentGame: null,
      
      // Player actions
      addPlayer: (name: string) => {
        const newPlayer: Player = {
          id: Date.now().toString(),
          name,
          createdAt: Date.now(),
        };
        
        set((state) => ({
          players: [...state.players, newPlayer],
        }));
        
        return newPlayer;
      },
      
      removePlayer: (id: string) => {
        set((state) => ({
          players: state.players.filter((player) => player.id !== id),
        }));
      },
      
      getPlayer: (id: string) => {
        return get().players.find((player) => player.id === id);
      },
      
      // Game actions
      createGame: (playerIds: string[], startingScore: number) => {
        const newGame: Game = {
          id: Date.now().toString(),
          playerIds,
          scores: [],
          createdAt: Date.now(),
          startingScore,
        };
        
        set((state) => ({
          games: [...state.games, newGame],
          currentGame: newGame,
        }));
        
        return newGame;
      },
      
      endGame: (id: string) => {
        set((state) => {
          const updatedGames = state.games.map((game) => {
            if (game.id === id) {
              return { ...game, endedAt: Date.now() };
            }
            return game;
          });
          
          return {
            games: updatedGames,
            currentGame: state.currentGame?.id === id ? null : state.currentGame,
          };
        });
      },
      
      getCurrentGame: () => {
        return get().currentGame;
      },
      
      // Kontrollera om ett kast är giltigt enligt dartreglerna
      checkValidThrow: (playerId: string, value: number, type: ScoreType, gameId?: string) => {
        const { games, currentGame } = get();
        const targetGameId = gameId || currentGame?.id;
        
        if (!targetGameId) return { valid: false, message: "Inget aktivt spel" };
        
        const game = games.find((g) => g.id === targetGameId);
        if (!game) return { valid: false, message: "Spelet hittades inte" };
        
        // Beräkna nuvarande poäng
        const currentScore = get().getPlayerRemainingScore(playerId, targetGameId);
        
        // Beräkna värdet av kastet
        let throwValue = value;
        if (type === 'double') throwValue *= 2;
        if (type === 'triple') throwValue *= 3;
        
        // Beräkna den nya poängen efter kastet
        const newScore = currentScore - throwValue;
        
        // Kontrollera om kastet leder till "bust" (poäng under 0 eller exakt 1)
        if (newScore < 0) {
          return { valid: false, message: "Bust! Poängen blev under 0." };
        }
        
        if (newScore === 1) {
          return { valid: false, message: "Bust! Poängen blev exakt 1." };
        }
        
        // Kontrollera om det är en giltig checkout (om poängen blir 0)
        if (newScore === 0 && type !== 'double' && type !== 'innerBull') {
          return { valid: false, message: "Ogiltigt! Checkout måste ske på en dubbel." };
        }
        
        return { valid: true };
      },
      
      // Score actions
      addScore: (playerId: string, value: number, type: ScoreType) => {
        const { currentGame } = get();
        
        if (!currentGame) {
          console.error('No active game');
          return;
        }
        
        // Kontrollera om kastet är giltigt enligt dartreglerna
        const validity = get().checkValidThrow(playerId, value, type, currentGame.id);
        
        if (!validity.valid) {
          console.warn('Ogiltigt kast:', validity.message);
          return;
        }
        
        const latestRound = get().getLatestRound(playerId, currentGame.id);
        const newRound = latestRound + 1;
        
        const newScore: Score = {
          id: Date.now().toString(),
          value,
          type,
          playerId,
          timestamp: Date.now(),
          gameId: currentGame.id,
          round: newRound,
        };
        
        set((state) => {
          const updatedGame = {
            ...currentGame,
            scores: [...currentGame.scores, newScore],
          };
          
          const updatedGames = state.games.map((game) => {
            if (game.id === currentGame.id) {
              return updatedGame;
            }
            return game;
          });
          
          return {
            games: updatedGames,
            currentGame: updatedGame,
          };
        });
      },
      
      getPlayerScores: (playerId: string, gameId?: string) => {
        const { games, currentGame } = get();
        const targetGameId = gameId || currentGame?.id;
        
        if (!targetGameId) return [];
        
        const game = games.find((g) => g.id === targetGameId);
        if (!game) return [];
        
        return game.scores.filter((score) => score.playerId === playerId);
      },
      
      getLatestRound: (playerId: string, gameId: string) => {
        const playerScores = get().getPlayerScores(playerId, gameId);
        
        if (playerScores.length === 0) return 0;
        
        const rounds = playerScores.map((score) => score.round);
        return Math.max(...rounds);
      },
      
      getPlayerRemainingScore: (playerId: string, gameId?: string) => {
        const { games, currentGame } = get();
        const targetGameId = gameId || currentGame?.id;
        
        if (!targetGameId) return 0;
        
        const game = games.find((g) => g.id === targetGameId);
        if (!game) return 0;
        
        const startingScore = game.startingScore;
        const playerScores = game.scores.filter((score) => score.playerId === playerId);
        
        const scoreSum = playerScores.reduce((sum, score) => {
          let value = score.value;
          
          if (score.type === 'double') {
            value *= 2;
          } else if (score.type === 'triple') {
            value *= 3;
          }
          
          return sum + value;
        }, 0);
        
        return startingScore - scoreSum;
      },
      
      getPlayerAverageScore: (playerId: string, gameId?: string) => {
        const scores = get().getPlayerScores(playerId, gameId);
        
        if (scores.length === 0) return 0;
        
        const totalScore = scores.reduce((sum, score) => {
          let value = score.value;
          
          if (score.type === 'double') {
            value *= 2;
          } else if (score.type === 'triple') {
            value *= 3;
          }
          
          return sum + value;
        }, 0);
        
        return Math.round(totalScore / scores.length);
      },
    }),
    {
      name: 'dart-game-storage',
    }
  )
);

export default useGameStore; 
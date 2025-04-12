export type ScoreType = 'single' | 'double' | 'triple' | 'innerBull' | 'outerBull';

export interface Score {
  id: string;
  value: number;
  type: ScoreType;
  playerId: string;
  timestamp: number;
  gameId: string;
  round: number;
}

export interface Player {
  id: string;
  name: string;
  createdAt: number;
}

export interface Game {
  id: string;
  playerIds: string[];
  scores: Score[];
  createdAt: number;
  endedAt?: number;
  startingScore: number;
}

export interface GameSummary {
  id: string;
  date: string;
  players: string[];
  winner?: string;
  numberOfThrows: number;
}

export interface PlayerStats {
  totalGames: number;
  gamesWon: number;
  averageScore: number;
  highestScore: number;
  bestGame?: GameSummary;
} 
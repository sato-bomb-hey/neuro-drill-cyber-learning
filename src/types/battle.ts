import type { Question } from './game'

export type BattleStatus = 'waiting' | 'active' | 'finished'

export interface BattlePlayer {
  uid: string
  name: string
  hp: number
  answeredCount: number
  score: number
}

export interface CurrentQuestion {
  index: number
  lockedBy: string | null
  timestamp: number
}

export interface BattleRoom {
  id: string
  status: BattleStatus
  player1: BattlePlayer | null
  player2: BattlePlayer | null
  currentQuestion: CurrentQuestion
  questions: Question[]
  winner: string | null
  createdAt: number
}

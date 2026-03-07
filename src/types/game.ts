export type Subject = 'math' | 'english' | 'japanese' | 'science' | 'social'

export type Grade = 'chu1' | 'chu2' | 'chu3'

export type Term = 'first' | 'second'

export interface Question {
  id: string
  subject: Subject
  grade: Grade
  term: Term
  text: string
  choices: string[]
  correctIndex: number
  explanation: string
}

export interface Round {
  id: string
  subject: Subject
  grade: Grade
  term: Term
  questions: Question[]
  score: number
  answers: (number | null)[]
  startedAt: number
  finishedAt?: number
}

export type BossId =
  | 'NEURAL-CRACKER'
  | 'THERMAL-BARRIER'
  | 'VOID-CIPHER'
  | 'DATA-PHANTOM'
  | 'QUANTUM-WALL'
  | 'NEURAL-HYDRA'

export interface Boss {
  id: BossId
  name: string
  maxHp: number
  currentHp: number
  description: string
  weakness: Subject
}

export type ItemId = 'hp-pack' | 'double-score' | 'time-freeze' | 'hint-scan'

export interface Item {
  id: ItemId
  name: string
  description: string
  quantity: number
}

export interface UserProfile {
  uid: string
  displayName: string
  grade: Grade
  term: Term
  totalScore: number
  wins: number
  losses: number
}

export interface ScoreRecord {
  id: string
  uid: string
  subject: Subject
  grade: Grade
  term: Term
  score: number
  total: number
  date: number
  answerDetails: {
    questionId: string
    correct: boolean
    selectedIndex: number
    timeMs: number
  }[]
}

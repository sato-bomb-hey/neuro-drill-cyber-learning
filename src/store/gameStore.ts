import { create } from 'zustand'
import type { Question, Round, Boss, Subject, Grade, Term, UserProfile, ScoreRecord } from '../types/game'

interface GameState {
  user: UserProfile | null
  currentRound: Round | null
  currentBoss: Boss | null
  scoreHistory: ScoreRecord[]
  selectedSubject: Subject | null
  selectedGrade: Grade
  selectedTerm: Term

  setUser: (user: UserProfile | null) => void
  setSelectedSubject: (subject: Subject | null) => void
  setSelectedGrade: (grade: Grade) => void
  setSelectedTerm: (term: Term) => void
  startRound: (subject: Subject, grade: Grade, term: Term, questions: Question[]) => void
  answerQuestion: (questionIndex: number, choiceIndex: number) => void
  finishRound: () => void
  startBossBattle: (boss: Boss) => void
  damageBoss: (damage: number) => void
  endBossBattle: () => void
  addScoreRecord: (record: ScoreRecord) => void
  setScoreHistory: (history: ScoreRecord[]) => void
  resetCurrentRound: () => void
}

export const useGameStore = create<GameState>((set) => ({
  user: null,
  currentRound: null,
  currentBoss: null,
  scoreHistory: [],
  selectedSubject: null,
  selectedGrade: 'chu1',
  selectedTerm: 'first',

  setUser: (user) => set({ user }),
  setSelectedSubject: (subject) => set({ selectedSubject: subject }),
  setSelectedGrade: (grade) => set({ selectedGrade: grade }),
  setSelectedTerm: (term) => set({ selectedTerm: term }),

  startRound: (subject, grade, term, questions) =>
    set({
      currentRound: {
        id: `round-${Date.now()}`,
        subject,
        grade,
        term,
        questions,
        score: 0,
        answers: new Array(questions.length).fill(null),
        startedAt: Date.now(),
      },
    }),

  answerQuestion: (questionIndex, choiceIndex) =>
    set((state) => {
      if (!state.currentRound) return state
      const round = state.currentRound
      const newAnswers = [...round.answers]
      newAnswers[questionIndex] = choiceIndex

      const correct = round.questions[questionIndex].correctIndex === choiceIndex
      const newScore = correct ? round.score + 10 : round.score

      return {
        currentRound: {
          ...round,
          answers: newAnswers,
          score: newScore,
        },
      }
    }),

  finishRound: () =>
    set((state) => {
      if (!state.currentRound) return state
      return {
        currentRound: {
          ...state.currentRound,
          finishedAt: Date.now(),
        },
      }
    }),

  startBossBattle: (boss) => set({ currentBoss: boss }),

  damageBoss: (damage) =>
    set((state) => {
      if (!state.currentBoss) return state
      return {
        currentBoss: {
          ...state.currentBoss,
          currentHp: Math.max(0, state.currentBoss.currentHp - damage),
        },
      }
    }),

  endBossBattle: () => set({ currentBoss: null }),

  addScoreRecord: (record) =>
    set((state) => ({
      scoreHistory: [record, ...state.scoreHistory].slice(0, 50),
    })),

  setScoreHistory: (history) => set({ scoreHistory: history }),

  resetCurrentRound: () => set({ currentRound: null }),
}))

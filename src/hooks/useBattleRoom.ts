import { useState, useEffect, useCallback } from 'react'
import {
  ref,
  set,
  onValue,
  update,
  push,
  off,
} from 'firebase/database'
import { rtdb } from '../firebase'
import type { BattleRoom, BattlePlayer } from '../types/battle'
import type { Question } from '../types/game'
import { useGameStore } from '../store/gameStore'

export function useBattleRoom() {
  const [room, setRoom] = useState<BattleRoom | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const user = useGameStore((s) => s.user)

  useEffect(() => {
    if (!roomId) return
    const roomRef = ref(rtdb, `battles/${roomId}`)
    onValue(roomRef, (snap) => {
      if (snap.exists()) {
        setRoom({ id: roomId, ...snap.val() } as BattleRoom)
      }
    })
    return () => off(roomRef)
  }, [roomId])

  const createRoom = useCallback(
    async (questions: Question[]) => {
      if (!user) return null
      const battlesRef = ref(rtdb, 'battles')
      const newRoomRef = push(battlesRef)
      const id = newRoomRef.key!

      const player1: BattlePlayer = {
        uid: user.uid,
        name: user.displayName,
        hp: 100,
        answeredCount: 0,
        score: 0,
      }

      const roomData = {
        status: 'waiting',
        player1,
        player2: null,
        currentQuestion: { index: 0, lockedBy: null, timestamp: Date.now() },
        questions,
        winner: null,
        createdAt: Date.now(),
      }

      await set(newRoomRef, roomData)
      setRoomId(id)
      return id
    },
    [user]
  )

  const joinRoom = useCallback(
    async (id: string) => {
      if (!user) return
      const roomRef = ref(rtdb, `battles/${id}`)
      const player2: BattlePlayer = {
        uid: user.uid,
        name: user.displayName,
        hp: 100,
        answeredCount: 0,
        score: 0,
      }
      await update(roomRef, {
        player2,
        status: 'active',
      })
      setRoomId(id)
    },
    [user]
  )

  const lockQuestion = useCallback(
    async (_questionIndex: number) => {
      if (!roomId || !user || !room) return
      if (room.currentQuestion.lockedBy) return

      await update(ref(rtdb, `battles/${roomId}/currentQuestion`), {
        lockedBy: user.uid,
        timestamp: Date.now(),
      })
    },
    [roomId, user, room]
  )

  const submitAnswer = useCallback(
    async (questionIndex: number, correct: boolean, playerKey: 'player1' | 'player2') => {
      if (!roomId || !room) return
      const player = room[playerKey]
      if (!player) return

      const dmg = correct ? 20 : 0
      const otherKey = playerKey === 'player1' ? 'player2' : 'player1'
      const other = room[otherKey]

      const updates: Record<string, unknown> = {
        [`${playerKey}/answeredCount`]: player.answeredCount + 1,
        [`${playerKey}/score`]: player.score + (correct ? 10 : 0),
        [`currentQuestion/lockedBy`]: null,
        [`currentQuestion/index`]: questionIndex + 1,
        [`currentQuestion/timestamp`]: Date.now(),
      }

      if (correct && other) {
        const newHp = Math.max(0, other.hp - dmg)
        updates[`${otherKey}/hp`] = newHp
        if (newHp <= 0) {
          updates['status'] = 'finished'
          updates['winner'] = user?.uid ?? null
        }
      }

      await update(ref(rtdb, `battles/${roomId}`), updates)
    },
    [roomId, room, user]
  )

  return { room, roomId, createRoom, joinRoom, lockQuestion, submitAnswer }
}

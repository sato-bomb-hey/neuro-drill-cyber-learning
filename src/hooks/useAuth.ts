import { useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useGameStore } from '../store/gameStore'
import type { UserProfile, ScoreRecord } from '../types/game'

// ニックネームを仮メールアドレスに変換
function toEmail(nickname: string): string {
  return `${nickname.toLowerCase().replace(/\s+/g, '_')}@neuro-drill.app`
}

export function useAuth() {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const setUser = useGameStore((s) => s.setUser)
  const setScoreHistory = useGameStore((s) => s.setScoreHistory)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user)
        try {
          const userRef = doc(db, 'users', user.uid)
          const snap = await getDoc(userRef)
          if (snap.exists()) {
            setUser(snap.data() as UserProfile)
          }
          // スコア履歴を読み込む
          const scoresQuery = query(
            collection(db, 'scores'),
            where('uid', '==', user.uid),
            orderBy('date', 'desc'),
            limit(50)
          )
          const scoresSnap = await getDocs(scoresQuery)
          setScoreHistory(scoresSnap.docs.map((d) => d.data() as ScoreRecord))
        } catch {
          // Firestore失敗時もゲームは続行
        }
      } else {
        setAuthUser(null)
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [setUser, setScoreHistory])

  const register = async (nickname: string, password: string) => {
    const email = toEmail(nickname)
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    const profile: UserProfile = {
      uid: user.uid,
      displayName: nickname,
      grade: 'chu1',
      term: 'first',
      totalScore: 0,
      wins: 0,
      losses: 0,
    }
    await setDoc(doc(db, 'users', user.uid), profile)
    setUser(profile)
  }

  const login = async (nickname: string, password: string) => {
    const email = toEmail(nickname)
    await signInWithEmailAndPassword(auth, email, password)
    // ユーザープロファイルは onAuthStateChanged で自動的に読み込まれる
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setScoreHistory([])
  }

  return { authUser, loading, login, register, logout }
}

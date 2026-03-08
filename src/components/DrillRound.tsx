import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { CyberPanel } from './ui/CyberPanel'
import { NeonButton } from './ui/NeonButton'
import { useGameStore } from '../store/gameStore'
import { getQuestions } from '../data/questions'
import { switchBgm } from '../hooks/useAudio'
import type { Boss, ScoreRecord } from '../types/game'

const BOSS_POOL: Boss[] = [
  { id: 'NEURAL-CRACKER', name: 'NEURAL-CRACKER', maxHp: 100, currentHp: 100, description: '幾何学的頭部を持つ電子回路ハッカー', weakness: 'math' },
  { id: 'THERMAL-BARRIER', name: 'THERMAL-BARRIER', maxHp: 120, currentHp: 120, description: '火炎エネルギーを操るメカニカル存在', weakness: 'science' },
  { id: 'VOID-CIPHER', name: 'VOID-CIPHER', maxHp: 80, currentHp: 80, description: '虚空の多面体、回転する暗号の守護者', weakness: 'english' },
  { id: 'DATA-PHANTOM', name: 'DATA-PHANTOM', maxHp: 90, currentHp: 90, description: 'データストリームで構成された幽霊', weakness: 'japanese' },
  { id: 'QUANTUM-WALL', name: 'QUANTUM-WALL', maxHp: 150, currentHp: 150, description: '格子状バリアで守られた量子要塞', weakness: 'social' },
  { id: 'NEURAL-HYDRA', name: 'NEURAL-HYDRA', maxHp: 110, currentHp: 110, description: '複数ノードを持つ分散型AI', weakness: 'math' },
]


export default function DrillRound() {
  const navigate = useNavigate()
  const {
    currentRound,
    answerQuestion,
    finishRound,
    startRound,
    startBossBattle,
    addScoreRecord,
    resetCurrentRound,
  } = useGameStore()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [finished, setFinished] = useState(false)
  const [_startTime, setStartTime] = useState(Date.now())

  useEffect(() => {
    if (!currentRound) {
      navigate('/')
      return
    }
  }, [currentRound, navigate])

  useEffect(() => {
    if (showResult || finished) return
    setTimeLeft(30)
    setStartTime(Date.now())
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer)
          handleTimeout()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [currentIndex, showResult, finished])

  const handleTimeout = useCallback(() => {
    if (!currentRound) return
    answerQuestion(currentIndex, -1)
    setSelectedChoice(-1)
    setShowResult(true)
  }, [currentIndex, currentRound, answerQuestion])

  if (!currentRound) return null

  const question = currentRound.questions[currentIndex]
  const totalQuestions = currentRound.questions.length

  const handleChoiceSelect = (choiceIndex: number) => {
    if (showResult || selectedChoice !== null) return
    setSelectedChoice(choiceIndex)
    answerQuestion(currentIndex, choiceIndex)
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedChoice(null)
      setShowResult(false)
    } else {
      finishRound()
      setFinished(true)

      const uid = auth.currentUser?.uid
      if (uid && currentRound) {
        const record: ScoreRecord = {
          id: currentRound.id,
          uid,
          subject: currentRound.subject,
          grade: currentRound.grade,
          term: currentRound.term,
          score: currentRound.score,
          total: totalQuestions * 10,
          date: Date.now(),
          answerDetails: currentRound.questions.map((q, i) => ({
            questionId: q.id,
            correct: currentRound.answers[i] === q.correctIndex,
            selectedIndex: currentRound.answers[i] ?? -1,
            timeMs: 0,
          })),
        }
        addScoreRecord(record)
        // Firestoreにも保存（失敗してもゲームは続行）
        setDoc(doc(db, 'scores', record.id), record).catch(() => {})
      }
    }
  }

  const handleContinueDrill = () => {
    if (!currentRound) return
    const questions = getQuestions(currentRound.subject, currentRound.grade, currentRound.term, 10)
    if (questions.length === 0) return
    startRound(currentRound.subject, currentRound.grade, currentRound.term, questions)
    setCurrentIndex(0)
    setSelectedChoice(null)
    setShowResult(false)
    setFinished(false)
    setTimeLeft(30)
    switchBgm('session')
  }

  const handleBossChallenge = () => {
    const randomBoss = BOSS_POOL[Math.floor(Math.random() * BOSS_POOL.length)]
    startBossBattle(randomBoss)
    navigate('/boss')
  }

  const correctCount = currentRound.answers.filter(
    (a, i) => a === currentRound.questions[i]?.correctIndex
  ).length

  if (finished) {
    const percentage = Math.round((correctCount / totalQuestions) * 100)
    const bossEncounter = percentage >= 80 && Math.random() < 0.4

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
        <CyberPanel title="DRILL.COMPLETE" variant="green" className="w-full max-w-2xl">
          <div className="text-center py-6">
            <div className="text-cyber-green text-6xl font-bold font-mono mb-2">
              {currentRound.score}
            </div>
            <div className="text-cyber-blue text-sm font-mono mb-4">
              NEURAL POINTS ACQUIRED
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-cyber-green text-2xl font-bold">{correctCount}</div>
                <div className="text-cyber-blue/60 text-xs">CORRECT</div>
              </div>
              <div className="text-center">
                <div className="text-cyber-red text-2xl font-bold">{totalQuestions - correctCount}</div>
                <div className="text-cyber-blue/60 text-xs">ERRORS</div>
              </div>
              <div className="text-center">
                <div className="text-cyber-yellow text-2xl font-bold">{percentage}%</div>
                <div className="text-cyber-blue/60 text-xs">ACCURACY</div>
              </div>
            </div>

            {bossEncounter && (
              <div className="mb-4 p-3 border border-cyber-red/60 bg-cyber-red/10">
                <div className="text-cyber-red text-sm font-mono animate-pulse">
                  ⚠ HOSTILE ENTITY DETECTED — BOSS ENCOUNTER INITIATED
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {bossEncounter && (
                <NeonButton variant="red" onClick={handleBossChallenge} className="w-full sm:w-auto">
                  &gt; ENGAGE BOSS
                </NeonButton>
              )}
              <NeonButton variant="yellow" onClick={handleContinueDrill} className="w-full sm:w-auto">
                &gt; CONTINUE DRILL
              </NeonButton>
              <NeonButton variant="green" onClick={() => { resetCurrentRound(); navigate('/') }} className="w-full sm:w-auto">
                &gt; RETURN TO BASE
              </NeonButton>
              <NeonButton variant="blue" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
                &gt; VIEW STATS
              </NeonButton>
            </div>
          </div>
        </CyberPanel>
      </div>
    )
  }

  const isCorrect = selectedChoice === question.correctIndex
  const timerPercent = (timeLeft / 30) * 100

  return (
    <div className="min-h-screen flex flex-col items-center p-3 sm:p-4 gap-3 sm:gap-4 pt-4">
      {/* ステータスバー — 上部固定 */}
      <div className="sticky top-0 z-10 w-full max-w-3xl bg-cyber-black/90 backdrop-blur-sm pb-2">
        <div className="flex items-center justify-between font-mono text-xs sm:text-sm mb-2">
          <button
            onClick={() => {
              if (confirm('ドリルを中断してタイトルに戻りますか？\n（このドリルの結果は無効になります）')) {
                resetCurrentRound()
                navigate('/')
              }
            }}
            className="text-cyber-red/60 hover:text-cyber-red border border-cyber-red/30 hover:border-cyber-red/60 px-2 py-0.5 transition-all duration-150 text-xs"
          >
            ✕ ABORT
          </button>
          <span className="text-cyber-green">
            Q.{currentIndex + 1}/{totalQuestions} | {currentRound.score}pt
          </span>
          <span className={`font-bold ${timeLeft <= 10 ? 'text-cyber-red animate-pulse' : 'text-cyber-blue'}`}>
            T-{String(timeLeft).padStart(2, '0')}
          </span>
        </div>
        {/* Timer bar */}
        <div className="w-full h-1 bg-cyber-black border border-cyber-blue/30">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${timerPercent}%`,
              backgroundColor: timeLeft <= 10 ? '#ff003c' : '#00d4ff',
              boxShadow: timeLeft <= 10 ? '0 0 8px #ff003c' : '0 0 8px #00d4ff',
            }}
          />
        </div>
      </div>

      {/* Question */}
      <CyberPanel title="QUERY.INCOMING" variant="blue" className="w-full max-w-3xl">
        <div className="py-2 sm:py-4">
          <div className="text-cyber-green font-mono text-base sm:text-lg leading-relaxed">
            {question.text}
          </div>
        </div>
      </CyberPanel>

      {/* Choices — 縦1列（タップ領域を十分に確保） */}
      <div className="w-full max-w-3xl grid grid-cols-1 gap-2 sm:gap-3">
        {question.choices.map((choice, i) => {
          let borderColor = 'border-cyber-blue/30 hover:border-cyber-blue/70'
          let bgColor = ''
          let textColor = 'text-cyber-blue/80'

          if (showResult) {
            if (i === question.correctIndex) {
              borderColor = 'border-cyber-green'
              bgColor = 'bg-cyber-green/10'
              textColor = 'text-cyber-green'
            } else if (i === selectedChoice && !isCorrect) {
              borderColor = 'border-cyber-red'
              bgColor = 'bg-cyber-red/10'
              textColor = 'text-cyber-red'
            } else {
              borderColor = 'border-cyber-blue/20'
              textColor = 'text-cyber-blue/40'
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleChoiceSelect(i)}
              disabled={showResult || selectedChoice !== null}
              className={`w-full text-left px-4 py-4 sm:py-4 min-h-[60px] border font-mono text-sm transition-all duration-150 ${borderColor} ${bgColor} ${textColor} disabled:cursor-default`}
            >
              <span className="text-cyber-blue/40 mr-3">[{String.fromCharCode(65 + i)}]</span>
              {choice}
              {showResult && i === question.correctIndex && (
                <span className="ml-2 text-cyber-green">✓ CORRECT</span>
              )}
              {showResult && i === selectedChoice && !isCorrect && i !== question.correctIndex && (
                <span className="ml-2 text-cyber-red">✗ ERROR</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Result / Explanation */}
      {showResult && (
        <CyberPanel
          title={isCorrect ? 'ANALYSIS: CORRECT' : 'ANALYSIS: INCORRECT'}
          variant={isCorrect ? 'green' : 'red'}
          className="w-full max-w-3xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <p className="text-sm font-mono text-cyber-green/80 flex-1">
              {question.explanation}
            </p>
            <NeonButton variant="blue" size="sm" onClick={handleNext} className="w-full sm:w-auto">
              {currentIndex < totalQuestions - 1 ? '> NEXT' : '> FINISH'}
            </NeonButton>
          </div>
        </CyberPanel>
      )}
    </div>
  )
}

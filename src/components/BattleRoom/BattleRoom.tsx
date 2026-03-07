import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CyberPanel } from '../ui/CyberPanel'
import { NeonButton } from '../ui/NeonButton'
import { GlitchText } from '../ui/GlitchText'
import { useBattleRoom } from '../../hooks/useBattleRoom'
import { useGameStore } from '../../store/gameStore'

export function BattleRoom() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { room, joinRoom, lockQuestion, submitAnswer } = useBattleRoom()
  const user = useGameStore((s) => s.user)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [lastQuestionIndex, setLastQuestionIndex] = useState(-1)

  useEffect(() => {
    if (roomId && user) {
      joinRoom(roomId)
    }
  }, [roomId, user])

  useEffect(() => {
    if (!room) return
    const qi = room.currentQuestion.index
    if (qi !== lastQuestionIndex) {
      setLastQuestionIndex(qi)
      setSelectedChoice(null)
      setShowResult(false)
    }
  }, [room?.currentQuestion.index])

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyber-blue font-mono animate-pulse">
          CONNECTING TO BATTLE NODE...
        </div>
      </div>
    )
  }

  const playerKey = room.player1?.uid === user?.uid ? 'player1' : 'player2'
  const myPlayer = room[playerKey]
  const opponentKey = playerKey === 'player1' ? 'player2' : 'player1'
  const opponent = room[opponentKey]

  const currentQIndex = room.currentQuestion.index
  const question = room.questions[currentQIndex]
  const isLocked = !!room.currentQuestion.lockedBy
  const iMyLock = room.currentQuestion.lockedBy === user?.uid

  if (room.status === 'waiting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
        <CyberPanel title="WAITING.FOR.OPPONENT" variant="blue" className="w-full max-w-md text-center">
          <div className="py-8">
            <div className="text-cyber-blue font-mono text-sm animate-pulse mb-4">
              ROOM ID: <span className="text-cyber-green">{roomId}</span>
            </div>
            <p className="text-cyber-blue/60 font-mono text-xs mb-4">
              このIDを相手に共有してください
            </p>
            <button
              className="text-cyber-blue/40 hover:text-cyber-blue font-mono text-xs border border-cyber-blue/20 px-3 py-1"
              onClick={() => navigator.clipboard.writeText(roomId ?? '')}
            >
              COPY ID
            </button>
          </div>
        </CyberPanel>
      </div>
    )
  }

  if (room.status === 'finished') {
    const won = room.winner === user?.uid
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <CyberPanel
          title={won ? 'BATTLE.VICTORY' : 'BATTLE.DEFEAT'}
          variant={won ? 'green' : 'red'}
          className="w-full max-w-md text-center"
        >
          <div className="py-8">
            <div className={`text-5xl font-bold font-mono mb-4 ${won ? 'neon-text-green' : 'neon-text-red'}`}>
              <GlitchText text={won ? 'VICTORY' : 'DEFEAT'} intensity="high" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-cyber-green text-2xl font-bold">{myPlayer?.score ?? 0}</div>
                <div className="text-cyber-blue/60 text-xs">MY SCORE</div>
              </div>
              <div className="text-center">
                <div className="text-cyber-red text-2xl font-bold">{opponent?.score ?? 0}</div>
                <div className="text-cyber-blue/60 text-xs">OPPONENT</div>
              </div>
            </div>
            <NeonButton variant={won ? 'green' : 'red'} onClick={() => navigate('/')}>
              &gt; RETURN TO BASE
            </NeonButton>
          </div>
        </CyberPanel>
      </div>
    )
  }

  const handleChoiceSelect = async (choiceIndex: number) => {
    if (isLocked || selectedChoice !== null || !question) return
    await lockQuestion(currentQIndex)
    setSelectedChoice(choiceIndex)
    setShowResult(true)

    const correct = choiceIndex === question.correctIndex
    await submitAnswer(currentQIndex, correct, playerKey as 'player1' | 'player2')
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-3 sm:p-4 gap-3 sm:gap-4 pt-4">
      {/* Battle status bar — 上部固定 */}
      <div className="sticky top-0 z-10 w-full max-w-3xl bg-cyber-black/90 backdrop-blur-sm pb-2">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
          {/* 自分 */}
          <div className="border border-cyber-green/40 px-2 py-1">
            <div className="text-cyber-green text-xs font-mono truncate">{myPlayer?.name ?? 'YOU'}</div>
            <div className="text-cyber-green text-lg font-bold font-mono">{myPlayer?.hp ?? 100}</div>
            <div className="h-1.5 bg-cyber-black border border-cyber-green/30">
              <div className="h-full hp-bar-transition bg-cyber-green" style={{ width: `${myPlayer?.hp ?? 100}%` }} />
            </div>
            <div className="text-cyber-blue/50 text-xs">{myPlayer?.score ?? 0}pt</div>
          </div>
          <div className="text-cyber-red font-mono text-base font-bold neon-text-red text-center">VS</div>
          {/* 相手 */}
          <div className="border border-cyber-red/40 px-2 py-1 text-right">
            <div className="text-cyber-red text-xs font-mono truncate">{opponent?.name ?? 'OPPONENT'}</div>
            <div className="text-cyber-red text-lg font-bold font-mono">{opponent?.hp ?? 100}</div>
            <div className="h-1.5 bg-cyber-black border border-cyber-red/30">
              <div className="h-full hp-bar-transition bg-cyber-red" style={{ width: `${opponent?.hp ?? 100}%` }} />
            </div>
            <div className="text-cyber-blue/50 text-xs">{opponent?.score ?? 0}pt</div>
          </div>
        </div>
      </div>

      {/* Question */}
      {question && (
        <>
          <CyberPanel title={`QUERY ${currentQIndex + 1}/${room.questions.length}`} variant="blue" className="w-full max-w-3xl">
            <div className="py-2 text-cyber-green font-mono text-sm sm:text-base">
              {isLocked && !iMyLock && (
                <div className="text-cyber-red text-xs mb-2 animate-pulse">
                  ⚡ OPPONENT IS ANSWERING...
                </div>
              )}
              {question.text}
            </div>
          </CyberPanel>

          <div className="w-full max-w-3xl grid grid-cols-1 gap-2">
            {question.choices.map((choice, i) => {
              let style = 'border-cyber-blue/40 text-cyber-blue/80 hover:border-cyber-blue'
              if (showResult) {
                if (i === question.correctIndex) style = 'border-cyber-green bg-cyber-green/10 text-cyber-green'
                else if (i === selectedChoice) style = 'border-cyber-red bg-cyber-red/10 text-cyber-red'
                else style = 'border-cyber-blue/20 text-cyber-blue/30'
              }

              return (
                <button
                  key={i}
                  onClick={() => handleChoiceSelect(i)}
                  disabled={isLocked || selectedChoice !== null}
                  className={`w-full px-4 py-4 min-h-[56px] border font-mono text-sm text-left transition-all ${style} disabled:cursor-default`}
                >
                  [{String.fromCharCode(65 + i)}] {choice}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BossCharacter } from './BossCharacter'
import { CyberPanel } from '../ui/CyberPanel'
import { NeonButton } from '../ui/NeonButton'
import { GlitchText } from '../ui/GlitchText'
import { useGameStore } from '../../store/gameStore'
import { getQuestions } from '../../data/questions'

export function BossBattle() {
  const navigate = useNavigate()
  const { currentBoss, damageBoss, endBossBattle, selectedGrade, selectedTerm, selectedSubject } = useGameStore()

  const [questions] = useState(() =>
    getQuestions(selectedSubject ?? 'math', selectedGrade, selectedTerm, 5)
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [playerHp, setPlayerHp] = useState(100)
  const [phase, setPhase] = useState<'battle' | 'victory' | 'defeat'>('battle')
  const [isAttacking, setIsAttacking] = useState(false)

  useEffect(() => {
    if (!currentBoss) {
      navigate('/')
    }
  }, [currentBoss, navigate])

  if (!currentBoss) return null

  const question = questions[currentIndex]

  const handleChoiceSelect = (choiceIndex: number) => {
    if (showResult || selectedChoice !== null) return
    setSelectedChoice(choiceIndex)
    setShowResult(true)

    const correct = choiceIndex === question.correctIndex

    if (correct) {
      const dmg = currentBoss.weakness === (selectedSubject ?? 'math') ? 35 : 20
      setIsAttacking(true)
      setTimeout(() => setIsAttacking(false), 600)
      damageBoss(dmg)

      if (currentBoss.currentHp - dmg <= 0) {
        setPhase('victory')
        return
      }
    } else {
      // Boss attacks player
      setPlayerHp((hp) => {
        const newHp = Math.max(0, hp - 25)
        if (newHp <= 0) setPhase('defeat')
        return newHp
      })
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedChoice(null)
      setShowResult(false)
    } else {
      // Out of questions — boss wins
      setPhase('defeat')
    }
  }

  const handleEnd = () => {
    endBossBattle()
    navigate('/')
  }

  if (phase === 'victory') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
        <CyberPanel title="SYSTEM.OVERRIDE — VICTORY" variant="green" className="w-full max-w-xl text-center">
          <div className="py-8">
            <div className="text-cyber-green text-5xl font-bold font-mono mb-4">
              <GlitchText text="BOSS DEFEATED" intensity="high" />
            </div>
            <div className="text-cyber-blue font-mono text-sm mb-6">
              {currentBoss.name} has been neutralized. Neural pathways reinforced.
            </div>
            <div className="text-cyber-yellow text-3xl font-bold mb-6">+500 NP</div>
            <NeonButton variant="green" onClick={handleEnd}>&gt; RETURN TO BASE</NeonButton>
          </div>
        </CyberPanel>
      </div>
    )
  }

  if (phase === 'defeat') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
        <CyberPanel title="SYSTEM.FAILURE — DEFEAT" variant="red" className="w-full max-w-xl text-center">
          <div className="py-8">
            <div className="text-cyber-red text-5xl font-bold font-mono mb-4 animate-pulse">
              NEURAL CRASH
            </div>
            <div className="text-cyber-blue/60 font-mono text-sm mb-6">
              {currentBoss.name} has overwhelmed your defenses. Reconnect and retry.
            </div>
            <NeonButton variant="red" onClick={handleEnd}>&gt; RECONNECT</NeonButton>
          </div>
        </CyberPanel>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-3 sm:p-4 gap-3 sm:gap-4 pt-4">
      {/* ゲージ類 — 上部固定 */}
      <div className="sticky top-0 z-10 w-full max-w-3xl bg-cyber-black/90 backdrop-blur-sm pb-2">
        {/* Boss name */}
        <div className="text-center mb-2">
          <div className="text-cyber-red text-xs font-mono tracking-widest animate-pulse">
            ⚠ HOSTILE ENTITY ENCOUNTER ⚠
          </div>
          <h2 className="text-xl sm:text-3xl font-bold font-mono neon-text-red">
            <GlitchText text={currentBoss.name} intensity="high" />
          </h2>
        </div>
        {/* HP ゲージ 横並び */}
        <div className="grid grid-cols-2 gap-2">
          <div className="border border-cyber-green/40 px-3 py-1">
            <div className="flex justify-between text-xs font-mono text-cyber-green mb-1">
              <span>OPERATOR</span><span>{playerHp}/100</span>
            </div>
            <div className="h-2 bg-cyber-black border border-cyber-green/30">
              <div className="h-full hp-bar-transition bg-cyber-green" style={{ width: `${playerHp}%` }} />
            </div>
          </div>
          <div className="border border-cyber-red/40 px-3 py-1">
            <div className="flex justify-between text-xs font-mono text-cyber-red mb-1">
              <span>BOSS HP</span><span>{currentBoss.currentHp}/{currentBoss.maxHp}</span>
            </div>
            <div className="h-2 bg-cyber-black border border-cyber-red/30">
              <div className="h-full hp-bar-transition bg-cyber-red"
                style={{ width: `${(currentBoss.currentHp / currentBoss.maxHp) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ボスキャラクター — モバイルは縮小 */}
      <div className="flex justify-center">
        <BossCharacter
          bossId={currentBoss.id}
          hp={currentBoss.currentHp}
          maxHp={currentBoss.maxHp}
          isAttacking={isAttacking}
          compact
        />
      </div>

      {/* Question */}
      <CyberPanel title={`ENCRYPTED.QUERY — Q${currentIndex + 1}/${questions.length}`} variant="red" className="w-full max-w-3xl">
        <div className="py-2 text-cyber-green font-mono text-sm sm:text-base">
          {question?.text}
        </div>
      </CyberPanel>

      {/* Choices — 縦1列でタップ領域確保 */}
      {question && (
        <div className="w-full max-w-3xl grid grid-cols-1 gap-2">
          {question.choices.map((choice, i) => {
            let style = 'border-cyber-red/40 text-cyber-red/70 hover:border-cyber-red'
            if (showResult) {
              if (i === question.correctIndex) style = 'border-cyber-green bg-cyber-green/10 text-cyber-green'
              else if (i === selectedChoice) style = 'border-cyber-red bg-cyber-red/10 text-cyber-red'
              else style = 'border-cyber-red/20 text-cyber-red/30'
            }
            return (
              <button
                key={i}
                onClick={() => handleChoiceSelect(i)}
                disabled={showResult}
                className={`w-full px-4 py-4 min-h-[56px] border font-mono text-sm text-left transition-all duration-150 ${style} disabled:cursor-default`}
              >
                [{String.fromCharCode(65 + i)}] {choice}
              </button>
            )
          })}
        </div>
      )}

      {showResult && (
        <div className="w-full max-w-3xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-cyber-green/70 text-xs font-mono flex-1">
            {question?.explanation}
          </p>
          <NeonButton variant="red" size="sm" onClick={handleNext} className="w-full sm:w-auto">
            &gt; CONTINUE
          </NeonButton>
        </div>
      )}
    </div>
  )
}

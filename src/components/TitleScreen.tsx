import { useNavigate } from 'react-router-dom'
import { GlitchText } from './ui/GlitchText'
import { NeonButton } from './ui/NeonButton'
import { CyberPanel } from './ui/CyberPanel'
import { useGameStore } from '../store/gameStore'
import { getQuestions } from '../data/questions'
import type { Subject, Grade, Term } from '../types/game'

const SUBJECTS: { id: Subject; label: string; code: string }[] = [
  { id: 'math', label: '数学', code: 'MATH.SYS' },
  { id: 'english', label: '英語', code: 'LANG.EN' },
  { id: 'japanese', label: '国語', code: 'LANG.JP' },
  { id: 'science', label: '理科', code: 'SCI.LAB' },
  { id: 'social', label: '社会', code: 'SOC.NET' },
]

const GRADES: { id: Grade; label: string }[] = [
  { id: 'chu1', label: '中学1年' },
  { id: 'chu2', label: '中学2年' },
  { id: 'chu3', label: '中学3年' },
]

const TERMS: { id: Term; label: string }[] = [
  { id: 'first', label: '前期' },
  { id: 'second', label: '後期' },
]

export default function TitleScreen() {
  const navigate = useNavigate()
  const {
    selectedSubject,
    selectedGrade,
    selectedTerm,
    setSelectedSubject,
    setSelectedGrade,
    setSelectedTerm,
    startRound,
    user,
  } = useGameStore()

  const handleStartDrill = () => {
    if (!selectedSubject) return
    const questions = getQuestions(selectedSubject, selectedGrade, selectedTerm, 10)
    if (questions.length === 0) {
      alert('この組み合わせの問題が見つかりません')
      return
    }
    startRound(selectedSubject, selectedGrade, selectedTerm, questions)
    navigate('/drill')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6 pb-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-cyber-blue/60 text-xs font-mono tracking-widest mb-2 hidden sm:block">
          {'// NEURO-DRILL CYBER-LEARNING OS v1.0.0 //'}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold font-mono neon-text-blue mb-2">
          <GlitchText text="NEURO-DRILL" intensity="medium" />
        </h1>
        <div className="text-cyber-green text-xs sm:text-sm font-mono tracking-widest">
          {'> NEURAL EDUCATION WARFARE SYSTEM ACTIVATED'}
        </div>
        {user && (
          <div className="mt-2 text-cyber-blue/70 text-xs font-mono">
            OPERATOR: {user.displayName} | SCORE: {user.totalScore}
          </div>
        )}
      </div>

      {/* Selection panels — 縦積み on モバイル、3列 on md以上 */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Grade Select */}
        <CyberPanel title="GRADE.SELECT" variant="blue">
          <div className="flex flex-row md:flex-col gap-2">
            {GRADES.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGrade(g.id)}
                className={`flex-1 md:flex-none py-3 px-3 font-mono text-sm border transition-all duration-200 text-left min-h-[48px] ${
                  selectedGrade === g.id
                    ? 'border-cyber-blue bg-cyber-blue/20 text-cyber-blue'
                    : 'border-cyber-blue/30 text-cyber-blue/60 hover:border-cyber-blue/60'
                }`}
              >
                {selectedGrade === g.id ? '▶ ' : '  '}
                {g.label}
              </button>
            ))}
          </div>
        </CyberPanel>

        {/* Term Select */}
        <CyberPanel title="TERM.SELECT" variant="green">
          <div className="flex flex-row md:flex-col gap-2">
            {TERMS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTerm(t.id)}
                className={`flex-1 md:flex-none py-3 px-3 font-mono text-sm border transition-all duration-200 text-left min-h-[48px] ${
                  selectedTerm === t.id
                    ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                    : 'border-cyber-green/30 text-cyber-green/60 hover:border-cyber-green/60'
                }`}
              >
                {selectedTerm === t.id ? '▶ ' : '  '}
                {t.label}
              </button>
            ))}
          </div>
        </CyberPanel>

        {/* Subject Select — モバイルは 2×3 グリッド */}
        <CyberPanel title="SUBJECT.SELECT" variant="blue">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={`py-3 px-3 font-mono text-sm border transition-all duration-200 text-left min-h-[56px] ${
                  selectedSubject === s.id
                    ? 'border-cyber-blue bg-cyber-blue/20 text-cyber-blue'
                    : 'border-cyber-blue/30 text-cyber-blue/60 hover:border-cyber-blue/60'
                }`}
              >
                <span className="text-cyber-green/60 text-xs">[{s.code}]</span>
                <br />
                {selectedSubject === s.id ? '▶ ' : '  '}
                {s.label}
              </button>
            ))}
          </div>
        </CyberPanel>
      </div>

      {/* メインボタン — モバイルは縦スタック、sm以上は横並び */}
      <div className="w-full max-w-sm sm:max-w-none flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
        <NeonButton
          variant="green"
          size="lg"
          onClick={handleStartDrill}
          disabled={!selectedSubject}
          className="w-full sm:w-auto"
        >
          &gt; DRILL START
        </NeonButton>
        <NeonButton
          variant="blue"
          size="lg"
          onClick={() => navigate('/battle')}
          className="w-full sm:w-auto"
        >
          &gt; BATTLE MODE
        </NeonButton>
        <NeonButton
          variant="purple"
          size="lg"
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto"
        >
          &gt; DASHBOARD
        </NeonButton>
      </div>

      {/* Status bar */}
      <div className="text-cyber-blue/40 text-xs font-mono text-center">
        {'STATUS: ONLINE | NODES: 1024 | ENCRYPTION: AES-256 | UPTIME: ∞'}
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { RadarChart } from './RadarChart'
import { RankingBoard } from './RankingBoard'
import { CyberPanel } from '../ui/CyberPanel'
import { NeonButton } from '../ui/NeonButton'
import { GlitchText } from '../ui/GlitchText'
import { useGameStore } from '../../store/gameStore'
import { useAuth } from '../../hooks/useAuth'

export function Dashboard() {
  const navigate = useNavigate()
  const { user, scoreHistory } = useGameStore()
  const { logout } = useAuth()

  const totalSessions = scoreHistory.length
  const avgScore = totalSessions > 0
    ? Math.round(scoreHistory.reduce((s, r) => s + r.score, 0) / totalSessions)
    : 0
  const bestScore = totalSessions > 0
    ? Math.max(...scoreHistory.map((r) => r.score))
    : 0
  const avgAccuracy = totalSessions > 0
    ? Math.round(scoreHistory.reduce((s, r) => s + (r.score / r.total) * 100, 0) / totalSessions)
    : 0

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-8">
        <div className="text-cyber-blue/60 text-xs font-mono tracking-widest mb-2 hidden sm:block">
          {'// NEURAL STATUS MONITOR //'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono neon-text-blue">
          <GlitchText text="DASHBOARD" intensity="low" />
        </h1>
        {user && (
          <div className="text-cyber-green/70 font-mono text-xs sm:text-sm mt-2">
            OPERATOR: {user.displayName}
          </div>
        )}
      </div>

      {/* Stats Grid — モバイルは 2×2、md以上は 4列 */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-5 sm:mb-8">
        {[
          { label: 'SESSIONS', value: totalSessions, color: 'text-cyber-blue' },
          { label: 'AVG SCORE', value: avgScore, color: 'text-cyber-green' },
          { label: 'BEST SCORE', value: bestScore, color: 'text-cyber-yellow' },
          { label: 'ACCURACY', value: `${avgAccuracy}%`, color: 'text-cyber-blue' },
        ].map((stat) => (
          <CyberPanel key={stat.label} variant="blue">
            <div className="text-center py-1 sm:py-2">
              <div className={`text-2xl sm:text-3xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className="text-cyber-blue/50 text-xs font-mono mt-1">{stat.label}</div>
            </div>
          </CyberPanel>
        ))}
      </div>

      {/* Main Content — モバイルは縦積み */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-8">
        {/* Radar Chart */}
        <CyberPanel title="NEURAL.PROFICIENCY_MAP" variant="blue">
          <div className="py-2 sm:py-4">
            <RadarChart scoreHistory={scoreHistory} />
          </div>
        </CyberPanel>

        {/* Score History */}
        <RankingBoard scoreHistory={scoreHistory} />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 justify-center">
        <NeonButton variant="green" onClick={() => navigate('/')} className="w-full sm:w-auto">
          &gt; RETURN TO BASE
        </NeonButton>
        <NeonButton variant="red" onClick={logout} className="w-full sm:w-auto">
          &gt; LOGOUT
        </NeonButton>
      </div>
    </div>
  )
}

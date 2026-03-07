import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useAudio } from './hooks/useAudio'
import { LoginScreen } from './components/LoginScreen'
import TitleScreen from './components/TitleScreen'
import DrillRound from './components/DrillRound'
import { BossBattle } from './components/BossBattle/BossBattle'
import { BattleRoom } from './components/BattleRoom/BattleRoom'
import { BattleLobby } from './components/BattleRoom/BattleLobby'
import { Dashboard } from './components/Dashboard/Dashboard'
import { ScanLine } from './components/ui/ScanLine'

function AppContent() {
  const { authUser, loading, login, register } = useAuth()
  useAudio()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-cyber-blue text-xl animate-pulse font-mono">
          INITIALIZING NEURO-DRILL OS...
        </div>
      </div>
    )
  }

  if (!authUser) {
    return <LoginScreen onLogin={login} onRegister={register} />
  }

  return (
    <Routes>
      <Route path="/" element={<TitleScreen />} />
      <Route path="/drill" element={<DrillRound />} />
      <Route path="/boss" element={<BossBattle />} />
      <Route path="/battle" element={<BattleLobby />} />
      <Route path="/battle/:roomId" element={<BattleRoom />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <ScanLine />
        <AppContent />
      </div>
    </BrowserRouter>
  )
}

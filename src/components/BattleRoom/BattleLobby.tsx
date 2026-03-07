import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CyberPanel } from '../ui/CyberPanel'
import { NeonButton } from '../ui/NeonButton'
import { GlitchText } from '../ui/GlitchText'
import { useBattleRoom } from '../../hooks/useBattleRoom'
import { useGameStore } from '../../store/gameStore'
import { getQuestions } from '../../data/questions'

export function BattleLobby() {
  const navigate = useNavigate()
  const { createRoom, joinRoom } = useBattleRoom()
  const { selectedGrade, selectedTerm, selectedSubject } = useGameStore()
  const [joinRoomId, setJoinRoomId] = useState('')
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)

  const handleCreate = async () => {
    setCreating(true)
    const questions = getQuestions(selectedSubject ?? 'math', selectedGrade, selectedTerm, 10)
    const roomId = await createRoom(questions)
    if (roomId) {
      navigate(`/battle/${roomId}`)
    }
    setCreating(false)
  }

  const handleJoin = async () => {
    if (!joinRoomId.trim()) return
    setJoining(true)
    await joinRoom(joinRoomId.trim())
    navigate(`/battle/${joinRoomId.trim()}`)
    setJoining(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      <div className="text-center">
        <div className="text-cyber-blue text-xs font-mono tracking-widest mb-2">
          {'// NEURAL BATTLE NETWORK //'}
        </div>
        <h1 className="text-4xl font-bold font-mono neon-text-blue">
          <GlitchText text="BATTLE MODE" intensity="medium" />
        </h1>
      </div>

      <div className="w-full max-w-lg grid grid-cols-1 gap-6">
        <CyberPanel title="CREATE.BATTLE_ROOM" variant="green">
          <div className="py-4 text-center">
            <p className="text-cyber-green/70 font-mono text-sm mb-4">
              新しい対戦部屋を作成し、コードを相手に共有してください。
            </p>
            <NeonButton
              variant="green"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? '> CREATING...' : '> CREATE ROOM'}
            </NeonButton>
          </div>
        </CyberPanel>

        <CyberPanel title="JOIN.BATTLE_ROOM" variant="blue">
          <div className="py-4">
            <p className="text-cyber-blue/70 font-mono text-sm mb-4">
              ルームIDを入力して対戦に参加
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="ROOM ID..."
                className="flex-1 bg-transparent border border-cyber-blue/40 text-cyber-blue font-mono text-sm px-3 py-2 focus:outline-none focus:border-cyber-blue placeholder:text-cyber-blue/30"
              />
              <NeonButton
                variant="blue"
                size="sm"
                onClick={handleJoin}
                disabled={joining || !joinRoomId.trim()}
              >
                {joining ? '...' : 'JOIN'}
              </NeonButton>
            </div>
          </div>
        </CyberPanel>
      </div>

      <NeonButton variant="purple" onClick={() => navigate('/')}>
        &lt; BACK TO BASE
      </NeonButton>
    </div>
  )
}

import { useState } from 'react'
import { CyberPanel } from './ui/CyberPanel'
import { NeonButton } from './ui/NeonButton'
import { GlitchText } from './ui/GlitchText'

interface LoginScreenProps {
  onLogin: (nickname: string, password: string) => Promise<void>
  onRegister: (nickname: string, password: string) => Promise<void>
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!nickname.trim()) { setError('ニックネームを入力してください'); return }
    if (nickname.trim().length < 3) { setError('ニックネームは3文字以上にしてください'); return }
    if (password.length < 6) { setError('パスワードは6文字以上にしてください'); return }

    setLoading(true)
    try {
      if (mode === 'login') {
        await onLogin(nickname.trim(), password)
      } else {
        await onRegister(nickname.trim(), password)
      }
    } catch (e: unknown) {
      const code = (e as { code?: string }).code
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('ニックネームまたはパスワードが違います')
      } else if (code === 'auth/email-already-in-use') {
        setError('そのニックネームはすでに使われています')
      } else if (code === 'auth/wrong-password') {
        setError('パスワードが違います')
      } else {
        setError('エラーが発生しました。もう一度お試しください')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <div className="text-center">
        <div className="text-cyber-blue/60 text-xs font-mono tracking-widest mb-2">
          {'// NEURO-DRILL CYBER-LEARNING OS v1.0.0 //'}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-mono neon-text-blue mb-2">
          <GlitchText text="NEURO-DRILL" intensity="medium" />
        </h1>
        <div className="text-cyber-green text-xs font-mono tracking-widest">
          {'> OPERATOR AUTHENTICATION REQUIRED'}
        </div>
      </div>

      <CyberPanel title="ACCESS.CONTROL" variant="blue" className="w-full max-w-sm">
        {/* モード切替 */}
        <div className="flex mb-6 border border-cyber-blue/30">
          <button
            onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2 font-mono text-sm transition-all duration-150 ${
              mode === 'login'
                ? 'bg-cyber-blue/20 text-cyber-blue'
                : 'text-cyber-blue/40 hover:text-cyber-blue/70'
            }`}
          >
            LOGIN
          </button>
          <button
            onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-2 font-mono text-sm transition-all duration-150 ${
              mode === 'register'
                ? 'bg-cyber-green/20 text-cyber-green'
                : 'text-cyber-blue/40 hover:text-cyber-blue/70'
            }`}
          >
            NEW OPERATOR
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* ニックネーム */}
          <div>
            <label className="block text-cyber-blue/60 text-xs font-mono mb-1">
              OPERATOR ID (ニックネーム)
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="例: HACKER-NEO"
              maxLength={20}
              className="w-full bg-transparent border border-cyber-blue/40 text-cyber-green font-mono text-sm px-3 py-2 focus:outline-none focus:border-cyber-blue placeholder-cyber-blue/20"
            />
          </div>

          {/* パスワード */}
          <div>
            <label className="block text-cyber-blue/60 text-xs font-mono mb-1">
              ACCESS KEY (パスワード 6文字以上)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              className="w-full bg-transparent border border-cyber-blue/40 text-cyber-green font-mono text-sm px-3 py-2 focus:outline-none focus:border-cyber-blue placeholder-cyber-blue/20"
            />
          </div>

          {/* エラー */}
          {error && (
            <div className="text-cyber-red text-xs font-mono border border-cyber-red/40 bg-cyber-red/10 px-3 py-2">
              ✗ {error}
            </div>
          )}

          {/* 送信ボタン */}
          <NeonButton
            variant={mode === 'login' ? 'blue' : 'green'}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading
              ? '> AUTHENTICATING...'
              : mode === 'login'
              ? '> ACCESS GRANTED'
              : '> REGISTER OPERATOR'}
          </NeonButton>
        </div>
      </CyberPanel>

      <div className="text-cyber-blue/30 text-xs font-mono text-center">
        {'STATUS: AWAITING OPERATOR | ENCRYPTION: AES-256'}
      </div>
    </div>
  )
}

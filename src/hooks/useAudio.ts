import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// ── モジュールレベルのシングルトン（React のライフサイクル外で管理）──

const SESSION_TRACKS = [
  '/session1.mp3',
  '/session2.mp3',
  '/session3.mp3',
  '/session4.mp3',
  '/session5.mp3',
  '/session6.mp3',
  '/session7.mp3',
  '/session8.mp3',
]

const FADE_MS = 1500
const TICK_MS = 50

let _audio: HTMLAudioElement | null = null
let _currentType: 'maintitle' | 'session' | null = null
let _lastSessionSrc = ''
let _fadeTimer: ReturnType<typeof setInterval> | null = null

function crossFadeTo(src: string) {
  if (_fadeTimer) { clearInterval(_fadeTimer); _fadeTimer = null }

  const old = _audio
  const next = new Audio(src)
  next.loop = true
  next.volume = old ? 0 : 1
  _audio = next
  next.play().catch(() => {})

  if (!old) return

  const steps = FADE_MS / TICK_MS
  let step = 0
  _fadeTimer = setInterval(() => {
    step++
    const t = Math.min(step / steps, 1)
    next.volume = t
    old.volume = 1 - t
    if (step >= steps) {
      clearInterval(_fadeTimer!); _fadeTimer = null
      old.pause(); old.src = ''
    }
  }, TICK_MS)
}

/** 直前と異なるセッショントラックをランダムに選ぶ */
function pickSession(): string {
  const pool = SESSION_TRACKS.filter(s => s !== _lastSessionSrc)
  const src = pool[Math.floor(Math.random() * pool.length)]
  _lastSessionSrc = src
  return src
}

/** 外部から呼び出す BGM 切り替え関数 */
export function switchBgm(type: 'maintitle' | 'session') {
  if (type === 'maintitle') {
    if (_currentType === 'maintitle') return
    _currentType = 'maintitle'
    crossFadeTo('/maintitle.mp3')
  } else {
    // session は毎回必ず新しいランダムトラック
    _currentType = 'session'
    crossFadeTo(pickSession())
  }
}

// ── React フック ──────────────────────────────────────────────

function trackTypeFor(path: string): 'maintitle' | 'session' {
  return path === '/drill' || path === '/boss' ? 'session' : 'maintitle'
}

export function useAudio() {
  const location = useLocation()
  const startedRef = useRef(false)
  const pathnameRef = useRef(location.pathname)

  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname])

  // 初回ユーザー操作で再生開始（ブラウザの autoplay 制限対策）
  useEffect(() => {
    const unlock = () => {
      if (startedRef.current) return
      startedRef.current = true
      switchBgm(trackTypeFor(pathnameRef.current))
    }
    document.addEventListener('click', unlock, { once: true })
    document.addEventListener('keydown', unlock, { once: true })
    return () => {
      document.removeEventListener('click', unlock)
      document.removeEventListener('keydown', unlock)
    }
  }, [])

  // ルート変化時の切り替え
  useEffect(() => {
    if (!startedRef.current) return
    switchBgm(trackTypeFor(location.pathname))
  }, [location.pathname])
}

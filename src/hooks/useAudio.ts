import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ── 定数 ──

const SESSION_TRACKS = [
  '/session1.mp3', '/session2.mp3', '/session3.mp3', '/session4.mp3',
  '/session5.mp3', '/session6.mp3', '/session7.mp3', '/session8.mp3',
]
const ALL_TRACKS = ['/maintitle.mp3', ...SESSION_TRACKS]
const FADE_OUT_MS = 800
const FADE_IN_MS = 600
const TICK_MS = 50

// ── モジュール読み込み時に全 Audio 要素を事前生成・バッファリング開始 ──
// preload='auto' により、ユーザー操作前からブラウザが音声データを読み込み始める

const _pool = new Map<string, HTMLAudioElement>()
ALL_TRACKS.forEach(src => {
  const a = new Audio(src)
  a.loop = true
  a.preload = 'auto'
  _pool.set(src, a)
})

// ── 状態 ──

let _current: HTMLAudioElement | null = null
let _currentSrc = ''
let _currentType: 'maintitle' | 'session' | null = null
let _lastSessionSrc = ''
let _fadeTimer: ReturnType<typeof setInterval> | null = null

function clearFade() {
  if (_fadeTimer) { clearInterval(_fadeTimer); _fadeTimer = null }
}

function setVol(audio: HTMLAudioElement, v: number) {
  try { audio.volume = Math.max(0, Math.min(1, v)) } catch (_) { /* iOS は read-only の場合がある */ }
}

function fadeSwitchTo(src: string) {
  if (_currentSrc === src) return
  const next = _pool.get(src)
  if (!next) return

  clearFade()

  // 初回 or 現在の音声がない場合は即時再生
  if (!_current) {
    setVol(next, 1)
    next.play().catch(() => {})
    _current = next
    _currentSrc = src
    return
  }

  const old = _current
  _current = next
  _currentSrc = src

  // フェードアウト → 次のトラックを開始 → フェードイン
  const outSteps = FADE_OUT_MS / TICK_MS
  const inSteps = FADE_IN_MS / TICK_MS
  let step = 0

  _fadeTimer = setInterval(() => {
    step++
    setVol(old, 1 - step / outSteps)
    if (step >= outSteps) {
      clearFade()
      old.pause()
      setVol(old, 1) // 次回使用時のためにリセット

      setVol(next, 0)
      next.play().catch(() => {})

      // フェードイン
      let inStep = 0
      _fadeTimer = setInterval(() => {
        inStep++
        setVol(next, inStep / inSteps)
        if (inStep >= inSteps) {
          clearFade()
          setVol(next, 1)
        }
      }, TICK_MS)
    }
  }, TICK_MS)
}

function pickSession(): string {
  const pool = SESSION_TRACKS.filter(s => s !== _lastSessionSrc)
  const src = pool[Math.floor(Math.random() * pool.length)]
  _lastSessionSrc = src
  return src
}

/** SplashScreen の BOOT ボタンから呼ぶ（ユーザー操作内で実行すること） */
export function initAudio() {
  _currentType = 'maintitle'
  _currentSrc = '/maintitle.mp3'
  _current = _pool.get('/maintitle.mp3')!
  setVol(_current, 1)
  _current.play().catch(() => {})
}

export function switchBgm(type: 'maintitle' | 'session') {
  if (!_current) return // initAudio が呼ばれる前は何もしない
  if (type === 'maintitle') {
    if (_currentType === 'maintitle') return
    _currentType = 'maintitle'
    fadeSwitchTo('/maintitle.mp3')
  } else {
    _currentType = 'session'
    fadeSwitchTo(pickSession())
  }
}

// ── React フック ──

function trackTypeFor(path: string): 'maintitle' | 'session' {
  return path === '/drill' || path === '/boss' ? 'session' : 'maintitle'
}

export function useAudio() {
  const location = useLocation()
  useEffect(() => {
    switchBgm(trackTypeFor(location.pathname))
  }, [location.pathname])
}

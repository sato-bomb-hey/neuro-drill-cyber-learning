import { useEffect, useRef } from 'react'
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

// ── 全 Audio 要素をモジュール読み込み時に生成・バッファリング開始 ──

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
  try { audio.volume = Math.max(0, Math.min(1, v)) } catch (_) {}
}

function fadeSwitchTo(src: string) {
  if (_currentSrc === src) return
  const next = _pool.get(src)
  if (!next) return

  clearFade()

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

  const outSteps = FADE_OUT_MS / TICK_MS
  const inSteps = FADE_IN_MS / TICK_MS
  let step = 0

  _fadeTimer = setInterval(() => {
    step++
    setVol(old, 1 - step / outSteps)
    if (step >= outSteps) {
      clearFade()
      old.pause()
      setVol(old, 1)

      setVol(next, 0)
      next.play().catch(() => {})

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

export function switchBgm(type: 'maintitle' | 'session') {
  if (!_current && type === 'maintitle' && _currentType === 'maintitle') return
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
// document レベルの touchend/click で音声をアンロック（iOS 対応の確実な方法）

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

  // 初回タッチ/クリックで音声開始（iOS は touchend が最も確実）
  useEffect(() => {
    const unlock = () => {
      if (startedRef.current) return
      startedRef.current = true

      const src = trackTypeFor(pathnameRef.current) === 'session'
        ? pickSession()
        : '/maintitle.mp3'
      _currentType = trackTypeFor(pathnameRef.current)

      const audio = _pool.get(src)!
      setVol(audio, 1)
      audio.play().catch(() => {})
      _current = audio
      _currentSrc = src
    }

    document.addEventListener('touchend', unlock, { once: true })
    document.addEventListener('click', unlock, { once: true })
    return () => {
      document.removeEventListener('touchend', unlock)
      document.removeEventListener('click', unlock)
    }
  }, [])

  // ルート変化時の BGM 切り替え
  useEffect(() => {
    if (!startedRef.current) return
    switchBgm(trackTypeFor(location.pathname))
  }, [location.pathname])
}

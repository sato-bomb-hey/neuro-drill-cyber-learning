import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ── モジュールレベルのシングルトン ──

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

const FADE_OUT_MS = 800
const FADE_IN_MS = 600
const TICK_MS = 50

// 単一の Audio 要素を使い回す（iOS 制限対策）
let _audio: HTMLAudioElement | null = null
let _currentType: 'maintitle' | 'session' | null = null
let _lastSessionSrc = ''
let _fadeTimer: ReturnType<typeof setInterval> | null = null
let _pendingSrc: string | null = null

function clearFade() {
  if (_fadeTimer) { clearInterval(_fadeTimer); _fadeTimer = null }
}

function getAudio(): HTMLAudioElement {
  if (!_audio) {
    _audio = new Audio()
    _audio.loop = true
  }
  return _audio
}

/** フェードアウト → ソース切替 → フェードイン（単一要素で順次処理） */
function fadeSwitch(src: string) {
  clearFade()
  _pendingSrc = src
  const audio = getAudio()

  // すでに同じソースなら何もしない
  if (audio.src.endsWith(src) && !audio.paused) return

  // 再生中でなければ即座に開始
  if (audio.paused || audio.volume === 0) {
    audio.src = src
    audio.loop = true
    audio.volume = 0
    audio.play().catch(() => {})
    fadeIn(audio)
    return
  }

  // フェードアウト
  const outSteps = FADE_OUT_MS / TICK_MS
  let step = 0
  const startVol = audio.volume
  _fadeTimer = setInterval(() => {
    step++
    const vol = startVol * (1 - step / outSteps)
    audio.volume = Math.max(0, vol)
    if (step >= outSteps) {
      clearFade()
      // ソース切替 & フェードイン
      if (_pendingSrc) {
        audio.pause()
        audio.src = _pendingSrc
        audio.loop = true
        audio.volume = 0
        audio.play().catch(() => {})
        fadeIn(audio)
      }
    }
  }, TICK_MS)
}

function fadeIn(audio: HTMLAudioElement) {
  clearFade()
  const inSteps = FADE_IN_MS / TICK_MS
  let step = 0
  _fadeTimer = setInterval(() => {
    step++
    audio.volume = Math.min(1, step / inSteps)
    if (step >= inSteps) {
      clearFade()
      audio.volume = 1
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
  if (type === 'maintitle') {
    if (_currentType === 'maintitle') return
    _currentType = 'maintitle'
    fadeSwitch('/maintitle.mp3')
  } else {
    _currentType = 'session'
    fadeSwitch(pickSession())
  }
}

// ── React フック ──

function trackTypeFor(path: string): 'maintitle' | 'session' {
  return path === '/drill' || path === '/boss' ? 'session' : 'maintitle'
}

export function useAudio() {
  const location = useLocation()

  // ルート変化時の BGM 切り替え（BGM 開始は SplashScreen のボタンで行う）
  useEffect(() => {
    switchBgm(trackTypeFor(location.pathname))
  }, [location.pathname])
}

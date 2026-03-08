import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ── 定数 ──

const SESSION_TRACKS = [
  '/session1.mp3', '/session2.mp3', '/session3.mp3', '/session4.mp3',
  '/session5.mp3', '/session6.mp3', '/session7.mp3', '/session8.mp3',
]
const ALL_TRACKS = ['/maintitle.mp3', ...SESSION_TRACKS]
const FADE_OUT_S = 0.8
const FADE_IN_S = 0.6

// ── モジュール読み込み直後に全トラックをフェッチ開始 ──
// （ユーザー操作なしでも fetch は可能）

const _fetchMap = new Map<string, Promise<ArrayBuffer>>()
ALL_TRACKS.forEach(src => {
  _fetchMap.set(src, fetch(src).then(r => r.arrayBuffer()))
})

// ── Web Audio API シングルトン ──

let _ctx: AudioContext | null = null
let _gainNode: GainNode | null = null
let _source: AudioBufferSourceNode | null = null
let _currentSrc = ''
let _currentType: 'maintitle' | 'session' | null = null
let _lastSessionSrc = ''
const _bufferMap = new Map<string, AudioBuffer>()

async function getBuffer(src: string): Promise<AudioBuffer | null> {
  if (!_ctx) return null
  if (_bufferMap.has(src)) return _bufferMap.get(src)!
  const raw = await _fetchMap.get(src)
  if (!raw || !_ctx) return null
  // slice(0) でコピーを渡す（decodeAudioData は ArrayBuffer を detach するため）
  const buf = await _ctx.decodeAudioData(raw.slice(0))
  _bufferMap.set(src, buf)
  return buf
}

async function playBuffer(src: string, fadeIn: boolean) {
  if (!_ctx || !_gainNode) return
  const buf = await getBuffer(src)
  if (!buf || !_ctx || !_gainNode) return

  if (_source) {
    try { _source.stop() } catch (_) { /* already stopped */ }
    _source.disconnect()
  }

  _source = _ctx.createBufferSource()
  _source.buffer = buf
  _source.loop = true
  _source.connect(_gainNode)

  const now = _ctx.currentTime
  _gainNode.gain.cancelScheduledValues(now)
  if (fadeIn) {
    _gainNode.gain.setValueAtTime(0, now)
    _gainNode.gain.linearRampToValueAtTime(1, now + FADE_IN_S)
  } else {
    _gainNode.gain.setValueAtTime(1, now)
  }
  _source.start()
  _currentSrc = src
}

async function fadeSwitch(src: string) {
  if (_currentSrc === src) return

  if (!_ctx || !_gainNode || !_source) {
    await playBuffer(src, false)
    return
  }

  // フェードアウト（Web Audio API のスケジューラでネイティブ処理）
  const now = _ctx.currentTime
  _gainNode.gain.cancelScheduledValues(now)
  _gainNode.gain.setValueAtTime(_gainNode.gain.value, now)
  _gainNode.gain.linearRampToValueAtTime(0, now + FADE_OUT_S)

  // フェードアウト完了後に次のトラックを再生
  setTimeout(() => playBuffer(src, true), FADE_OUT_S * 1000)
}

function pickSession(): string {
  const pool = SESSION_TRACKS.filter(s => s !== _lastSessionSrc)
  const src = pool[Math.floor(Math.random() * pool.length)]
  _lastSessionSrc = src
  return src
}

/** SplashScreen の BOOT ボタンから呼ぶ。AudioContext 作成は必ずユーザー操作内で行う */
export async function initAudio() {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  _ctx = new Ctx()
  await _ctx.resume()

  _gainNode = _ctx.createGain()
  _gainNode.gain.value = 1
  _gainNode.connect(_ctx.destination)

  // maintitle を優先デコード → 即時再生
  await playBuffer('/maintitle.mp3', false)
  _currentType = 'maintitle'

  // 残りのトラックをバックグラウンドでデコード
  SESSION_TRACKS.forEach(src => getBuffer(src).catch(() => {}))
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
  useEffect(() => {
    switchBgm(trackTypeFor(location.pathname))
  }, [location.pathname])
}

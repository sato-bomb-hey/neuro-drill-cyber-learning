import { useState, useEffect } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function GlitchText({ text, className = '', intensity = 'medium' }: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false)
  const [displayText, setDisplayText] = useState(text)

  const chars = '!@#$%^&*<>?/|\\[]{}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  useEffect(() => {
    const intervals = {
      low: [3000, 5000],
      medium: [1500, 3000],
      high: [500, 1500],
    }[intensity]

    const scheduleGlitch = () => {
      const delay = Math.random() * (intervals[1] - intervals[0]) + intervals[0]
      return setTimeout(() => {
        setGlitching(true)

        let iterations = 0
        const maxIterations = 8
        const glitchInterval = setInterval(() => {
          setDisplayText(
            text
              .split('')
              .map((char) => {
                if (char === ' ') return ' '
                if (Math.random() < 0.3) {
                  return chars[Math.floor(Math.random() * chars.length)]
                }
                return char
              })
              .join('')
          )
          iterations++
          if (iterations >= maxIterations) {
            clearInterval(glitchInterval)
            setDisplayText(text)
            setGlitching(false)
            scheduleGlitch()
          }
        }, 50)
      }, delay)
    }

    const timeout = scheduleGlitch()
    return () => clearTimeout(timeout)
  }, [text, intensity])

  return (
    <span
      className={`relative inline-block ${glitching ? 'glitch-text' : ''} ${className}`}
      data-text={text}
    >
      {displayText}
    </span>
  )
}

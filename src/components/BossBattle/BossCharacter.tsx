import type { BossId } from '../../types/game'

interface BossCharacterProps {
  bossId: BossId
  hp: number
  maxHp: number
  isAttacking?: boolean
  compact?: boolean
}

export function BossCharacter({ bossId, hp, maxHp, isAttacking, compact }: BossCharacterProps) {
  const hpPercent = (hp / maxHp) * 100

  return (
    <div className={`flex flex-col items-center gap-2 sm:gap-4 ${isAttacking ? 'animate-pulse' : ''}`}>
      {/* モバイルは縮小、グリッチエフェクトは全体に広がるよう overflow-visible */}
      <div className={`relative ${compact ? 'w-28 h-28 sm:w-40 sm:h-40' : 'w-48 h-48'} overflow-visible`}>
        <BossSVG bossId={bossId} hp={hp} maxHp={maxHp} />
      </div>

      {/* HP Bar — compact時は非表示（上部ゲージで表示済み） */}
      <div className={`${compact ? 'hidden' : 'w-48'}`}>
        <div className="flex justify-between text-xs font-mono text-cyber-red mb-1">
          <span>HP</span>
          <span>{hp}/{maxHp}</span>
        </div>
        <div className="h-3 bg-cyber-black border border-cyber-red/60">
          <div
            className="h-full hp-bar-transition"
            style={{
              width: `${hpPercent}%`,
              backgroundColor: hpPercent > 50 ? '#ff003c' : hpPercent > 25 ? '#ffcc00' : '#ff003c',
              boxShadow: `0 0 8px ${hpPercent > 50 ? '#ff003c' : '#ffcc00'}`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function BossSVG({ bossId, hp, maxHp }: { bossId: BossId; hp: number; maxHp: number }) {
  const hpRatio = hp / maxHp
  const damaged = hpRatio < 0.3

  switch (bossId) {
    case 'NEURAL-CRACKER':
      return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-red">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Geometric head */}
          <polygon points="100,20 160,60 160,140 100,180 40,140 40,60"
            fill="none" stroke="#ff003c" strokeWidth="2" filter="url(#glow-red)"
            className={damaged ? 'animate-pulse' : ''} />
          {/* Circuit patterns */}
          <line x1="100" y1="20" x2="100" y2="180" stroke="#ff003c" strokeWidth="0.5" opacity="0.5" />
          <line x1="40" y1="60" x2="160" y2="140" stroke="#ff003c" strokeWidth="0.5" opacity="0.5" />
          <line x1="160" y1="60" x2="40" y2="140" stroke="#ff003c" strokeWidth="0.5" opacity="0.5" />
          {/* Eyes */}
          <circle cx="80" cy="90" r="8" fill="#ff003c" filter="url(#glow-red)" />
          <circle cx="120" cy="90" r="8" fill="#ff003c" filter="url(#glow-red)" />
          {/* Core */}
          <rect x="88" y="108" width="24" height="24" fill="none" stroke="#ff003c" strokeWidth="1.5"
            transform="rotate(45 100 120)" filter="url(#glow-red)" />
          {/* Antenna */}
          <line x1="100" y1="20" x2="100" y2="5" stroke="#ff003c" strokeWidth="2" />
          <circle cx="100" cy="5" r="3" fill="#ff003c" />
          {/* Arms */}
          <line x1="40" y1="100" x2="10" y2="80" stroke="#ff003c" strokeWidth="2" />
          <circle cx="10" cy="80" r="5" fill="none" stroke="#ff003c" strokeWidth="1.5" />
          <line x1="160" y1="100" x2="190" y2="80" stroke="#ff003c" strokeWidth="2" />
          <circle cx="190" cy="80" r="5" fill="none" stroke="#ff003c" strokeWidth="1.5" />
        </svg>
      )

    case 'THERMAL-BARRIER':
      return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-orange">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="fire-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffcc00" />
              <stop offset="100%" stopColor="#ff003c" />
            </radialGradient>
          </defs>
          {/* Body sphere */}
          <circle cx="100" cy="100" r="50" fill="none" stroke="#ffcc00" strokeWidth="2" filter="url(#glow-orange)" />
          <circle cx="100" cy="100" r="35" fill="url(#fire-grad)" opacity="0.3" />
          {/* Mechanical arms */}
          <line x1="50" y1="100" x2="15" y2="70" stroke="#ffcc00" strokeWidth="3" />
          <rect x="5" y="60" width="15" height="20" fill="none" stroke="#ffcc00" strokeWidth="2" />
          <line x1="150" y1="100" x2="185" y2="70" stroke="#ffcc00" strokeWidth="3" />
          <rect x="180" y="60" width="15" height="20" fill="none" stroke="#ffcc00" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="85" cy="95" r="7" fill="#ffcc00" filter="url(#glow-orange)" />
          <circle cx="115" cy="95" r="7" fill="#ffcc00" filter="url(#glow-orange)" />
          {/* Flame corona */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line key={i}
              x1={100 + 50 * Math.cos((angle * Math.PI) / 180)}
              y1={100 + 50 * Math.sin((angle * Math.PI) / 180)}
              x2={100 + 65 * Math.cos((angle * Math.PI) / 180)}
              y2={100 + 65 * Math.sin((angle * Math.PI) / 180)}
              stroke="#ff003c" strokeWidth="2" opacity="0.6"
            />
          ))}
        </svg>
      )

    case 'VOID-CIPHER':
      return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-purple">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Outer rotating rings */}
          <ellipse cx="100" cy="100" rx="80" ry="25" fill="none" stroke="#9d00ff" strokeWidth="1.5"
            filter="url(#glow-purple)" transform="rotate(30 100 100)" />
          <ellipse cx="100" cy="100" rx="80" ry="25" fill="none" stroke="#9d00ff" strokeWidth="1.5"
            filter="url(#glow-purple)" transform="rotate(-30 100 100)" />
          <ellipse cx="100" cy="100" rx="80" ry="25" fill="none" stroke="#9d00ff" strokeWidth="1.5"
            filter="url(#glow-purple)" transform="rotate(90 100 100)" />
          {/* Central void */}
          <polygon points="100,40 140,80 140,120 100,160 60,120 60,80"
            fill="rgba(157,0,255,0.2)" stroke="#9d00ff" strokeWidth="2" filter="url(#glow-purple)" />
          {/* Inner symbol */}
          <text x="100" y="112" textAnchor="middle" fill="#9d00ff" fontSize="40" fontFamily="monospace"
            filter="url(#glow-purple)">∅</text>
        </svg>
      )

    case 'DATA-PHANTOM':
      return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-cyan">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Ghost body made of data streams */}
          <path d="M 70 50 Q 100 20 130 50 L 140 160 Q 120 180 100 170 Q 80 180 60 160 Z"
            fill="rgba(0,212,255,0.1)" stroke="#00d4ff" strokeWidth="2" filter="url(#glow-cyan)" />
          {/* Data stream lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={75 + i * 12} y1="60" x2={72 + i * 12} y2="155"
              stroke="#00d4ff" strokeWidth="1" opacity="0.4" strokeDasharray="4 4" />
          ))}
          {/* Eyes */}
          <circle cx="87" cy="90" r="9" fill="none" stroke="#00d4ff" strokeWidth="2" filter="url(#glow-cyan)" />
          <circle cx="113" cy="90" r="9" fill="none" stroke="#00d4ff" strokeWidth="2" filter="url(#glow-cyan)" />
          <circle cx="87" cy="90" r="4" fill="#00d4ff" />
          <circle cx="113" cy="90" r="4" fill="#00d4ff" />
          {/* Floating particles */}
          {[1, 2, 3].map((i) => (
            <circle key={i} cx={40 + i * 20} cy={190 - i * 5} r="2" fill="#00d4ff" opacity="0.5" />
          ))}
        </svg>
      )

    case 'QUANTUM-WALL':
      return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-green">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Grid barrier */}
          {[0, 1, 2, 3, 4, 5].map((row) =>
            [0, 1, 2, 3, 4, 5].map((col) => (
              <rect key={`${row}-${col}`}
                x={40 + col * 22} y={40 + row * 22}
                width="18" height="18"
                fill="rgba(0,255,157,0.1)" stroke="#00ff9d" strokeWidth="0.5"
                filter="url(#glow-green)" opacity={Math.random() > 0.3 ? 1 : 0.3} />
            ))
          )}
          {/* Central core */}
          <circle cx="100" cy="100" r="20" fill="none" stroke="#00ff9d" strokeWidth="3"
            filter="url(#glow-green)" />
          <circle cx="100" cy="100" r="10" fill="#00ff9d" opacity="0.5" />
        </svg>
      )

    case 'NEURAL-HYDRA':
      return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow-multi">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Central node */}
          <circle cx="100" cy="130" r="20" fill="none" stroke="#00d4ff" strokeWidth="2" filter="url(#glow-multi)" />
          <circle cx="100" cy="130" r="10" fill="#00d4ff" opacity="0.4" />
          {/* Tentacle nodes */}
          {[
            { cx: 40, cy: 60, color: '#ff003c' },
            { cx: 100, cy: 40, color: '#00ff9d' },
            { cx: 160, cy: 60, color: '#9d00ff' },
            { cx: 30, cy: 130, color: '#ffcc00' },
            { cx: 170, cy: 130, color: '#00d4ff' },
          ].map((node, i) => (
            <g key={i}>
              <line x1="100" y1="130" x2={node.cx} y2={node.cy}
                stroke={node.color} strokeWidth="2" opacity="0.6"
                strokeDasharray="4 2" />
              <circle cx={node.cx} cy={node.cy} r="14"
                fill="none" stroke={node.color} strokeWidth="2"
                filter="url(#glow-multi)" />
              <circle cx={node.cx} cy={node.cy} r="6" fill={node.color} opacity="0.5" />
            </g>
          ))}
        </svg>
      )
  }
}

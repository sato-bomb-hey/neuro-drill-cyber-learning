import { type ReactNode } from 'react'

interface CyberPanelProps {
  children: ReactNode
  title?: string
  variant?: 'blue' | 'green' | 'red'
  className?: string
}

const variantStyles = {
  blue: {
    border: 'border-cyber-blue/40',
    title: 'text-cyber-blue',
    corner: 'bg-cyber-blue',
    glow: 'shadow-[inset_0_0_20px_rgba(0,212,255,0.05)]',
  },
  green: {
    border: 'border-cyber-green/40',
    title: 'text-cyber-green',
    corner: 'bg-cyber-green',
    glow: 'shadow-[inset_0_0_20px_rgba(0,255,157,0.05)]',
  },
  red: {
    border: 'border-cyber-red/40',
    title: 'text-cyber-red',
    corner: 'bg-cyber-red',
    glow: 'shadow-[inset_0_0_20px_rgba(255,0,60,0.05)]',
  },
}

export function CyberPanel({ children, title, variant = 'blue', className = '' }: CyberPanelProps) {
  const styles = variantStyles[variant]

  return (
    <div className={`relative border ${styles.border} ${styles.glow} bg-cyber-black/80 ${className}`}>
      {/* Corner decorations */}
      <div className={`absolute top-0 left-0 w-2 h-2 ${styles.corner}`} />
      <div className={`absolute top-0 right-0 w-2 h-2 ${styles.corner}`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 ${styles.corner}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 ${styles.corner}`} />

      {title && (
        <div className={`px-4 py-2 border-b ${styles.border} font-mono text-sm ${styles.title} tracking-widest uppercase`}>
          &gt;&gt; {title}
        </div>
      )}

      <div className="p-4 scan-line">
        {children}
      </div>
    </div>
  )
}

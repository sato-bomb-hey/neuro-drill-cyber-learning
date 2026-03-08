import { GlitchText } from './ui/GlitchText'

interface Props {
  onStart: () => void
}

export function SplashScreen({ onStart }: Props) {
  const handleStart = () => {
    onStart()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className="text-center">
        <div className="text-cyber-blue/60 text-xs font-mono tracking-widest mb-4">
          {'// SYSTEM BOOT SEQUENCE //'}
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold font-mono neon-text-blue mb-2">
          <GlitchText text="NEURO-DRILL" intensity="low" />
        </h1>
        <div className="text-cyber-green/70 font-mono text-sm tracking-widest">
          CYBER-LEARNING OS v2.0
        </div>
      </div>

      <div className="text-cyber-blue/40 font-mono text-xs text-center">
        {'>>> NEURAL INTERFACE READY <<<'}
      </div>

      <button
        onClick={handleStart}
        className="
          relative px-10 py-5 font-mono font-bold text-xl tracking-widest
          border-2 border-cyber-green text-cyber-green
          hover:bg-cyber-green hover:text-cyber-black
          transition-all duration-200
          before:absolute before:inset-0 before:bg-cyber-green/10
          animate-pulse
        "
      >
        &gt; BOOT SYSTEM
      </button>

      <div className="text-cyber-blue/30 font-mono text-xs">
        TAP TO START
      </div>
    </div>
  )
}

export function ScanLine() {
  return (
    <>
      {/* Static scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />
      {/* Moving scan line */}
      <div
        className="fixed left-0 right-0 h-px pointer-events-none z-50"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.4), transparent)',
          animation: 'scan-line-move 8s linear infinite',
          top: 0,
        }}
      />
    </>
  )
}

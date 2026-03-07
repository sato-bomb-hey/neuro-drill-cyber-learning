/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0a0a0f',
        'cyber-blue': '#00d4ff',
        'cyber-green': '#00ff9d',
        'cyber-red': '#ff003c',
        'cyber-purple': '#9d00ff',
        'cyber-yellow': '#ffcc00',
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Roboto Mono"', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 1s infinite',
        'scan': 'scan 3s linear infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-2px, 1px)' },
          '66%': { transform: 'translate(2px, -1px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #00d4ff',
        'neon-green': '0 0 5px #00ff9d, 0 0 20px #00ff9d, 0 0 40px #00ff9d',
        'neon-red': '0 0 5px #ff003c, 0 0 20px #ff003c, 0 0 40px #ff003c',
      },
    },
  },
  plugins: [],
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'music',
  build: {
    outDir: 'public',
    emptyOutDir: true,
  },
})

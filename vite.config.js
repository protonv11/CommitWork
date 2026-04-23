import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
      manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor'
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router/')) return 'router'
          if (id.includes('node_modules/framer-motion')) return 'motion'
        }
      }
    }
  }
})

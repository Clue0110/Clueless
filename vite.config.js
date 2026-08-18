import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import seo from './scripts/vite-plugin-seo.mjs'

export default defineConfig({
  plugins: [react(), seo()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'framer': ['framer-motion'],
        },
      },
    },
  },
})

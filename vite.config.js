import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 상대 경로로 변경 (중요!)
  server: {
    port: 5173
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite конфигурация: React plugin + базовые настройки SPA.
// Vercel автоматически определяет Vite по этому файлу.
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
  },
})

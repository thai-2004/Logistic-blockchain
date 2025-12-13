import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@features': '/src/features',
      '@app': '/src/app',
      '@services': '/src/services',
      '@shared': '/src/shared',
      '@hooks': '/src/hooks',
      '@contexts': '/src/contexts',
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  }, 
})

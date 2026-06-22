import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command === 'build' ? '/periodic-table-app/' : '/',
    server: {
      host: '127.0.0.1',
    },
  }
})


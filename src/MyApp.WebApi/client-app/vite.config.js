import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7118', // your ASP.NET backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

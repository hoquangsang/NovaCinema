import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from "@tailwindcss/vite";


export default defineConfig({
  plugins: [
    react(),
    tailwind(),
  ],
  resolve: { alias: { '@': '/src' } },
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // backend NestJS
    },
  },
})

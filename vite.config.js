import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Removed `open: true` — the browser was opening before the Express
    // backend (port 5000) finished booting, causing network errors on startup.
    // Run `npm run dev` then manually open http://localhost:5173
    proxy: {
      '/api': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/uploads': { target: 'http://127.0.0.1:5000', changeOrigin: true },
    },
  },
  // Pre-bundle heavy dependencies so Vite doesn't re-transform them on each
  // cold start. This dramatically reduces the initial module graph resolution time.
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'gsap',
      '@supabase/supabase-js',
    ],
    // Exclude server-only packages from the frontend bundle
    exclude: [],
  },
  build: {
    // Improve code-splitting in production
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-animation': ['framer-motion', 'gsap'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
})
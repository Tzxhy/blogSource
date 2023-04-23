import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: path.resolve('..', 'public', 'web-tools'),
  },
  plugins: [
    react(),
    VitePWA(),
  ],
})

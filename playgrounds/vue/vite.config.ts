import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { cloudflareGraphPlugin } from './plugins/cloudflare-graph-vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    cloudflareGraphPlugin(),
  ],
})

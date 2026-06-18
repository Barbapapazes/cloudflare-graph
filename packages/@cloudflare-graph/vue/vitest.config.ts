import { defineConfig } from 'vitest/config'
import icons from 'unplugin-icons/rolldown'
import vue from 'unplugin-vue/rolldown'

export default defineConfig({
  plugins: [
    vue(),
    icons(),
  ],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
  }
})

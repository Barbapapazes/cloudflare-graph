import icons from 'unplugin-icons/rolldown'
import vue from 'unplugin-vue/rolldown'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    vue(),
    icons(),
  ],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
  },
})

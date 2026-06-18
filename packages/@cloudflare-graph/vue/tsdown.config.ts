import { defineConfig } from 'tsdown'
import icons from 'unplugin-icons/rolldown'
import vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: [
    './src/index.ts',
  ],
  css: {
    inject: true,
  },
  copy: [
    {
      from: './src/style.css',
      to: './dist',
    },
  ],
  unbundle: true,
  platform: 'neutral',
  tsconfig: './tsconfig.build.json',
  plugins: [
    vue({ isProduction: true }),
    icons(),
  ],
  dts: {
    vue: true,
  },
})

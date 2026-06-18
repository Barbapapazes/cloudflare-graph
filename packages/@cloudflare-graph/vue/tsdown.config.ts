import { defineConfig } from 'tsdown'
import icons from 'unplugin-icons/rolldown'
import vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/types/index.ts',
    './src/utils/index.ts'
  ],
  copy: [
    {
      from: './src/components/*.vue',
      to: './dist/components',
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

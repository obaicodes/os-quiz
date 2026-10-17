import { svelte } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const bankDir = fileURLToPath(new URL('../data/bank', import.meta.url))

export default defineConfig({
  // Relative asset paths so the build works under any GitHub Pages sub-path.
  base: './',
  plugins: [svelte()],
  resolve: {
    alias: { '@bank': bankDir },
  },
  server: {
    // The question bank lives outside web/ (in ../data/bank).
    fs: { allow: ['..'] },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
})

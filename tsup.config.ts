import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: ['src/main.ts'],
  format: ['esm'],
  target: 'es2022',
  outDir: 'dist',
})

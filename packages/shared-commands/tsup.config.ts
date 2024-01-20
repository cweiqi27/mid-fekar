import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: ['index.ts'],
  format: ['esm'],
  target: 'es2022',
  outDir: 'dist',
})

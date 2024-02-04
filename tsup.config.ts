import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/mod.ts'],
  minify: false,
  skipNodeModulesBundle: true,
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: 'inline',
  outDir: 'dist',
  keepNames: true,
});

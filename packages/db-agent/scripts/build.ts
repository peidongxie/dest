import { build, type BuildOptions } from 'esbuild';

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['src/index.ts'],
  external: ['@dest/http-server'],
  format: 'esm',
  inject: [],
  loader: {},
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  outdir: 'dist',
  platform: 'node',
  sourcemap: false,
  splitting: true,
  target: 'esnext',
  watch: false,
  write: true,
};

(async () => {
  await build(buildOptions);
})();

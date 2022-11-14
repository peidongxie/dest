import { build, type BuildOptions } from 'esbuild';
import { readdirSync, statSync } from 'fs-extra';
import { join } from 'path';

const getEntryPoints = (dir: string): string[] => {
  const files = readdirSync(dir);
  return files
    .map((file) => {
      const path = join(dir, file);
      const stats = statSync(path);
      if (stats.isDirectory()) {
        if (path === 'node_modules') return null;
        if (path === 'scripts') return null;
        return getEntryPoints(path);
      }
      if (stats.isFile()) {
        if (/\.d\.ts$/.test(file)) return null;
        if (!/\.ts$/.test(file)) return null;
        return path;
      }
      return null;
    })
    .filter((v): v is string[] | string => v !== null)
    .flat();
};

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: getEntryPoints('.'),
  external: ['@grpc/grpc-js'],
  format: 'esm',
  inject: [],
  loader: {},
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  outdir: '.',
  platform: 'node',
  sourcemap: false,
  splitting: true,
  target: 'es2018',
  watch: false,
  write: true,
  chunkNames: 'chunks/[hash]',
};

(async () => {
  await build(buildOptions);
})();

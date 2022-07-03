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
        return getEntryPoints(path);
      } else if (/.ts$/.test(file)) {
        return path;
      } else {
        return null;
      }
    })
    .filter((v): v is string[] | string => v !== null)
    .flat();
};

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: getEntryPoints('src'),
  external: ['co-body', 'formidable', 'type-is'],
  format: 'esm',
  inject: [],
  loader: {},
  minify: false,
  minifyWhitespace: false,
  minifyIdentifiers: false,
  minifySyntax: false,
  outdir: '.',
  platform: 'node',
  sourcemap: false,
  splitting: true,
  target: 'esnext',
  watch: false,
  write: true,
  chunkNames: 'chunks/[hash]',
};

(async () => {
  await build(buildOptions);
})();

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
  // General options
  bundle: true,
  platform: 'node',
  tsconfig: 'tsconfig.json',
  // Input
  entryPoints: getEntryPoints('.'),
  // Output contents
  format: 'esm',
  splitting: true,
  // Output location
  chunkNames: 'chunks/[hash]',
  outdir: '.',
  write: true,
  // Path resolution
  external: ['@grpc/grpc-js'],
  // Transformation
  target: 'es2018',
  // Optimization
  minify: true,
  // Source maps
  sourcemap: false,
  // Build metadata
  metafile: true,
  // Logging
  color: true,
  // Plugins
  plugins: [],
};

(async () => {
  await build(buildOptions);
})();

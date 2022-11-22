import { fork, type ChildProcess } from 'child_process';
import { build, type BuildOptions } from 'esbuild';

let childProcess: ChildProcess | null = null;

const startChildProcess = () => {
  if (!childProcess) {
    childProcess = fork('dist/index.js');
  }
};

const stopChildProcess = () => {
  if (childProcess) {
    childProcess.kill();
    childProcess = null;
  }
};

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['src/index.ts'],
  external: [
    '@dest-toolkit/grpc-server',
    '@dest-toolkit/http-server',
    'sqlite3',
    'typeorm',
  ],
  format: 'esm',
  inject: [],
  loader: {},
  minify: false,
  minifyWhitespace: false,
  minifyIdentifiers: false,
  minifySyntax: false,
  outdir: 'dist',
  platform: 'node',
  sourcemap: false,
  splitting: true,
  target: 'esnext',
  watch: {
    onRebuild: () => {
      stopChildProcess();
      startChildProcess();
    },
  },
  write: true,
};

(async () => {
  await build(buildOptions);
  startChildProcess();
})();

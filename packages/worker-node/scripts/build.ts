import { execSync } from 'child_process';
import { build, type BuildOptions } from 'esbuild';
import { existsSync, readdirSync, statSync } from 'fs-extra';
import { join } from 'path';

const getEntryPoints = (dir: string): string[] => {
  const files = readdirSync(dir);
  return files
    .map((file) => {
      const path = join(dir, file);
      const stats = statSync(path);
      if (!stats.isDirectory()) return null;
      if (!existsSync(join(path, 'proto.proto'))) return null;
      return path;
    })
    .filter((v): v is string => v !== null);
};

const getCommand = (entryPoint: string): string => {
  return [
    'grpc_tools_node_protoc',
    '--proto_path=' + entryPoint,
    '--plugin=./node_modules/.bin/protoc-gen-ts_proto',
    '--ts_proto_out=' + entryPoint,
    '--ts_proto_opt=esModuleInterop=true,outputServices-grpc-js',
    join(entryPoint, 'proto.proto'),
  ].join(' ');
};

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['src/index.ts'],
  external: ['@dest-toolkit/http-server', 'sqlite3', 'typeorm'],
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
  const entryPoints = getEntryPoints('./src/controller');
  for (const entryPoint of entryPoints) {
    const command = getCommand(entryPoint);
    execSync(command);
  }
  await build(buildOptions);
})();

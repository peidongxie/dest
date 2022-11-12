import { execSync } from 'child_process';
import { build, type BuildOptions } from 'esbuild';
import { readdirSync, statSync } from 'fs-extra';
import { dirname, extname, join, relative } from 'path';

const getEntryPoints = (dir: string): string[] => {
  const files = readdirSync(dir);
  return files
    .map((file) => {
      const path = join(dir, file);
      const stats = statSync(path);
      if (stats.isDirectory()) {
        return getEntryPoints(path).map((entryPoint) => join(path, entryPoint));
      }
      if (stats.isFile()) {
        if (extname(file) !== '.proto') return null;
        return path.substring(0, path.length - 6);
      }
      return null;
    })
    .filter((v): v is string[] | string => v !== null)
    .flat()
    .map((entryPoint) => relative(dir, entryPoint));
};

const getCommands = (entryPoint: string): string[] => {
  const protoPath = join('protos', entryPoint + '.proto');
  const protoDir = dirname(protoPath);
  const sourcePath = join('protos', entryPoint + '.ts');
  const targetPath = join('src/controller', entryPoint, 'proto.ts');
  const protoc = [
    'grpc_tools_node_protoc',
    '--proto_path=' + protoDir,
    '--plugin=node_modules/.bin/protoc-gen-ts_proto',
    '--ts_proto_out=' + protoDir,
    '--ts_proto_opt=esModuleInterop=true,outputServices-grpc-js',
    protoPath,
  ].join(' ');
  const mv = ['mv', sourcePath, targetPath].join(' ');
  const sed = [
    'sed',
    '-i',
    '""',
    '-e',
    '1d',
    '-e',
    '"s/extends {}/extends Record<string, unknown>/g"',
    '-e',
    '"s/| Function/| ((...args: never[]) => void)/g"',
    '-e',
    '"s/value: any/value: unknown/g"',
    '-e',
    '"s/: any/: Record<string, unknown>/g"',
    targetPath,
  ].join(' ');
  const eslint = ['eslint', '--fix', targetPath].join(' ');
  return [protoc, mv, sed, eslint];
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
  const entryPoints = getEntryPoints('protos');
  for (const entryPoint of entryPoints) {
    const commands = getCommands(entryPoint);
    for (const command of commands) {
      execSync(command);
    }
  }
  await build(buildOptions);
})();

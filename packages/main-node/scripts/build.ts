import { execSync } from 'child_process';
import { build, type BuildOptions } from 'esbuild';
import { existsSync, readdirSync, statSync } from 'fs-extra';
import { dirname, extname, join, relative } from 'path';

const getEntryPoints = (dir: string): string[] => {
  const files = readdirSync(dir);
  return files
    .map((file) => {
      const path = join(dir, file);
      const stats = statSync(path);
      if (stats.isDirectory()) {
        return getEntryPoints(path);
      }
      if (stats.isFile()) {
        if ('.proto' === extname(file)) {
          return path;
        }
      }
      return null;
    })
    .filter((v): v is string[] | string => v !== null)
    .flat();
};

const execCommand = (command: string[]): void => {
  try {
    execSync(command.join(' '));
  } catch (e) {
    const { stdout } = e as { stdout: Buffer };
    console.error(stdout?.toString());
  }
};

const protoc = (source: string, target: string): void => {
  if (!existsSync(source)) return;
  const stats = statSync(source);
  if (!stats.isFile()) return;
  const ext = extname(source);
  if (ext !== '.proto') return;
  execCommand([
    'grpc_tools_node_protoc',
    '--proto_path=' + dirname(source),
    '--plugin=node_modules/.bin/protoc-gen-ts_proto',
    '--ts_proto_out=' + target,
    '--ts_proto_opt=esModuleInterop=true,outputServices=generic-definitions',
    source,
  ]);
};

const mv = (source: string, target: string): void => {
  if (!existsSync(source)) return;
  execCommand(['mv', source, target]);
};

const eslint = (path: string): void => {
  if (!existsSync(path)) return;
  const stats = statSync(path);
  if (!stats.isFile()) return;
  const ext = extname(path);
  if (ext !== '.ts') return;
  execCommand(['eslint', '--fix', path]);
};

const sed = (path: string): void => {
  if (!existsSync(path)) return;
  const stats = statSync(path);
  if (!stats.isFile()) return;
  const ext = extname(path);
  if (ext !== '.ts') return;
  execCommand([
    'sed',
    '-i',
    '""',
    '-e',
    '"s/eslint-disable/eslint-disable @typescript-eslint\\/no-explicit-any,@typescript-eslint\\/no-non-null-assertion/g"',
    '-e',
    '"s/| Function/| ((...args: never[]) => void)/g"',
    '-e',
    '"s/T extends {}/T extends Record<string, unknown>/g"',
    path,
  ]);
};

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['src/index.ts'],
  external: ['@dest-toolkit/grpc-client', '@dest-toolkit/http-client'],
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
  const entryPoints = getEntryPoints('../worker-node/protos');
  for (const entryPoint of entryPoints) {
    const dir = dirname(relative('../worker-node/protos', entryPoint));
    const protoPath = join('../worker-node/protos', dir, 'index.proto');
    const sourcePath = join('../worker-node/protos', dir, 'index.ts');
    const targetPath = join('src/worker', dir, 'proto.ts');
    protoc(protoPath, dirname(sourcePath));
    mv(sourcePath, targetPath);
    sed(targetPath);
    eslint(targetPath);
  }
  await build(buildOptions);
})();

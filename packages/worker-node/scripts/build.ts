import { execSync } from 'child_process';
import { build, type BuildOptions } from 'esbuild';
import { existsSync, readdirSync, statSync } from 'fs-extra';
import { basename, dirname, extname, join } from 'path';

const getEntryPoints = (dir: string): string[] => {
  const files = readdirSync(dir);
  return files
    .map((file) => {
      const stats = statSync(join(dir, file));
      if (stats.isFile() && '.proto' === extname(file)) {
        return basename(file, '.proto');
      }
      return null;
    })
    .filter((v): v is string => v !== null);
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

const createProto = () => {
  for (const entryPoint of getEntryPoints('protos')) {
    const protoPath = join('protos', entryPoint + '.proto');
    const sourcePath = join('protos', entryPoint + '.ts');
    const targetPath = join('src', 'domain', 'proto', entryPoint + '.ts');
    protoc(protoPath, dirname(sourcePath));
    mv(sourcePath, targetPath);
    sed(targetPath);
    eslint(targetPath);
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
  createProto();
  await build(buildOptions);
})();

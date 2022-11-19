import { execSync } from 'child_process';
import { build, type BuildOptions } from 'esbuild';
import { existsSync, readdirSync, statSync } from 'fs-extra';
import { basename, dirname, extname, join } from 'path';

const getEntryPoints = (
  dir: string,
  type: 'isFile' | 'isDirectory',
): string[] => {
  const files = readdirSync(dir);
  return files
    .map((file) => {
      const path = join(dir, file);
      const stats = statSync(path);
      if (stats[type]()) return file;
      return null;
    })
    .filter((v): v is string => v !== null);
};

const getExtraDependencies = (dir: string): string[] => {
  const files = readdirSync(dir);
  return files
    .map((file) => {
      const path = join(dir, file);
      const stats = statSync(path);
      if (stats.isDirectory()) return getExtraDependencies(path);
      if (stats.isFile()) return path;
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
    '--ts_proto_opt=esModuleInterop=true',
    source,
  ]);
};

const rm = (path: string): void => {
  if (!existsSync(path)) return;
  execCommand(['rm', '-r', path]);
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
    '"/^declare var /d"',
    '-e',
    '"/^var globalThis:/,/^$/d"',
    '-e',
    '"s/!)/)/g"',
    '-e',
    '"s/!,/,/g"',
    '-e',
    '"s/(e: any)/(e)/g"',
    '-e',
    '"s/(object: any)/(object: Record<string, unknown>)/g"',
    '-e',
    '"s/(value: any)/(value: unknown)/g"',
    '-e',
    '"s/.\\/google\\/protobuf/..\\/google\\/protobuf/g"',
    '-e',
    '"s/bytesFromBase64(object.value)/bytesFromBase64(object.value as string)/g"',
    '-e',
    '"s/extends {}/extends Record<string, unknown>/g"',
    '-e',
    '"s/obj: any/obj: Record<string, unknown>/g"',
    '-e',
    '"s/| Function/| ((...args: never[]) => void)/g"',
    '-e',
    '1d',
    path,
  ]);
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
  const entryFiles = getEntryPoints('protos', 'isFile');
  for (const entryFile of entryFiles) {
    const ext = extname(entryFile);
    if (ext !== '.proto') continue;
    const base = basename(entryFile, ext);
    const protoPath = join('protos', base + '.proto');
    const sourcePath = join('protos', base + '.ts');
    const targetPath = join('src/controller', base, 'proto.ts');
    protoc(protoPath, 'protos');
    mv(sourcePath, targetPath);
    sed(targetPath);
    eslint(targetPath);
  }
  const entryDirectories = getEntryPoints('protos', 'isDirectory');
  for (const entryDirectory of entryDirectories) {
    const sourcePath = join('protos', entryDirectory);
    const targetPath = join('src/controller', entryDirectory);
    rm(targetPath);
    mv(sourcePath, targetPath);
    const extraDependencies = getExtraDependencies(targetPath);
    for (const extraDependency of extraDependencies) {
      sed(extraDependency);
      eslint(extraDependency);
    }
  }
  await build(buildOptions);
})();

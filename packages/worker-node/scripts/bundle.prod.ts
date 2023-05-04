import { spawn } from 'child_process';
import { build, type BuildOptions } from 'esbuild';
import {
  existsSync,
  moveSync,
  readFileSync,
  removeSync,
  statSync,
} from 'fs-extra';
import { dirname, extname } from 'path';

const runCommand = async (
  command: string,
  args: string[],
  ignore = false,
): Promise<void> => {
  const child = spawn(command, args);
  if (!ignore) {
    child.stdout.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    child.stderr.on('data', (chunk) => {
      console.error(chunk.toString());
    });
  }
  return new Promise((resolve) => {
    child.on('close', resolve);
  });
};

const protoc = async (protoPath: string, tsPath: string): Promise<void> => {
  if (!existsSync(protoPath)) return;
  const stats = statSync(protoPath);
  if (!stats.isFile()) return;
  const ext = extname(protoPath);
  if (ext !== '.proto') return;
  return runCommand('grpc_tools_node_protoc', [
    '--proto_path=' + dirname(protoPath),
    '--plugin=node_modules/.bin/protoc-gen-ts_proto',
    '--ts_proto_out=' + tsPath,
    '--ts_proto_opt=esModuleInterop=true,outputServices=generic-definitions',
    protoPath,
  ]);
};

const sed = async (path: string): Promise<void> => {
  if (!existsSync(path)) return;
  const stats = statSync(path);
  if (!stats.isFile()) return;
  const ext = extname(path);
  if (ext !== '.ts') return;
  return runCommand('sed', [
    '-i.bak',
    '-e',
    '"s/eslint-disable/eslint-disable @typescript-eslint\\/no-explicit-any,@typescript-eslint\\/no-non-null-assertion/g"',
    '-e',
    '"s/| Function/| ((...args: never[]) => void)/g"',
    '-e',
    '"s/T extends {}/T extends Record<string, unknown>/g"',
    path,
  ]);
};

const eslint = async (path: string): Promise<void> => {
  if (!existsSync(path)) return;
  const stats = statSync(path);
  if (!stats.isFile()) return;
  const ext = extname(path);
  if (ext !== '.ts') return;
  return runCommand('eslint', ['--fix', path]);
};

const buildProtoOptions: BuildOptions = {
  // General options
  bundle: true,
  platform: 'node',
  tsconfig: 'tsconfig.json',
  // Input
  entryPoints: [
    'protos/agent.proto',
    'protos/database.proto',
    'protos/hierarchy.proto',
    'protos/query.proto',
  ],
  // Output contents
  format: 'esm',
  splitting: true,
  // Output location
  outdir: 'src/domain/proto',
  write: true,
  // Path resolution
  external: [],
  // Transformation
  target: 'esnext',
  // Optimization
  minify: true,
  // Source maps
  sourcemap: false,
  // Build metadata
  metafile: true,
  // Logging
  color: true,
  // Plugins
  plugins: [
    {
      name: 'proto',
      setup(build) {
        build.onLoad({ filter: /\.proto$/ }, async (args) => {
          const protoPath = args.path;
          const tsPath = protoPath.replace(/\.proto$/, '.ts');
          const bakPath = tsPath + '.bak';
          await protoc(protoPath, dirname(tsPath));
          await sed(tsPath);
          await eslint(tsPath);
          const contents = readFileSync(tsPath);
          removeSync(tsPath);
          removeSync(bakPath);
          return {
            contents,
            loader: 'copy',
          };
        });
        build.onEnd((result) => {
          for (const entry of Object.entries(result.metafile?.outputs || {})) {
            const sourcePath = entry[0];
            const targetPath = sourcePath.replace(/\.proto$/, '.ts');
            moveSync(sourcePath, targetPath, { overwrite: true });
          }
        });
      },
    },
  ],
};

const buildTsOptions: BuildOptions = {
  // General options
  bundle: true,
  platform: 'node',
  tsconfig: 'tsconfig.json',
  // Input
  entryPoints: ['src/index.ts'],
  // Output contents
  format: 'esm',
  splitting: true,
  // Output location
  outdir: 'dist',
  write: true,
  // Path resolution
  external: [
    '@dest-toolkit/grpc-server',
    '@dest-toolkit/http-server',
    'sqlite3',
    'typeorm',
  ],
  // Transformation
  target: 'esnext',
  // Optimization
  minify: true,
  // Source maps
  sourcemap: false,
  // Build metadata
  metafile: false,
  // Logging
  color: true,
};

(async () => {
  await build(buildProtoOptions);
  await build(buildTsOptions);
})();

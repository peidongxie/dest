import { spawn, type ChildProcess } from 'child_process';
import { build, type BuildOptions } from 'esbuild';
import {
  existsSync,
  moveSync,
  readFileSync,
  removeSync,
  statSync,
} from 'fs-extra';
import { dirname, extname } from 'path';

const createChildProcess = (
  command: string,
  args: string[],
  ignore = false,
): [ChildProcess, Promise<number | null>] => {
  const childProcess = spawn(command, args);
  if (!ignore) {
    childProcess.stdout.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    childProcess.stderr.on('data', (chunk) => {
      console.error(chunk.toString());
    });
  }
  return [
    childProcess,
    new Promise((resolve) => {
      childProcess.on('close', resolve);
    }),
  ];
};

const protoc = async (protoPath: string, tsPath: string): Promise<void> => {
  if (!existsSync(protoPath)) return;
  const stats = statSync(protoPath);
  if (!stats.isFile()) return;
  const ext = extname(protoPath);
  if (ext !== '.proto') return;
  await createChildProcess('grpc_tools_node_protoc', [
    '--proto_path=' + dirname(protoPath),
    '--plugin=node_modules/.bin/protoc-gen-ts_proto',
    '--ts_proto_out=' + tsPath,
    '--ts_proto_opt=esModuleInterop=true,outputServices=generic-definitions',
    protoPath,
  ])[1];
};

const sed = async (path: string): Promise<void> => {
  if (!existsSync(path)) return;
  const stats = statSync(path);
  if (!stats.isFile()) return;
  const ext = extname(path);
  if (ext !== '.ts') return;
  await createChildProcess('sed', [
    '-i.bak',
    '-e',
    's/eslint-disable/eslint-disable @typescript-eslint\\/no-explicit-any,@typescript-eslint\\/no-non-null-assertion/g',
    '-e',
    's/| Function/| ((...args: never[]) => void)/g',
    '-e',
    's/T extends {}/T extends Record<string, unknown>/g',
    path,
  ])[1];
};

const eslint = async (path: string): Promise<void> => {
  if (!existsSync(path)) return;
  const stats = statSync(path);
  if (!stats.isFile()) return;
  const ext = extname(path);
  if (ext !== '.ts') return;
  await createChildProcess('eslint', ['--fix', path])[1];
};

const buildMainProtoOptions: BuildOptions = {
  // General options
  bundle: true,
  platform: 'node',
  tsconfig: 'tsconfig.json',
  // Input
  entryPoints: [
    'protos/actuality.proto',
    'protos/assertion.proto',
    'protos/client.proto',
    'protos/context.proto',
    'protos/expectation.proto',
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

const buildWorkerProtoOptions: BuildOptions = {
  // General options
  bundle: true,
  platform: 'node',
  tsconfig: '../worker-node/tsconfig.json',
  // Input
  entryPoints: [
    '../worker-node/protos/agent.proto',
    '../worker-node/protos/database.proto',
    '../worker-node/protos/hierarchy.proto',
    '../worker-node/protos/query.proto',
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
    '@dest-toolkit/grpc-client',
    '@dest-toolkit/grpc-server',
    '@dest-toolkit/http-client',
    '@dest-toolkit/http-server',
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
  await build(buildMainProtoOptions);
  await build(buildWorkerProtoOptions);
  await build(buildTsOptions);
})();

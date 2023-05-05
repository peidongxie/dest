import assert from 'assert';
import { spawn, type ChildProcess } from 'child_process';

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

const port = Number(process.env.APP_PORT);
const registry = process.env.NPM_REGISTRY || 'https://registry.npmjs.org/';
const file = 'docker/Dockerfile';
const tag = 'peidongxie/dest-worker-node';
const path = '../../';
assert(Number.isInteger(port) && port > 0 && port < 65536, 'Invalid port');

(async () => {
  await createChildProcess('docker', ['rmi', tag], true)[1];
  await createChildProcess('docker', [
    'build',
    '--build-arg',
    'APP_PORT=' + port,
    '--build-arg',
    'NPM_REGISTRY=' + registry,
    '-f',
    file,
    '-t',
    tag,
    '--progress=plain',
    path,
  ])[1];
})();

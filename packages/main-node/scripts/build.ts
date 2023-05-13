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

const registry = process.env.NPM_REGISTRY || 'https://registry.npmjs.org/';
const file = 'docker/Dockerfile';
const tag = 'peidongxie/dest-main-node';
const path = '../../';

(async () => {
  await createChildProcess('docker', ['rmi', '-f', tag], true)[1];
  await createChildProcess('docker', [
    'build',
    '--build-arg',
    'NPM_REGISTRY=' + registry,
    '-f',
    file,
    '-t',
    tag,
    path,
  ])[1];
})();

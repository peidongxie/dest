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
assert(Number.isInteger(port) && port > 0 && port < 65536, 'Invalid port');

(async () => {
  await createChildProcess('docker', [
    'compose',
    '-f',
    'docker/compose.prod.yaml',
    '-p',
    `dest-${port}`,
    'up',
    '-d',
  ])[1];
})();

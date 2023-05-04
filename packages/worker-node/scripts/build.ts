import { spawn } from 'child_process';

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

const buildArgs = {
  APP_PORT: process.env.APP_PORT || '',
  NPM_REGISTRY: process.env.NPM_REGISTRY || '',
};
const file = 'docker/Dockerfile';
const tag = 'peidongxie/dest-worker-node';
const path = '../../';

(async () => {
  await runCommand('docker', ['rmi', tag], true);
  await runCommand('docker', [
    'build',
    ...Object.entries(buildArgs)
      .filter(([key, value]) => key && value)
      .map(([key, value]) => ['--build-arg', `${key}=${value}`])
      .flat(),
    '-f',
    file,
    '-t',
    tag,
    '--progress=plain',
    path,
  ]);
})();

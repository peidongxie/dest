import { readdirSync, removeSync, statSync } from 'fs-extra';
import { join } from 'path';

const getBuildFiles = (dir: string): string[] => {
  const files = readdirSync(dir);
  return files
    .map((file) => {
      const path = join(dir, file);
      const stats = statSync(path);
      if (stats.isDirectory()) {
        if (path === 'node_modules') return null;
        return getBuildFiles(path);
      }
      if (stats.isFile()) {
        if (/\.d\.ts$/.test(file)) return path;
        if (/\.js$/.test(file)) return path;
        if (/tsconfig\.tsbuildinfo/.test(file)) return path;
        return null;
      }
      return null;
    })
    .filter((v): v is string[] | string => v !== null)
    .flat();
};

for (const file of getBuildFiles('.')) {
  removeSync(file);
}

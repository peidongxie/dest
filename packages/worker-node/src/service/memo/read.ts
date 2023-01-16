import { store } from './constant';

const readMemo = <T>(tags: (boolean | number | string)[]): T | null => {
  if (!store.has(tags)) return null;
  return store.get(tags) as T;
};

const readMemos = <T>(prefix: string[]): T[] => {
  return store.getAll(prefix) as T[];
};

export { readMemo, readMemos };

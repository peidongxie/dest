import { store } from './constant';

const readMemo = <T>(tags: (boolean | number | string)[]): T | null => {
  const key = tags.join();
  if (!store.has(key)) return null;
  const target = store.get(key) as T;
  return target;
};

export { readMemo };
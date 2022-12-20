import { store } from './constant';

const deleteMemo = <T>(tags: (boolean | number | string)[]): T | null => {
  const key = tags.join();
  if (!store.has(key)) return null;
  const target = store.get(key) as T;
  store.delete(key);
  return target;
};

export { deleteMemo };

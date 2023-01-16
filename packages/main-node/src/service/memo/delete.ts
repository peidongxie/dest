import { store } from './constant';

const deleteMemo = <T>(tags: (boolean | number | string)[]): T | null => {
  if (!store.has(tags)) return null;
  const value = store.get(tags) as T;
  store.delete(tags);
  return value;
};

const deleteMemos = <T>(prefix: (boolean | number | string)[]): T[] => {
  const values = store.getAll(prefix) as T[];
  store.deleteAll(prefix);
  return values;
};

export { deleteMemo, deleteMemos };

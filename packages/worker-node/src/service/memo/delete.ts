import { store } from './constant';

const deleteMemo = <T>(tags: string[]): T | null => {
  if (tags.some((tag) => tag.includes(' '))) {
    throw new TypeError('Bad tags');
  }
  const key = tags.join(' ');
  if (!store.has(key)) return null;
  const value = store.get(key) as T;
  store.delete(key);
  return value;
};

const deleteMemos = <T>(prefix: string[]): T[] => {
  if (prefix.some((tag) => tag.includes(' '))) {
    throw new TypeError('Bad tags');
  }
  const reg = RegExp(`^${prefix.join(' ')}([ ]|$)`);
  const keys: string[] = [];
  const values: T[] = [];
  for (const [key, value] of store) {
    if (reg.test(key)) {
      keys.push(key);
      values.push(value as T);
    }
  }
  for (const key of keys) {
    store.delete(key);
  }
  return values;
};

export { deleteMemo, deleteMemos };

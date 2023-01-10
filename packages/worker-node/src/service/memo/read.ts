import { store } from './constant';

const readMemo = <T>(tags: string[]): T | null => {
  if (tags.some((tag) => tag.includes(' '))) {
    throw new TypeError('Bad tags');
  }
  const key = tags.join(' ');
  if (!store.has(key)) return null;
  const value = store.get(key) as T;
  return value;
};

const readMemos = <T>(prefix: string[]): T[] => {
  if (prefix.some((tag) => tag.includes(' '))) {
    throw new TypeError('Bad tags');
  }
  const reg = RegExp(`^${prefix.join(' ')}([ ]|$)`);
  const values: T[] = [];
  for (const [key, value] of store) {
    if (reg.test(key)) values.push(value as T);
  }
  return values;
};

export { readMemo, readMemos };

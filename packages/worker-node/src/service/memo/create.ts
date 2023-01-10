import { store } from './constant';

const createMemo = <T>(tags: string[], value: T): T | null => {
  if (tags.some((tag) => tag.includes(' '))) {
    throw new TypeError('Bad tags');
  }
  const key = tags.join(' ');
  if (store.has(key)) return null;
  store.set(key, value);
  return value;
};

export { createMemo };

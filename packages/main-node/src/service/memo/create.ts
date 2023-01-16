import { store } from './constant';

const createMemo = <T>(
  tags: (boolean | number | string)[],
  value: T,
): T | null => {
  if (store.has(tags)) return null;
  store.set(tags, value);
  return value;
};

export { createMemo };

import { store } from './store';

const service = <T>(
  tags: (boolean | number | string)[],
  target: T,
): T | null => {
  const key = tags.join();
  if (store.has(key)) return null;
  store.set(key, target);
  return target;
};

export default service;

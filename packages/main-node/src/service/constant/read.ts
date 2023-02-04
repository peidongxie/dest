import { readMemo } from '../memo';

const readSecret = (): string => {
  return readMemo<string>(['constant', 'secret']) || '';
};

export { readSecret };

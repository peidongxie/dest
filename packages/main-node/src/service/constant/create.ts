import { createMemo } from '../memo';

const createSecret = (value: string): void => {
  createMemo(['constant', 'secret'], value);
};

export { createSecret };

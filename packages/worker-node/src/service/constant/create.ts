import { createMemo } from '../memo';

const createSecret = (secret: string): void => {
  createMemo(['constant', 'secret'], secret);
};

export { createSecret };

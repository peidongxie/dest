import { readMemo } from '../memo';

const readAgent = (): string | null => {
  return readMemo<string>(['agent']);
};

export { readAgent };

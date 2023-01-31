import { createDatabases } from '../database';
import { createMemo } from '../memo';

const createAgent = (token: string): Promise<string> | null => {
  const agent = createMemo(['agent'], token);
  if (!agent) return null;
  const promise = createDatabases();
  if (!promise) return null;
  return promise.then(() => agent);
};

export { createAgent };

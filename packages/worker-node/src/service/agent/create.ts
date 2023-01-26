import { randomUUID } from 'crypto';
import { createDatabases } from '../database';
import { createMemo } from '../memo';

const createAgent = (): Promise<string> | null => {
  const agent = createMemo(['agent'], randomUUID());
  if (!agent) return null;
  const promise = createDatabases();
  if (!promise) return null;
  return promise.then(() => agent);
};

export { createAgent };

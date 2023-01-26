import { deleteDatabases } from '../database';
import { deleteMemo } from '../memo';

const deleteAgent = (): Promise<string> | null => {
  const agent = deleteMemo<string>(['agent']);
  if (!agent) return null;
  const promise = deleteDatabases();
  if (!promise) return null;
  return promise.then(() => agent);
};

export { deleteAgent };

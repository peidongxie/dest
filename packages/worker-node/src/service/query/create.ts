import { type AdapterResultItem, type AdapterType } from '../../domain';
import { readDatabase } from '../database';

const createQuery = async <T>(
  type: AdapterType,
  name: string,
  action: 'save' | 'remove' | 'read' | 'write' | 'root',
  target: string,
  values: unknown[],
): Promise<AdapterResultItem<T> | null> => {
  const database = readDatabase(type, name);
  if (!database) return null;
  const result = await database[action]<T>(target, values as T[]);
  if (!result) return null;
  return result;
};

export { createQuery };

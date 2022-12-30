import { type AdapterType } from '../../domain';
import { readDatabase } from '../database';

const createQuery = async <T>(
  type: AdapterType,
  name: string,
  privilege: 'read' | 'write' | 'root',
  query: string,
): Promise<{ time: bigint; result: T[] } | null> => {
  const database = readDatabase(type, name);
  if (!database) return null;
  const start = process.hrtime.bigint();
  const result = await database[privilege]<T>(query);
  if (!result) return null;
  const end = process.hrtime.bigint();
  return {
    time: end - start,
    result,
  };
};

export { createQuery };

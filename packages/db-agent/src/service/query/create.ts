import { type AdapterType } from '../../domain';
import readDatabase from '../database/read';

const service = async <T>(
  type: AdapterType,
  name: string,
  privilege: 'read' | 'root' | 'write',
  query: string,
): Promise<{ time: bigint; result: T } | null> => {
  const database = readDatabase(type, name);
  if (!database) return null;
  const start = process.hrtime.bigint();
  const promise = database[privilege]<T>(query);
  if (!promise) return null;
  const result = await promise;
  const end = process.hrtime.bigint();
  return {
    time: end - start,
    result,
  };
};

export default service;

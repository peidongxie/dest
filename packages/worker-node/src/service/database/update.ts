import { Database, type AdapterType } from '../../domain';
import readDatabase from './read';

const service = async (
  type: AdapterType,
  name: string,
  action: 'remove' | 'save',
  data: { name: string; rows: unknown[] }[],
): Promise<Database | null> => {
  const database = readDatabase(type, name);
  if (!database) return null;
  for (const item of data) {
    await database[action](item.name, item.rows);
  }
  return database;
};

export default service;

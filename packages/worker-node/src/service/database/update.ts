import { type AdapterType, type Database } from '../../domain';
import { readPool } from '../pool';

const updateDatabase = async (
  type: AdapterType,
  name: string,
  action: 'remove' | 'save',
  data: { name: string; rows: unknown[] }[],
): Promise<Database | null> => {
  const database = readPool<Database>(['database', type, name]);
  for (const item of data) {
    await database?.[action](item.name, item.rows);
  }
  return database;
};

export { updateDatabase };

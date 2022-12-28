import { type AdapterType, type Database } from '../../domain';
import { readMemo } from '../memo';

const updateDatabase = async (
  type: AdapterType,
  name: string,
  action: 'save' | 'remove',
  data: { name: string; rows: unknown[] }[],
): Promise<Database | null> => {
  const database = readMemo<Database>(['database', type, name]);
  for (const item of data) {
    await database?.[action](item.name, item.rows);
  }
  return database;
};

export { updateDatabase };

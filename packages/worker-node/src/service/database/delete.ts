import { type AdapterType, type Database } from '../../domain';
import { deletePool } from '../pool';

const deleteDatabase = async (
  type: AdapterType,
  name: string,
): Promise<Database | null> => {
  const database = deletePool<Database>(['database', type, name]);
  return database?.destroy() || null;
};

export { deleteDatabase };

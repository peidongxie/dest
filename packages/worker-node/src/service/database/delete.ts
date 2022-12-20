import { type AdapterType, type Database } from '../../domain';
import { deleteMemo } from '../memo';

const deleteDatabase = async (
  type: AdapterType,
  name: string,
): Promise<Database | null> => {
  const database = deleteMemo<Database>(['database', type, name]);
  return database?.destroy() || null;
};

export { deleteDatabase };

import { type AdapterType, type Database } from '../../domain';
import { deleteMemo, readMemo } from '../memo';
import { createHierarchyQuery } from '../';

const deleteDatabase = async (
  type: AdapterType,
  name: string,
): Promise<Database | null> => {
  const database = readMemo<Database>(['database', type, name]);
  if (!database) return null;
  if (name) {
    await deleteMemo<Database>(['database', type, name])?.destroy();
  } else {
    const results = await createHierarchyQuery(type, '');
    if (!results) return null;
    for (const { table } of results) {
      await deleteMemo<Database>(['database', type, table])?.destroy();
    }
  }
  return database;
};

export { deleteDatabase };

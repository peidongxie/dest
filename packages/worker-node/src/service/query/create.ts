import { type AdapterType, type DatabaseResultItem } from '../../domain';
import { readDatabase } from '../database';

const createCommonQuery = async <T>(
  type: AdapterType,
  name: string,
  action: 'save' | 'remove' | 'read' | 'write' | 'root',
  target: string,
  values: unknown[],
): Promise<DatabaseResultItem<T> | null> => {
  const database = readDatabase(type, name);
  if (!database) return null;
  const result = await database[action]<T>(target, values as T[]);
  if (!result) return null;
  return result;
};

const createHierarchyQuery = async (
  type: AdapterType,
  name: string,
): Promise<DatabaseResultItem<unknown>[] | null> => {
  const database = readDatabase(type, name);
  if (!database) return null;
  const result = await database.snapshot();
  if (!result) return null;
  const children = result.rows as string[];
  const results = await Promise.all(
    children.map(async (child) =>
      name
        ? database.snapshot(child)
        : readDatabase(type, child)?.snapshot() || null,
    ),
  );
  if (results.some((result) => result === null)) return null;
  return results as DatabaseResultItem<unknown>[];
};

export { createCommonQuery, createHierarchyQuery };

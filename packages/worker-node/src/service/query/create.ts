import { type AdapterType, type DatabaseResultItem } from '../../domain';
import { readDatabase, readDatabases } from '../database';

const createCommonQuery = <T>(
  type: AdapterType,
  name: string,
  action: 'save' | 'remove' | 'read' | 'write' | 'root',
  target: string,
  values: unknown[],
): Promise<DatabaseResultItem<T> | null> | null => {
  const scheduler = readDatabase(type, name);
  if (!scheduler) return null;
  return scheduler.runTask((database) => {
    return database[action]<T>(target, values as T[]);
  }, action === 'read');
};

const createRowsQuery = (
  type: AdapterType,
  name: string,
): Promise<DatabaseResultItem<unknown>[] | null> | null => {
  const scheduler = readDatabase(type, name);
  if (!scheduler) return null;
  return scheduler.runTask(async (database) => {
    return database.snapshotRows();
  }, true);
};

const createTablesQuery = (
  type: AdapterType,
): Promise<DatabaseResultItem<string>[] | null> | null => {
  const schedulers = readDatabases(type);
  if (schedulers.some((scheduler) => !scheduler)) return null;
  const promises = schedulers.map((scheduler) => {
    const promise = scheduler.runTask((database) => {
      return database.snapshotTables();
    });
    return promise;
  });
  return Promise.all(promises).then((results) => {
    if (results.some((result) => !result)) return null;
    return results as DatabaseResultItem<string>[];
  });
};

export { createCommonQuery, createRowsQuery, createTablesQuery };

import {
  type AdapterType,
  type DatabaseEventItem,
  type DatabaseResult,
} from '../../domain';
import { readDatabase, readDatabases } from '../database';

const createCommonQuery = <T>(
  type: AdapterType,
  name: string,
  event: DatabaseEventItem<unknown>,
): Promise<DatabaseResult<T> | null> | null => {
  const scheduler = readDatabase(type, name);
  if (!scheduler) return null;
  return scheduler.runTask((database) => {
    return database.emit<T>(event);
  }, event.action === 'read');
};

const createRowsQuery = (
  type: AdapterType,
  name: string,
): Promise<DatabaseResult<string> | null> | null => {
  const scheduler = readDatabase(type, name);
  if (!scheduler) return null;
  return scheduler.runTask(async (database) => {
    const result = await database.check();
    if (!result) return null;
    return {
      ...result,
      rows: result.rows[0].values || [],
    };
  }, true);
};

const createTablesQuery = (
  type: AdapterType,
): Promise<DatabaseResult<string> | null> | null => {
  const schedulers = readDatabases(type);
  if (schedulers.some((scheduler) => !scheduler)) return null;
  const promises = schedulers.map((scheduler) => {
    const promise = scheduler.runTask(async (database) => {
      const result = await database.check();
      if (!result) return null;
      return result.rows[0];
    });
    return promise;
  });
  return Promise.all(promises).then((results) => {
    if (results.some((result) => !result)) return null;
    return {
      time: 0,
      error: '',
      rows: results.map((result) => result?.name || ''),
      snapshots: results as { name: string; values: string[] }[],
    };
  });
};

export { createCommonQuery, createRowsQuery, createTablesQuery };

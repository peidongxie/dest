import {
  type AdapterType,
  type DatabaseEventItem,
  type DatabaseHierarchy,
  type DatabaseResult,
} from '../../domain';
import { readDatabase, readDatabases } from '../database';

const createQuery = <T>(
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

const createInspection = (
  type: AdapterType,
  name: string,
  withRows: string[] | boolean,
): Promise<DatabaseHierarchy | null> | null => {
  const scheduler = readDatabase(type, name);
  if (!scheduler) return null;
  const promise = scheduler.runTask((database) => {
    try {
      return database.introspect(withRows);
    } catch {
      return null;
    }
  }, true);
  return promise;
};

const createInspections = (
  type: AdapterType,
  withRows: string[] | boolean,
): Promise<DatabaseHierarchy[] | null> => {
  const schedulers = readDatabases(type);
  const promises = schedulers.map((scheduler) => {
    const promise = scheduler.runTask((database) => {
      try {
        return database.introspect(withRows);
      } catch {
        return null;
      }
    }, true);
    return promise;
  });
  return Promise.all(promises).then((hierarchies) => {
    if (hierarchies.some((hierarchy) => !hierarchy)) return null;
    return hierarchies as DatabaseHierarchy[];
  });
};

export { createInspection, createInspections, createQuery };

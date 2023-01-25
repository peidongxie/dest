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
): Promise<DatabaseHierarchy | null> | null => {
  const scheduler = readDatabase(type, name);
  if (!scheduler) return null;
  return scheduler.runTask((database) => {
    try {
      return database.introspect(true);
    } catch {
      return null;
    }
  }, true);
};

const createInspections = (
  type: AdapterType,
): Promise<DatabaseHierarchy[] | null> | null => {
  const schedulers = readDatabases(type);
  if (schedulers.some((scheduler) => !scheduler)) return null;
  const promises = schedulers.map((scheduler) => {
    const promise = scheduler.runTask((database) => {
      try {
        return database.introspect(false);
      } catch {
        return null;
      }
    });
    return promise;
  });
  return Promise.all(promises).then((hierarchies) => {
    if (hierarchies.some((hierarchy) => !hierarchy)) return null;
    return hierarchies as DatabaseHierarchy[];
  });
};

export { createInspection, createInspections, createQuery };

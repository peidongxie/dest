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
  level: 0 | 1 | 2 | 3,
): Promise<DatabaseHierarchy | null> | null => {
  const scheduler = readDatabase(type, name);
  if (!scheduler) return null;
  return scheduler.runTask((database) => {
    return database.introspect(level);
  }, true);
};

const createInspections = (
  type: AdapterType,
  level: 0 | 1 | 2 | 3,
): Promise<DatabaseHierarchy | null> | null => {
  const schedulers = readDatabases(type);
  if (schedulers.some((scheduler) => !scheduler)) return null;
  const promises = schedulers.map((scheduler) => {
    const promise = scheduler.runTask((database) => {
      return database.introspect(level);
    });
    return promise;
  });
  return Promise.all(promises).then((hierarchies) => {
    if (hierarchies.some((hierarchy) => !hierarchy)) return null;
    return {
      type: type,
      databases: hierarchies
        .map((hierarchy) => hierarchy?.databases || [])
        .flat(),
    };
  });
};

export { createInspection, createInspections, createQuery };

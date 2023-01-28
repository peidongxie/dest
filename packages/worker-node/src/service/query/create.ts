import {
  type AdapterType,
  type DatabaseEventItem,
  type DatabaseResult,
} from '../../domain';
import { readDatabase } from '../database';

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

export { createQuery };

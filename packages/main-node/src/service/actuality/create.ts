import {
  type AssertionActuality,
  type AssertionCondition,
  type ClientType,
} from '../../domain';
import { readContext } from '../context';
import { createMemo } from '../memo';

const createReadActuality = <T>(
  type: ClientType,
  name: string,
  condition: AssertionCondition,
): Promise<AssertionActuality<T>> | null => {
  const scheduler = readContext(type, name);
  if (!scheduler) return null;
  const promise = scheduler.runTask(async (context) => {
    const actuality = await context.read<T>(condition.query, condition.values);
    createMemo(['actuality', actuality.uuid], actuality);
    return actuality;
  }, true);
  return promise;
};

const createWriteActuality = <T>(
  type: ClientType,
  name: string,
  condition: AssertionCondition,
): Promise<AssertionActuality<T>> | null => {
  const scheduler = readContext(type, name);
  if (!scheduler) return null;
  const promise = scheduler.runTask(async (context) => {
    const actuality = await context.write<T>(
      condition.query,
      condition.values,
      condition.tables,
    );
    createMemo(['actuality', actuality.uuid], actuality);
    return actuality;
  }, true);
  return promise;
};

export { createReadActuality, createWriteActuality };

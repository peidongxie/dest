import {
  type AssertionActuality,
  type AssertionCondition,
  type ClientType,
} from '../../domain';
import { readContext } from '../context';
import { createMemo } from '../memo';

const createActuality = <T>(
  type: ClientType,
  name: string,
  condition: AssertionCondition,
): Promise<AssertionActuality<T>> | null => {
  const scheduler = readContext(type, name);
  if (!scheduler) return null;
  const promise = scheduler.runTask(async (context) => {
    const actuality = await context[condition.action]<T>(
      condition.query,
      condition.values,
      condition.tables,
    );
    createMemo(['actuality', actuality.uuid], actuality);
    return actuality;
  }, true);
  return promise;
};

export { createActuality };

import { type AdapterType, type Database, type Scheduler } from '../../domain';
import { deleteMemo, deleteMemos, readMemo, readMemos } from '../memo';

const deleteDatabase = (
  type: AdapterType,
  name: string,
): Promise<Scheduler<Database>> | null => {
  const rootScheduler = readMemo<Scheduler<Database>>(['database']);
  if (!rootScheduler) return null;
  const typeScheduler = readMemo<Scheduler<Database>>(['database', type]);
  if (!typeScheduler) return null;
  const scheduler = deleteMemo<Scheduler<Database>>(['database', type, name]);
  if (!scheduler) return null;
  const promise = scheduler.runTask(async (database) => {
    await database.destroy();
    return scheduler;
  });
  rootScheduler.removeStakeholder(scheduler);
  typeScheduler.removeStakeholder(scheduler);
  scheduler.removeStakeholder(rootScheduler);
  scheduler.removeStakeholder(typeScheduler);
  return promise;
};

const deleteDatabases = (): Promise<Scheduler<Database>[]> | null => {
  const promises = [];
  const rootScheduler = deleteMemo<Scheduler<Database>>(['database']);
  const types = readMemos<AdapterType>(['type']);
  for (const type of types) {
    const typeScheduler = deleteMemo<Scheduler<Database>>(['database', type]);
    const schedulers = deleteMemos<Scheduler<Database>>(['database', type]);
    for (const scheduler of schedulers) {
      const promise = scheduler.runTask(async (database) => {
        await database.destroy();
        return scheduler;
      });
      if (rootScheduler) {
        rootScheduler.removeStakeholder(scheduler);
        scheduler.removeStakeholder(rootScheduler);
      }
      if (typeScheduler) {
        typeScheduler.removeStakeholder(scheduler);
        scheduler.removeStakeholder(typeScheduler);
      }
      promises.push(promise);
    }
    if (typeScheduler) {
      const promise = typeScheduler.runTask(async (database) => {
        await database.destroy();
        return typeScheduler;
      });
      if (rootScheduler) {
        typeScheduler.removeStakeholder(rootScheduler);
        rootScheduler.removeStakeholder(typeScheduler);
      }
      promises.push(promise);
    }
  }
  if (rootScheduler) {
    const promise = rootScheduler.runTask(async (database) => {
      await database.destroy();
      return rootScheduler;
    });
    promises.push(promise);
  }
  return Promise.all(promises);
};

export { deleteDatabase, deleteDatabases };

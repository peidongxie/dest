import { type AdapterType, type Database, type Scheduler } from '../../domain';
import { deleteMemo, deleteMemos, readMemo } from '../memo';

const deleteDatabase = (
  type: AdapterType,
  name: string,
): Promise<Scheduler<Database>> | null => {
  const agentScheduler = readMemo<Scheduler<string>>(['agent']);
  if (!agentScheduler) return null;
  const rootScheduler = readMemo<Scheduler<Database>>(['database', type]);
  if (!rootScheduler) return null;
  const scheduler = deleteMemo<Scheduler<Database>>(['database', type, name]);
  if (!scheduler) return null;
  const result = scheduler.runTask(async (database) => {
    await database.destroy();
    return scheduler;
  });
  agentScheduler.removeStakeholder(scheduler);
  rootScheduler.removeStakeholder(scheduler);
  scheduler.removeStakeholder(agentScheduler);
  scheduler.removeStakeholder(rootScheduler);
  return result;
};

const deleteDatabases = (
  type: AdapterType,
): Promise<Scheduler<Database>[]> | null => {
  const agentScheduler = readMemo<Scheduler<string>>(['agent']);
  if (!agentScheduler) return null;
  const rootScheduler = readMemo<Scheduler<Database>>(['database', type]);
  if (!rootScheduler) return null;
  const schedulers = deleteMemos<Scheduler<Database>>(['database', type]);
  if (schedulers.some((scheduler) => !scheduler)) return null;
  const promises = schedulers.map((scheduler) => {
    const promise = scheduler.runTask(async (database) => {
      await database.destroy();
      return scheduler;
    });
    agentScheduler.removeStakeholder(scheduler);
    rootScheduler.removeStakeholder(scheduler);
    scheduler.removeStakeholder(agentScheduler);
    scheduler.removeStakeholder(rootScheduler);
    return promise;
  });
  return Promise.all(promises);
};

export { deleteDatabase, deleteDatabases };

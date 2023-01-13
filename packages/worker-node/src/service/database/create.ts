import { type EntitySchemaOptions } from 'typeorm';
import { Database, Scheduler, type AdapterType } from '../../domain';
import { createMemo, readMemo } from '../memo';

const createDatabase = (
  type: AdapterType,
  name: string,
  schemas: EntitySchemaOptions<unknown>[],
): Promise<Scheduler<Database>> | null => {
  const agentScheduler = readMemo<Scheduler<string>>(['agent']);
  if (!agentScheduler) return null;
  const rootScheduler = readMemo<Scheduler<Database>>(['database', type]);
  if (!rootScheduler) return null;
  const scheduler = createMemo(
    ['database', type, name],
    new Scheduler(new Database(type, name, schemas)),
  );
  if (!scheduler) return null;
  agentScheduler.addStakeholder(scheduler);
  rootScheduler.addStakeholder(scheduler);
  scheduler.addStakeholder(agentScheduler);
  scheduler.addStakeholder(rootScheduler);
  const promise = scheduler.runTask(async (database) => {
    await database.create();
    return scheduler;
  });
  return promise;
};

export { createDatabase };

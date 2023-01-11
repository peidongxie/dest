import { type EntitySchemaOptions } from 'typeorm';
import { Database, Scheduler, type AdapterType } from '../../domain';
import { createMemo, readMemo } from '../memo';

const createDatabase = (
  type: AdapterType,
  name: string,
  schemas: EntitySchemaOptions<unknown>[],
): Promise<Scheduler<Database>> | null => {
  const scheduler = createMemo(
    ['database', type, name],
    new Scheduler(new Database(type, name, schemas)),
  );
  if (!scheduler) return null;
  const rootScheduler = readMemo<Scheduler<Database>>(['database', type, '']);
  if (!rootScheduler) return null;
  scheduler.addStakeholder(rootScheduler);
  rootScheduler.addStakeholder(scheduler);
  const promise = scheduler.runTask(async (database) => {
    await database.create();
    return scheduler;
  });
  return promise;
};

export { createDatabase };

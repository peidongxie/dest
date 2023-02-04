import { type EntitySchemaOptions } from 'typeorm';
import { Database, Scheduler, type AdapterType } from '../../domain';
import { readTypes } from '../constant';
import { createMemo, readMemo, readMemos } from '../memo';

const createDatabase = (
  type: AdapterType,
  name: string,
  schemas: EntitySchemaOptions<unknown>[],
): Promise<Scheduler<Database>> | null => {
  const rootScheduler = readMemo<Scheduler<Database>>(['database']);
  if (!rootScheduler) return null;
  const typeScheduler = readMemo<Scheduler<Database>>(['database', type]);
  if (!typeScheduler) return null;
  const scheduler = createMemo(
    ['database', type, name],
    new Scheduler(new Database(type, name, schemas)),
  );
  if (!scheduler) return null;
  rootScheduler.addStakeholder(scheduler);
  typeScheduler.addStakeholder(scheduler);
  scheduler.addStakeholder(rootScheduler, typeScheduler);
  const promise = scheduler.runTask(async (database) => {
    await database.create();
    return scheduler;
  });
  return promise;
};

const createDatabases = (): Promise<Scheduler<Database>[]> | null => {
  const promises = [];
  const rootScheduler = createMemo(['database'], new Scheduler(new Database()));
  const types = readTypes();
  for (const type of types) {
    const typeScheduler = createMemo(
      ['database', type],
      new Scheduler(new Database(type)),
    );
    const schedulers = readMemos<Scheduler<Database>>(['database', type]);
    for (const scheduler of schedulers) {
      if (rootScheduler) {
        rootScheduler.addStakeholder(scheduler);
        scheduler.addStakeholder(rootScheduler);
      }
      if (typeScheduler) {
        typeScheduler.addStakeholder(scheduler);
        scheduler.addStakeholder(typeScheduler);
      }
      const promise = scheduler.runTask(async (database) => {
        await database.create();
        return scheduler;
      });
      promises.push(promise);
    }
    if (typeScheduler) {
      if (rootScheduler) {
        typeScheduler.addStakeholder(rootScheduler);
        rootScheduler.addStakeholder(typeScheduler);
      }
      const promise = typeScheduler.runTask(async (database) => {
        await database.create();
        return typeScheduler;
      });
      promises.push(promise);
    }
  }
  if (rootScheduler) {
    const promise = rootScheduler.runTask(async (database) => {
      await database.create();
      return rootScheduler;
    });
    promises.push(promise);
  }
  return Promise.allSettled(promises).then((promiseSettledResults) =>
    promiseSettledResults.map((promiseSettledResult) => {
      if (promiseSettledResult.status === 'fulfilled') {
        return promiseSettledResult.value;
      } else {
        throw promiseSettledResult.reason;
      }
    }),
  );
};

export { createDatabase, createDatabases };

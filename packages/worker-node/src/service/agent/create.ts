import { randomUUID } from 'crypto';
import { Database, Scheduler, type AdapterType } from '../../domain';
import { createMemo, readMemos } from '../memo';

const createAgent = (): Promise<Scheduler<string>> | null => {
  const types = readMemos<AdapterType>(['type']);
  const agentScheduler = createMemo(['agent'], new Scheduler(randomUUID()));
  if (!agentScheduler) return null;
  const rootSchedulers = types.map((type) =>
    createMemo(['database', type], new Scheduler(new Database(type))),
  ) as Scheduler<Database>[];
  if (rootSchedulers.some((rootScheduler) => !rootScheduler)) return null;
  const promises = rootSchedulers.map((rootScheduler) => {
    agentScheduler.addStakeholder(rootScheduler);
    rootScheduler.addStakeholder(agentScheduler);
    const promise = rootScheduler.runTask(async (database) => {
      await database.create();
    });
    return promise;
  });
  return Promise.all(promises).then(() => agentScheduler);
};

export { createAgent };

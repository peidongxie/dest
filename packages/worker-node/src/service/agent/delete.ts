import { Database, Scheduler, type AdapterType } from '../../domain';
import { deleteMemo, readMemos } from '../memo';

const deleteAgent = (): Promise<Scheduler<string>> | null => {
  const types = readMemos<AdapterType>(['type']);
  const agentScheduler = deleteMemo<Scheduler<string>>(['agent']);
  if (!agentScheduler) return null;
  const rootSchedulers = types.map((type) =>
    deleteMemo<Scheduler<Database>>(['database', type]),
  ) as Scheduler<Database>[];
  if (rootSchedulers.some((rootScheduler) => !rootScheduler)) return null;
  const promises = rootSchedulers.map((rootScheduler) => {
    const promise = rootScheduler.runTask(async (database) => {
      await database.destroy();
      return rootScheduler;
    });
    agentScheduler.removeStakeholder(rootScheduler);
    rootScheduler.removeStakeholder(agentScheduler);
    return promise;
  });
  return Promise.all(promises).then(() => agentScheduler);
};

export { deleteAgent };

import { type ClientType, type Context, type Scheduler } from '../../domain';
import { readClients } from '../client';
import { deleteMemo } from '../memo';

const deleteContext = (
  type: ClientType,
  name: string,
): Promise<Scheduler<Context>> | null => {
  const scheduler = deleteMemo<Scheduler<Context>>(['context', type, name]);
  if (!scheduler) return null;
  const clients = readClients();
  const promise = scheduler.runTask(async (context) => {
    await context.addClient(...clients);
    return scheduler;
  });
  return promise;
};

export { deleteContext };

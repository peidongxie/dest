import { type Client } from '../../domain';
import { readContexts } from '../context';
import { deleteMemo } from '../memo';

const deleteClient = (token: string): Promise<Client> | null => {
  const client = deleteMemo<Client>(['client', token]);
  if (!client) return null;
  return (async () => {
    const promises = [];
    const schedulers = readContexts();
    for (const scheduler of schedulers) {
      const promise = scheduler.runTask((context) =>
        context.removeClient(client),
      );
      promises.push(promise);
    }
    await Promise.allSettled(promises);
    await client.deleteAgent();
    return client;
  })();
};

export { deleteClient };

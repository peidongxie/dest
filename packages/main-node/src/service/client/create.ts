import { randomUUID } from 'crypto';
import { HttpClient, RpcClient, Scheduler, type Client } from '../../domain';
import { createMemo } from '../memo';

const createClient = (
  api: 'http' | 'rpc',
  port: number,
  hostname: string,
  secret = '',
): Promise<Scheduler<Client> | null> | null => {
  const scheduler =
    api === 'http'
      ? new Scheduler(new HttpClient(port, hostname))
      : api === 'rpc'
      ? new Scheduler(new RpcClient(port, hostname))
      : null;
  if (!scheduler) return null;
  const promise = scheduler.runTask(async (client) => {
    const token = randomUUID();
    const { success } = await client.postAgent(secret, token);
    if (!success) return null;
    return createMemo(['client', token], scheduler);
  });
  return promise;
};

export { createClient };

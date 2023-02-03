import { HttpClient, RpcClient, type Client } from '../../domain';
import { readContexts } from '../context';
import { createMemo } from '../memo';

const createClient = (
  token: string,
  setup: {
    api: 'http' | 'rpc';
    port: number;
    hostname: string;
    secret?: string;
  },
): Promise<Client> | null => {
  const client =
    setup.api === 'http'
      ? createMemo(['client', token], new HttpClient(token, setup))
      : setup.api === 'rpc'
      ? createMemo(['client', token], new RpcClient(token, setup))
      : null;
  if (!client) return null;
  const promises = [];
  const schedulers = readContexts();
  for (const scheduler of schedulers) {
    const promise = scheduler.runTask((context) => context.addClient(client));
    promises.push(promise);
  }
  return Promise.allSettled(promises).then(() => client);
};

export { createClient };

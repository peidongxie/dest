import { HttpClient, RpcClient, type Client } from '../../domain';
import { readContexts } from '../context';
import { createMemo, readMemo } from '../memo';

const createClient = (
  token: string,
  setup: {
    api: 'http' | 'rpc';
    port: number;
    hostname: string;
  },
): Promise<Client> | null => {
  const secret = readMemo<string>(['secret']) || '';
  const client =
    setup.api === 'http'
      ? createMemo(['client', token], new HttpClient(setup, token, secret))
      : setup.api === 'rpc'
      ? createMemo(['client', token], new RpcClient(setup, token, secret))
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

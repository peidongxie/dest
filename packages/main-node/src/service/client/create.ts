import { HttpClient, RpcClient, type Client } from '../../domain';
import { createMemo } from '../memo';

const createClient = async (
  api: 'http' | 'rpc',
  port: number,
  hostname: string,
  secret = '',
): Promise<Client | null> => {
  const client =
    api === 'http'
      ? new HttpClient(port, hostname)
      : api === 'rpc'
      ? new RpcClient(port, hostname)
      : null;
  if (!client) return null;
  const { token } = await client.getAgent(secret);
  return createMemo(['client', token], client);
};

export { createClient };

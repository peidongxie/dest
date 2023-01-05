import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type Route } from '@dest-toolkit/http-client';
import { HttpClient, RpcClient } from '../../domain';
import { createMemo } from '../memo';

const createHttpClient = async (
  api: Route[],
  port: number,
  hostname: string,
): Promise<HttpClient | null> => {
  const client = createMemo(
    ['http-client', port, hostname],
    new HttpClient(api, port, hostname),
  );
  return client || null;
};

const createRpcClient = async <T extends ProtoDefinition>(
  api: T[],
  port: number,
  hostname: string,
): Promise<RpcClient<T> | null> => {
  const client = createMemo(
    ['rpc-client', port, hostname],
    new RpcClient(api, port, hostname),
  );
  return client || null;
};

export { createHttpClient, createRpcClient };

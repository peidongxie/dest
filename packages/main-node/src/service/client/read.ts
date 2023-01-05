import { type ProtoDefinition } from '@dest-toolkit/grpc-client';
import { type HttpClient, type RpcClient } from '../../domain';
import { readMemo } from '../memo';

const readHttpClient = (port: number, hostname: string): HttpClient | null => {
  return readMemo<HttpClient>(['http-client', port, hostname]);
};

const readRpcClient = <T extends ProtoDefinition>(
  port: number,
  hostname: string,
): RpcClient<T> | null => {
  return readMemo<RpcClient<T>>(['rpc-client', port, hostname]);
};

export { readHttpClient, readRpcClient };
